#!/usr/bin/env node
/**
 * Carry the guestbook and the comments over from Firestore to Azure Table Storage.
 *
 * Reads the backup taken before the move — one Firestore REST document per
 * line — and writes each one into the matching table. Document ids are kept
 * exactly as they were: replies point at their parent by id, and the delete
 * path is given nothing but an id, so changing them would quietly break both.
 *
 * Running it twice leaves the same result as running it once.
 *
 * Usage:
 *   CAFELUA_TABLES_CONNECTION=... node scripts/migrate-firestore-to-tables.mjs [--dry-run]
 *   node scripts/migrate-firestore-to-tables.mjs --from /path/to/backup
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { TableClient } from '@azure/data-tables';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fromFlag = args.indexOf('--from');
const BACKUP = fromFlag === -1
    ? '/var/home/luke/alpha-adk/data-private/cafelua-firestore-backup-20260901'
    : args[fromFlag + 1];

// collection file → table name and partition key
const SETS = [
    { file: 'guestbook.ndjson', table: 'guestbook', partition: 'guestbook' },
    { file: 'comments.ndjson', table: 'comments', partition: 'comment' },
];

/**
 * Firestore writes every value as a one-key object naming its type. Only the
 * four types the backup actually contains are handled; anything else stops the
 * run rather than being guessed at, because a silently dropped field here is a
 * lost guestbook entry later.
 */
function plain(wrapped, where) {
    const [kind, value] = Object.entries(wrapped)[0];
    switch (kind) {
        case 'stringValue':
            return value;
        case 'booleanValue':
            return value;
        case 'timestampValue':
            return new Date(value);
        case 'nullValue':
            return null;
        default:
            throw new Error(`${where}: 처음 보는 Firestore 타입 ${kind}`);
    }
}

function toRow(document, partition) {
    const id = document.name.split('/').pop();
    const row = { partitionKey: partition, rowKey: id };
    for (const [key, wrapped] of Object.entries(document.fields ?? {})) {
        const value = plain(wrapped, `${id}.${key}`);
        // Table Storage has no null. The reader treats an absent property and a
        // null as the same thing, so leaving it off is the faithful move.
        if (value === null) continue;
        row[key] = value;
    }
    // createdAt carried the ordering in Firestore and still does here.
    if (!row.createdAt && document.createTime) {
        row.createdAt = new Date(document.createTime);
    }
    if (row.deleted === undefined) row.deleted = false;
    return row;
}

async function run() {
    const connection = process.env.CAFELUA_TABLES_CONNECTION;
    if (!connection && !dryRun) {
        console.error('CAFELUA_TABLES_CONNECTION 이 없습니다. --dry-run 이 아니면 필요합니다.');
        process.exit(2);
    }

    let written = 0;
    for (const set of SETS) {
        const file = path.join(BACKUP, set.file);
        const lines = (await readFile(file, 'utf8')).split('\n').filter(Boolean);
        const rows = lines.map((line) => toRow(JSON.parse(line), set.partition));

        console.log(`\n${set.table} — ${rows.length}건`);
        for (const row of rows) {
            const when = row.createdAt instanceof Date ? row.createdAt.toISOString().slice(0, 10) : '?';
            const who = row.nickname ?? '';
            const what = String(row.message ?? row.content ?? '').replace(/\s+/g, ' ').slice(0, 32);
            console.log(`  ${row.rowKey}  ${when}  ${who.padEnd(8)}  ${what}`);
        }

        if (dryRun) continue;

        const client = TableClient.fromConnectionString(connection, set.table);
        for (const row of rows) {
            // Replace, not merge: the backup is the whole truth for these rows,
            // and a rerun should not leave half of an earlier attempt behind.
            await client.upsertEntity(row, 'Replace');
            written += 1;
        }
    }

    console.log(dryRun
        ? '\n--dry-run 이라 아무것도 쓰지 않았습니다.'
        : `\n${written}건을 옮겼습니다.`);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
