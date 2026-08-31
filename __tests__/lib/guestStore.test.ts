/**
 * The parts of the move off Firestore that can go wrong quietly.
 *
 * Table Storage cannot hold a null, so a property that would be null is left
 * off the row instead — which means an absent property and an explicit null
 * have to read back the same way, or a reply would look like a top-level entry
 * and the whole thread would flatten. And the ids have to keep the shape the
 * routes validate, because a reply points at its parent by id.
 */

import { newId, withoutEmpty } from '@/lib/table-rows';

const ROUTE_ID_RE = /^[a-zA-Z0-9]{10,30}$/;

describe('newId', () => {
    it('matches the id shape the routes accept', () => {
        for (let i = 0; i < 200; i += 1) {
            expect(newId()).toMatch(ROUTE_ID_RE);
        }
    });

    it('does not repeat itself', () => {
        const seen = new Set<string>();
        for (let i = 0; i < 500; i += 1) seen.add(newId());
        expect(seen.size).toBe(500);
    });
});

describe('withoutEmpty', () => {
    it('drops the properties Table Storage cannot hold', () => {
        const row = withoutEmpty({
            partitionKey: 'guestbook',
            rowKey: 'abcdefghij',
            nickname: '몽이',
            parentId: null,
            email: undefined,
            isSecret: false,
            deleted: false,
        });

        expect(row).not.toHaveProperty('parentId');
        expect(row).not.toHaveProperty('email');
    });

    it('keeps false, zero and the empty string, which are values and not absences', () => {
        const row = withoutEmpty({ isSecret: false, count: 0, message: '' });

        expect(row.isSecret).toBe(false);
        expect(row.count).toBe(0);
        expect(row.message).toBe('');
    });
});
