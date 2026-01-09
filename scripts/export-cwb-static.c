#include <errno.h>
#include <gdbm.h>
#include <iconv.h>
#include <limits.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

typedef struct Post {
    int num;
    int parent;
    bool exists;
    bool skipped;
    int depth;
    long long sortKey;
    char *name;
    char *email;
    char *subject;
    char *text;
    char dateStr[32];
} Post;

static void die(const char *fmt, ...) {
    va_list args;
    va_start(args, fmt);
    vfprintf(stderr, fmt, args);
    va_end(args);
    fputc('\n', stderr);
    exit(1);
}

static bool ensure_dir(const char *path) {
    if (mkdir(path, 0755) == 0) return true;
    if (errno == EEXIST) return true;
    return false;
}

static bool ensure_dir_recursive(const char *path) {
    char tmp[PATH_MAX];
    size_t len;

    if (path == NULL || *path == '\0') return false;
    len = strlen(path);
    if (len >= sizeof(tmp)) return false;

    strcpy(tmp, path);
    if (tmp[len - 1] == '/') tmp[len - 1] = '\0';

    for (char *p = tmp + 1; *p; p++) {
        if (*p == '/') {
            *p = '\0';
            if (!ensure_dir(tmp)) return false;
            *p = '/';
        }
    }
    return ensure_dir(tmp);
}

static char *gdbm_fetch_cstr(GDBM_FILE db, const char *key) {
    datum k;
    datum v;
    k.dptr = (char *)key;
    k.dsize = (int)strlen(key) + 1;
    v = gdbm_fetch(db, k);
    return v.dptr;
}

static long long parse_date_sort_key(const char *date) {
    if (date == NULL) return 0;
    char buf[32] = {0};
    size_t n = strlen(date);
    if (n > 14) n = 14;
    memcpy(buf, date, n);
    return atoll(buf);
}

static void format_date_str(const char *date, char out[32]) {
    int y = 0, mo = 0, d = 0, h = 0, mi = 0, s = 0;
    if (date != NULL && strlen(date) >= 12) {
        sscanf(date, "%4d%2d%2d%2d%2d%2d", &y, &mo, &d, &h, &mi, &s);
    }
    if (y > 0) {
        snprintf(out, 32, "%04d-%02d-%02d %02d:%02d", y, mo, d, h, mi);
    } else {
        snprintf(out, 32, "-");
    }
}

static char *iconv_convert_best_effort(iconv_t cd, const char *input) {
    if (input == NULL) return strdup("");

    size_t in_len = strlen(input);
    size_t out_cap = (in_len * 4) + 64;
    char *out = (char *)malloc(out_cap);
    if (out == NULL) die("Out of memory");

    iconv(cd, NULL, NULL, NULL, NULL);

    char *in_ptr = (char *)input;
    size_t in_left = in_len;
    char *out_ptr = out;
    size_t out_left = out_cap - 1;

    while (in_left > 0) {
        size_t res = iconv(cd, &in_ptr, &in_left, &out_ptr, &out_left);
        if (res != (size_t)-1) continue;

        if (errno == E2BIG) {
            size_t used = (size_t)(out_ptr - out);
            out_cap *= 2;
            out = (char *)realloc(out, out_cap);
            if (out == NULL) die("Out of memory");
            out_ptr = out + used;
            out_left = out_cap - used - 1;
            continue;
        }

        if (errno == EILSEQ || errno == EINVAL) {
            if (out_left < 2) {
                size_t used = (size_t)(out_ptr - out);
                out_cap *= 2;
                out = (char *)realloc(out, out_cap);
                if (out == NULL) die("Out of memory");
                out_ptr = out + used;
                out_left = out_cap - used - 1;
            }
            *out_ptr++ = '?';
            out_left--;
            in_ptr++;
            in_left--;
            continue;
        }

        break;
    }

    *out_ptr = '\0';
    return out;
}

static char *html_escape(const char *s) {
    if (s == NULL) return strdup("");

    size_t len = strlen(s);
    size_t cap = (len * 6) + 32;
    char *out = (char *)malloc(cap);
    if (out == NULL) die("Out of memory");

    char *p = out;
    for (size_t i = 0; i < len; i++) {
        char c = s[i];
        switch (c) {
            case '&':
                memcpy(p, "&amp;", 5);
                p += 5;
                break;
            case '<':
                memcpy(p, "&lt;", 4);
                p += 4;
                break;
            case '>':
                memcpy(p, "&gt;", 4);
                p += 4;
                break;
            case '"':
                memcpy(p, "&quot;", 6);
                p += 6;
                break;
            case '\'':
                memcpy(p, "&#39;", 5);
                p += 5;
                break;
            default:
                *p++ = c;
        }
    }
    *p = '\0';
    return out;
}

static bool contains_case_insensitive(const char *haystack, const char *needle) {
    if (haystack == NULL || needle == NULL) return false;
    size_t nlen = strlen(needle);
    if (nlen == 0) return false;

    for (const char *p = haystack; *p; p++) {
        if (strncasecmp(p, needle, nlen) == 0) return true;
    }
    return false;
}

static bool should_skip_private(const char *subjectUtf8, const char *textUtf8) {
    if (subjectUtf8 == NULL) subjectUtf8 = "";
    if (textUtf8 == NULL) textUtf8 = "";

    if (strstr(subjectUtf8, "비공개") != NULL) return true;
    if (strstr(subjectUtf8, "비밀") != NULL) return true;
    if (strstr(textUtf8, "비공개") != NULL) return true;
    if (strstr(textUtf8, "비밀") != NULL) return true;

    if (contains_case_insensitive(subjectUtf8, "private")) return true;
    if (contains_case_insensitive(subjectUtf8, "secret")) return true;
    if (contains_case_insensitive(textUtf8, "private")) return true;
    if (contains_case_insensitive(textUtf8, "secret")) return true;

    return false;
}

typedef struct IndexItem {
    int num;
    int thread;
    int depth;
} IndexItem;

static int find_thread(IndexItem *dIndex, int upper, int num) {
    for (int i = upper - 1; i >= 0; i--) {
        if (dIndex[i].thread == num) return i;
    }
    return -1;
}

static int push_stack(int *stackNum, int *stackIdx, int *sp, int num, int idx, int stackMax) {
    if (*sp >= stackMax) return -1;
    stackNum[*sp] = num;
    stackIdx[*sp] = idx;
    (*sp)++;
    return *sp;
}

static bool pop_stack(int *stackNum, int *stackIdx, int *sp, int *outNum, int *outIdx) {
    if (*sp <= 0) return false;
    (*sp)--;
    *outNum = stackNum[*sp];
    *outIdx = stackIdx[*sp];
    return true;
}

static int build_thread_index(Post *posts, int lastNum, IndexItem **outIndex) {
    int count = 0;
    for (int i = 1; i <= lastNum; i++) {
        if (posts[i].exists && !posts[i].skipped) count++;
    }
    if (count == 0) {
        *outIndex = NULL;
        return 0;
    }

    IndexItem *dIndex = (IndexItem *)calloc((size_t)count + 1, sizeof(IndexItem));
    if (dIndex == NULL) die("Out of memory");

    int j = 0;
    for (int i = lastNum; i >= 1; i--) {
        if (!posts[i].exists || posts[i].skipped) continue;
        dIndex[j].num = i;
        dIndex[j].thread = posts[i].parent;
        j++;
    }
    dIndex[j].num = 0;
    dIndex[j].thread = 0;

    for (int i = 0; dIndex[i].num != 0; i++) {
        if (dIndex[i].thread == 0) continue;
        bool found = false;
        for (int k = i + 1; dIndex[k].num != 0; k++) {
            if (dIndex[k].num == dIndex[i].thread) {
                found = true;
                break;
            }
        }
        if (!found) dIndex[i].thread = 0;
    }

    IndexItem *tIndex = (IndexItem *)calloc((size_t)count + 1, sizeof(IndexItem));
    if (tIndex == NULL) die("Out of memory");

    const int stackMax = 256;
    int stackNum[stackMax];
    int stackIdx[stackMax];
    int sp = 0;

    int ip = 0;
    for (int di = 0; dIndex[di].num != 0; di++) {
        if (dIndex[di].thread != 0) continue;

        tIndex[ip++] = (IndexItem){.num = dIndex[di].num, .thread = 0, .depth = 0};

        int threadNum = dIndex[di].num;
        int threadI = di;

        while (1) {
            int foundI = find_thread(dIndex, threadI, threadNum);
            if (foundI >= 0) {
                int depth = push_stack(stackNum, stackIdx, &sp, threadNum, foundI, stackMax);
                if (depth < 0) break;

                tIndex[ip++] = (IndexItem){.num = dIndex[foundI].num, .thread = dIndex[foundI].thread, .depth = depth};
                threadNum = dIndex[foundI].num;
                threadI = foundI;
                continue;
            }

            if (!pop_stack(stackNum, stackIdx, &sp, &threadNum, &threadI)) break;
        }
    }

    free(dIndex);

    *outIndex = tIndex;
    return ip;
}

static void write_css(const char *dir) {
    char path[PATH_MAX];
    snprintf(path, sizeof(path), "%s/cwb.css", dir);
    FILE *fp = fopen(path, "wb");
    if (fp == NULL) die("Failed to write %s", path);

    const char *css =
        "body{font-family:Verdana,Arial,sans-serif;background:#f7f7f7;color:#111;margin:0;padding:16px;}\n"
        ".cwb-wrap{max-width:920px;margin:0 auto;}\n"
        ".cwb-title{font-size:20px;margin:0 0 6px 0;}\n"
        ".cwb-subtitle{margin:0 0 12px 0;color:#444;font-size:12px;}\n"
        ".cwb-nav{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0;}\n"
        ".cwb-nav a{color:#0033cc;text-decoration:none;}\n"
        ".cwb-nav a:hover{text-decoration:underline;}\n"
        ".cwb-table{width:100%;border-collapse:collapse;background:#fff;border:1px solid #bbb;}\n"
        ".cwb-table th,.cwb-table td{border-bottom:1px solid #e3e3e3;padding:8px;font-size:13px;}\n"
        ".cwb-table th{background:#ffffcc;border-bottom:1px solid #bbb;}\n"
        ".cwb-num{width:72px;text-align:right;color:#555;}\n"
        ".cwb-name{width:180px;}\n"
        ".cwb-date{width:160px;color:#555;white-space:nowrap;}\n"
        ".cwb-subject a{color:#0033cc;text-decoration:none;}\n"
        ".cwb-subject a:hover{text-decoration:underline;}\n"
        ".cwb-depth-1 .cwb-subject{padding-left:20px;}\n"
        ".cwb-depth-2 .cwb-subject{padding-left:40px;}\n"
        ".cwb-depth-3 .cwb-subject{padding-left:60px;}\n"
        ".cwb-post{background:#fff;border:1px solid #bbb;padding:12px;}\n"
        ".cwb-meta{font-size:12px;color:#444;margin:8px 0 12px 0;}\n"
        ".cwb-meta a{color:#0033cc;text-decoration:none;}\n"
        ".cwb-meta a:hover{text-decoration:underline;}\n"
        ".cwb-text{white-space:pre-wrap;line-height:1.45;font-family:inherit;margin:0;}\n";

    fwrite(css, 1, strlen(css), fp);
    fclose(fp);
}

static void write_list_page(const char *dir, const char *title, Post *posts, int lastNum, IndexItem *tIndex, int tCount) {
    char path[PATH_MAX];
    snprintf(path, sizeof(path), "%s/index.html", dir);
    FILE *fp = fopen(path, "wb");
    if (fp == NULL) die("Failed to write %s", path);

    fprintf(fp,
        "<!doctype html>\n"
        "<html>\n"
        "<head>\n"
        "<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        "<title>%s</title>\n"
        "<link rel=\"stylesheet\" href=\"./cwb.css\">\n"
        "</head>\n"
        "<body>\n"
        "<div class=\"cwb-wrap\">\n"
        "<h1 class=\"cwb-title\">%s</h1>\n"
        "<p class=\"cwb-subtitle\">추억 보존용 정적 아카이브입니다. (글쓰기/수정/삭제 비활성화)</p>\n"
        "<div class=\"cwb-nav\">\n"
        "<a href=\"../menu.html\">← 마을로 돌아가기</a>\n"
        "</div>\n",
        title,
        title
    );

    fprintf(fp,
        "<table class=\"cwb-table\">\n"
        "<thead><tr>"
        "<th class=\"cwb-num\">번호</th>"
        "<th>제목</th>"
        "<th class=\"cwb-name\">이름</th>"
        "<th class=\"cwb-date\">날짜</th>"
        "</tr></thead>\n"
        "<tbody>\n"
    );

    if (tCount == 0) {
        fprintf(fp, "<tr><td colspan=\"4\" style=\"padding:16px;color:#666;\">게시물이 없습니다.</td></tr>\n");
    } else {
        for (int i = 0; i < tCount; i++) {
            int num = tIndex[i].num;
            int depth = tIndex[i].depth;
            if (num <= 0 || num > lastNum) continue;
            Post *p = &posts[num];
            if (!p->exists || p->skipped) continue;

            char *safeSubject = html_escape(p->subject);
            char *safeName = html_escape(p->name);
            fprintf(
                fp,
                "<tr class=\"cwb-depth-%d\">"
                "<td class=\"cwb-num\">%d</td>"
                "<td class=\"cwb-subject\"><a href=\"posts/%d.html\">%s</a></td>"
                "<td class=\"cwb-name\">%s</td>"
                "<td class=\"cwb-date\">%s</td>"
                "</tr>\n",
                depth,
                p->num,
                p->num,
                safeSubject,
                safeName,
                p->dateStr
            );
            free(safeSubject);
            free(safeName);
        }
    }

    fprintf(fp,
        "</tbody>\n"
        "</table>\n"
        "<div class=\"cwb-nav\">\n"
        "<a href=\"../menu.html\">← 마을로 돌아가기</a>\n"
        "</div>\n"
        "</div>\n"
        "</body>\n"
        "</html>\n"
    );
    fclose(fp);
}

static void write_post_page(const char *dir, const char *title, Post *posts, int lastNum, IndexItem *tIndex, int tCount, int idx) {
    int num = tIndex[idx].num;
    if (num <= 0 || num > lastNum) return;
    Post *p = &posts[num];
    if (!p->exists || p->skipped) return;

    char postsDir[PATH_MAX];
    snprintf(postsDir, sizeof(postsDir), "%s/posts", dir);

    char path[PATH_MAX];
    snprintf(path, sizeof(path), "%s/%d.html", postsDir, num);
    FILE *fp = fopen(path, "wb");
    if (fp == NULL) die("Failed to write %s", path);

    int prevNum = (idx > 0) ? tIndex[idx - 1].num : 0;
    int nextNum = (idx + 1 < tCount) ? tIndex[idx + 1].num : 0;

    char *safeSubject = html_escape(p->subject);
    char *safeName = html_escape(p->name);
    char *safeEmail = html_escape(p->email);
    char *safeText = html_escape(p->text);

    fprintf(fp,
        "<!doctype html>\n"
        "<html>\n"
        "<head>\n"
        "<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        "<title>%s - %s</title>\n"
        "<link rel=\"stylesheet\" href=\"../cwb.css\">\n"
        "</head>\n"
        "<body>\n"
        "<div class=\"cwb-wrap\">\n"
        "<div class=\"cwb-nav\">\n"
        "<a href=\"../index.html\">← 목록</a>\n"
        "<a href=\"../../menu.html\">← 마을로</a>\n"
        "</div>\n"
        "<h1 class=\"cwb-title\">%s</h1>\n"
        "<div class=\"cwb-meta\">\n"
        "<div>글번호: %d</div>\n"
        "<div>작성자: %s",
        safeSubject,
        title,
        safeSubject,
        p->num,
        safeName
    );

    if (p->email != NULL && strlen(p->email) > 0) {
        fprintf(fp, " (<a href=\"mailto:%s\">%s</a>)", safeEmail, safeEmail);
    }

    fprintf(fp,
        "</div>\n"
        "<div>작성일: %s</div>\n"
        "</div>\n"
        "<div class=\"cwb-post\">\n"
        "<pre class=\"cwb-text\">%s</pre>\n"
        "</div>\n"
        "<div class=\"cwb-nav\">\n",
        p->dateStr,
        safeText
    );

    if (prevNum > 0) fprintf(fp, "<a href=\"%d.html\">← 이전 글</a>", prevNum);
    if (nextNum > 0) fprintf(fp, "<a href=\"%d.html\">다음 글 →</a>", nextNum);

    fprintf(fp,
        "</div>\n"
        "</div>\n"
        "</body>\n"
        "</html>\n"
    );

    free(safeSubject);
    free(safeName);
    free(safeEmail);
    free(safeText);
    fclose(fp);
}

static void propagate_skip(Post *posts, int lastNum) {
    bool changed = true;
    while (changed) {
        changed = false;
        for (int i = 1; i <= lastNum; i++) {
            if (!posts[i].exists) continue;
            if (posts[i].skipped) continue;
            int parent = posts[i].parent;
            if (parent > 0 && parent <= lastNum && posts[parent].exists && posts[parent].skipped) {
                posts[i].skipped = true;
                changed = true;
            }
        }
    }
}

int main(int argc, char **argv) {
    if (argc < 4) {
        fprintf(stderr, "Usage: %s <db_path.gdbm> <output_dir> <title>\\n", argv[0]);
        return 1;
    }

    const char *dbPath = argv[1];
    const char *outDir = argv[2];
    const char *title = argv[3];

    GDBM_FILE db = gdbm_open((char *)dbPath, 0, GDBM_READER | GDBM_NOMMAP, 0, NULL);
    if (db == NULL) die("Failed to open gdbm: %s", dbPath);

    char *lastNumStr = gdbm_fetch_cstr(db, "conf.LastNum");
    int lastNum = 0;
    if (lastNumStr != NULL) {
        lastNum = atoi(lastNumStr);
        free(lastNumStr);
    }
    if (lastNum <= 0 || lastNum > 50000) {
        gdbm_close(db);
        die("Invalid conf.LastNum in %s", dbPath);
    }

    Post *posts = (Post *)calloc((size_t)lastNum + 1, sizeof(Post));
    if (posts == NULL) die("Out of memory");

    iconv_t cd = iconv_open("UTF-8", "CP949");
    if (cd == (iconv_t)-1) die("iconv_open failed");

    int total = 0;
    for (int i = 1; i <= lastNum; i++) {
        char key[64];
        snprintf(key, sizeof(key), "%d.Thread", i);
        char *threadStr = gdbm_fetch_cstr(db, key);
        if (threadStr == NULL) continue;

        posts[i].exists = true;
        posts[i].num = i;
        posts[i].parent = atoi(threadStr);
        free(threadStr);

        snprintf(key, sizeof(key), "%d.Name", i);
        char *name = gdbm_fetch_cstr(db, key);
        snprintf(key, sizeof(key), "%d.Email", i);
        char *email = gdbm_fetch_cstr(db, key);
        snprintf(key, sizeof(key), "%d.Subject", i);
        char *subject = gdbm_fetch_cstr(db, key);
        snprintf(key, sizeof(key), "%d.Text", i);
        char *text = gdbm_fetch_cstr(db, key);
        snprintf(key, sizeof(key), "%d.Date", i);
        char *date = gdbm_fetch_cstr(db, key);

        char *nameUtf8 = iconv_convert_best_effort(cd, name);
        char *emailUtf8 = iconv_convert_best_effort(cd, email);
        char *subjectUtf8 = iconv_convert_best_effort(cd, subject);
        char *textUtf8 = iconv_convert_best_effort(cd, text);

        posts[i].name = nameUtf8;
        posts[i].email = emailUtf8;
        posts[i].subject = subjectUtf8;
        posts[i].text = textUtf8;
        posts[i].sortKey = parse_date_sort_key(date);
        format_date_str(date, posts[i].dateStr);

        posts[i].skipped = should_skip_private(subjectUtf8, textUtf8);

        if (name != NULL) free(name);
        if (email != NULL) free(email);
        if (subject != NULL) free(subject);
        if (text != NULL) free(text);
        if (date != NULL) free(date);

        total++;
    }

    propagate_skip(posts, lastNum);

    if (!ensure_dir_recursive(outDir)) die("Failed to create directory: %s", outDir);

    char postsDir[PATH_MAX];
    snprintf(postsDir, sizeof(postsDir), "%s/posts", outDir);
    if (!ensure_dir_recursive(postsDir)) die("Failed to create directory: %s", postsDir);

    write_css(outDir);

    IndexItem *tIndex = NULL;
    int tCount = build_thread_index(posts, lastNum, &tIndex);

    write_list_page(outDir, title, posts, lastNum, tIndex, tCount);
    for (int i = 0; i < tCount; i++) {
        write_post_page(outDir, title, posts, lastNum, tIndex, tCount, i);
    }

    free(tIndex);

    for (int i = 1; i <= lastNum; i++) {
        if (!posts[i].exists) continue;
        free(posts[i].name);
        free(posts[i].email);
        free(posts[i].subject);
        free(posts[i].text);
    }
    free(posts);
    iconv_close(cd);
    gdbm_close(db);

    fprintf(stderr, "Exported %d posts from %s -> %s\\n", total, dbPath, outDir);
    return 0;
}
