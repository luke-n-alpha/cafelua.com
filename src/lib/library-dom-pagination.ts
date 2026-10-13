export type MeasuredReaderPage = {
  chapterIndex: number;
  chapterTitle: string;
  pageInChapter: number;
  html: string;
  usedHeight: number;
  availableHeight: number;
  /** 펼침면 정렬을 위해 넣은 빈 쪽 */
  blank?: boolean;
};

/**
 * 두 쪽 펼침에서 장이 늘 펼침의 왼쪽 쪽에서 시작하도록, 앞 장이 왼쪽 쪽에서
 * 끝나면 오른쪽에 빈 쪽을 하나 넣는다. 한 쪽 보기(step 1)에서는 그대로 둔다.
 */
export function alignChapterStartsToSpreads(
  pages: MeasuredReaderPage[],
  step: number,
): MeasuredReaderPage[] {
  if (step < 2) return pages;
  const aligned: MeasuredReaderPage[] = [];
  pages.forEach((page, index) => {
    const previous = pages[index - 1];
    const startsChapter = !previous || previous.chapterIndex !== page.chapterIndex;
    if (startsChapter && aligned.length % step !== 0) {
      const last = aligned[aligned.length - 1];
      aligned.push({
        chapterIndex: last.chapterIndex,
        chapterTitle: last.chapterTitle,
        pageInChapter: last.pageInChapter + 1,
        html: "",
        usedHeight: 0,
        availableHeight: last.availableHeight,
        blank: true,
      });
    }
    aligned.push(page);
  });
  return aligned;
}

const FIT_TOLERANCE_PX = 1;

function fits(content: HTMLElement) {
  return content.scrollHeight <= content.clientHeight + FIT_TOLERANCE_PX;
}

function textBoundary(root: Element, absoluteOffset: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = absoluteOffset;
  let node = walker.nextNode() as Text | null;
  while (node) {
    if (remaining <= node.data.length) return { node, offset: remaining };
    remaining -= node.data.length;
    node = walker.nextNode() as Text | null;
  }
  return null;
}

function fragmentBetween(root: Element, start: number, end: number) {
  const startBoundary = textBoundary(root, start);
  const endBoundary = textBoundary(root, end);
  if (!startBoundary || !endBoundary) return null;
  const range = document.createRange();
  range.setStart(startBoundary.node, startBoundary.offset);
  range.setEnd(endBoundary.node, endBoundary.offset);
  const shell = root.cloneNode(false) as Element;
  shell.append(range.cloneContents());
  return shell;
}

function measuredSplit(
  source: Element,
  content: HTMLElement,
): { head: Element; tail: Element | null } | null {
  const text = source.textContent ?? "";
  if (text.length < 2) return null;

  // 앞쪽 공백까지만 자르면 빈 인용 상자 같은 껍데기만 앞 쪽에 남으므로, 첫 글자가 들어가는 곳부터 자른다.
  const firstVisible = text.search(/\S/u);
  if (firstVisible < 0) return null;
  const boundaries = [0];
  for (const match of text.matchAll(/\s+/gu)) {
    const boundary = match.index + match[0].length;
    if (boundary > firstVisible) boundaries.push(boundary);
  }
  if (boundaries.at(-1) !== text.length) boundaries.push(text.length);

  let low = 1;
  let high = boundaries.length - 1;
  let best = 0;
  let candidate: Element | null = null;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    candidate?.remove();
    candidate = fragmentBetween(source, 0, boundaries[middle]);
    if (!candidate) break;
    content.append(candidate);
    if (fits(content)) {
      best = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  candidate?.remove();
  if (best === 0) return null;
  const cut = boundaries[best];
  return {
    head: fragmentBetween(source, 0, cut)!,
    tail: cut < text.length ? fragmentBetween(source, cut, text.length) : null,
  };
}

function emptyTableClone(table: HTMLTableElement) {
  const clone = table.cloneNode(true) as HTMLTableElement;
  clone.querySelectorAll("tbody").forEach((body) => body.replaceChildren());
  return clone;
}

function shrinkTableToFit(table: HTMLTableElement, content: HTMLElement) {
  let scale = 0.95;
  while (!fits(content) && scale >= 0.5) {
    table.style.fontSize = `${scale}em`;
    scale -= 0.05;
  }
}

export function measureRenderedReaderPages(
  sourceRoot: HTMLElement,
  templatePage: HTMLElement,
): MeasuredReaderPage[] {
  const templateBounds = templatePage.getBoundingClientRect();
  if (templateBounds.width < 1 || templateBounds.height < 1) return [];

  const probe = templatePage.cloneNode(true) as HTMLElement;
  probe.removeAttribute("data-measure-template");
  probe.setAttribute("aria-hidden", "true");
  probe.style.position = "fixed";
  probe.style.left = "-10000px";
  probe.style.top = "0";
  probe.style.width = `${templateBounds.width}px`;
  probe.style.height = `${templateBounds.height}px`;
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.setProperty(
    "--reader-font-scale",
    getComputedStyle(templatePage).getPropertyValue("--reader-font-scale") || "1",
  );
  document.body.append(probe);

  const content = probe.querySelector<HTMLElement>(".library-paper-content");
  if (!content) {
    probe.remove();
    return [];
  }
  content.replaceChildren();

  const pages: MeasuredReaderPage[] = [];
  let chapterIndex = 0;
  let chapterTitle = "";
  let pageInChapter = 0;

  const flush = () => {
    if (!content.childNodes.length) return;
    pages.push({
      chapterIndex,
      chapterTitle,
      pageInChapter: pageInChapter++,
      html: content.innerHTML,
      usedHeight: content.scrollHeight,
      availableHeight: content.clientHeight,
    });
    content.replaceChildren();
  };

  const appendBlock = (sourceBlock: Element) => {
    let block: Element | null = sourceBlock.cloneNode(true) as Element;
    while (block) {
      content.append(block);
      if (fits(content)) return;
      block.remove();
      // 그림이 든 덩어리는 글자 단위로 자르면 그림이 빠지므로 통째로 다음 쪽에 놓는다.
      if (block.querySelector("img")) {
        if (content.childNodes.length) {
          flush();
          continue;
        }
        content.replaceChildren(block);
        flush();
        return;
      }
      if (content.childNodes.length) {
        const split = measuredSplit(block, content);
        if (split) {
          content.append(split.head);
          flush();
          block = split.tail;
          continue;
        }
        flush();
        continue;
      }

      const split = measuredSplit(block, content);
      if (!split) {
        content.replaceChildren(block);
        flush();
        return;
      }
      content.append(split.head);
      flush();
      block = split.tail;
    }
  };

  const appendTable = (sourceTable: HTMLTableElement) => {
    const wholeTable = sourceTable.cloneNode(true) as HTMLTableElement;
    content.append(wholeTable);
    if (fits(content)) return;
    wholeTable.remove();
    if (content.childNodes.length) flush();

    const sourceBodies = Array.from(sourceTable.tBodies);
    const rows = sourceBodies.flatMap((body, bodyIndex) =>
      Array.from(body.rows).map((row) => ({ row, bodyIndex })),
    );
    let fragment = emptyTableClone(sourceTable);
    content.append(fragment);

    for (const { row, bodyIndex } of rows) {
      const targetBody = fragment.tBodies[bodyIndex] ?? fragment.createTBody();
      const rowClone = row.cloneNode(true) as HTMLTableRowElement;
      targetBody.append(rowClone);
      if (fits(content)) continue;

      rowClone.remove();
      const hasRows = Array.from(fragment.tBodies).some((body) => body.rows.length > 0);
      if (hasRows) {
        flush();
        fragment = emptyTableClone(sourceTable);
        content.append(fragment);
        (fragment.tBodies[bodyIndex] ?? fragment.createTBody()).append(rowClone);
        shrinkTableToFit(fragment, content);
      } else {
        // A single unusually tall row is still measured, then reduced only as far as
        // needed. Normal rows never enter this fallback.
        targetBody.append(rowClone);
        shrinkTableToFit(fragment, content);
      }
    }
  };

  for (const chapter of sourceRoot.querySelectorAll<HTMLElement>("[data-reader-chapter]")) {
    flush();
    chapterIndex = Number(chapter.dataset.chapterIndex ?? 0);
    chapterTitle = chapter.dataset.chapterTitle ?? "";
    pageInChapter = 0;
    // 한 장에 여러 편이 들어가는 책은 소제목에서 쪽을 새로 시작한다. 시 한 편이
    // 앞 편의 꼬리에 붙어 시작하면 어디서 끝나고 어디서 시작하는지 읽히지 않는다.
    const breakOn = chapter.dataset.pageBreakOn;
    for (const child of Array.from(chapter.children)) {
      if (breakOn === "h2" && child.tagName === "H2" && content.childNodes.length) flush();
      if (child instanceof HTMLTableElement) appendTable(child);
      else appendBlock(child);
    }
    flush();
  }

  probe.remove();
  return pages;
}
