/**
 * The NEW badge is date-driven, which is the point — nobody has to remember to
 * take it off. That only works if the window is right at both ends, and the
 * near end is the one that bit: the date is read against UTC while it is
 * usually written in Seoul, nine hours ahead.
 */

import { isRecentlyUpdated, NEW_BADGE_DAYS, type SitemapItem } from '@/data/sitemapData';

const item = (updatedAt?: string): SitemapItem => ({
    labelKo: '서재', labelEn: 'Library', path: '/library', updatedAt,
});

describe('isRecentlyUpdated', () => {
    it('says no when the corner carries no date', () => {
        expect(isRecentlyUpdated(item())).toBe(false);
    });

    it('shows on the day itself, even from a timezone ahead of UTC', () => {
        // 2026-09-01 08:00 in Seoul is still 2026-08-31 in UTC.
        const seoulMorning = new Date('2026-08-31T23:00:00Z');
        expect(isRecentlyUpdated(item('2026-09-01'), seoulMorning)).toBe(true);
    });

    it('stays on through the window and falls off after it', () => {
        const changed = Date.parse('2026-09-01T00:00:00Z');
        const day = (n: number) => new Date(changed + n * 86_400_000);
        expect(isRecentlyUpdated(item('2026-09-01'), day(NEW_BADGE_DAYS - 1))).toBe(true);
        expect(isRecentlyUpdated(item('2026-09-01'), day(NEW_BADGE_DAYS + 1))).toBe(false);
    });

    it('ignores a date it cannot read', () => {
        expect(isRecentlyUpdated(item('언젠가'))).toBe(false);
    });
});
