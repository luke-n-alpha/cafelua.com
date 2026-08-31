import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const revalidate = 300;

/**
 * Returns view counts for all blog/diary posts.
 * Response: { views: Record<slug, number> }
 */
export async function GET() {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const clientEmail =
        process.env.GA4_CLIENT_EMAIL ||
        process.env.GA_SERVICE_ACCOUNT_EMAIL;
    const privateKey = (
        process.env.GA4_PRIVATE_KEY ||
        process.env.GA_SERVICE_ACCOUNT_PRIVATE_KEY ||
        ''
    ).replace(/\\n/g, '\n');

    if (!propertyId || !clientEmail || !privateKey) {
        return NextResponse.json({ views: {} });
    }

    try {
        const client = new BetaAnalyticsDataClient({
            credentials: { client_email: clientEmail, private_key: privateKey },
        });

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }],
            metrics: [{ name: 'screenPageViews' }],
            dimensionFilter: {
                orGroup: {
                    expressions: [
                        {
                            filter: {
                                fieldName: 'pagePath',
                                stringFilter: { matchType: 'CONTAINS', value: '/desk/' },
                            },
                        },
                        {
                            filter: {
                                fieldName: 'pagePath',
                                stringFilter: { matchType: 'CONTAINS', value: '/gallery/diary/' },
                            },
                        },
                    ],
                },
            },
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 200,
        });

        const views: Record<string, number> = {};
        for (const row of response.rows || []) {
            const rawPath = row.dimensionValues?.[0]?.value || '';
            const pageViews = Number(row.metricValues?.[0]?.value ?? 0);
            // Match /desk/slug or /gallery/diary/slug
            const match = rawPath.match(/\/(?:desk|gallery\/diary)\/([^/?]+)/);
            if (!match) continue;
            let slug: string;
            try {
                slug = decodeURIComponent(match[1]);
            } catch {
                slug = match[1];
            }
            views[slug] = (views[slug] || 0) + pageViews;
        }

        return NextResponse.json(
            { views },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                },
            }
        );
    } catch (error) {
        console.error('GA4 views API error:', error);
        return NextResponse.json({ views: {} });
    }
}
