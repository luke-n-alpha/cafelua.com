import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

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
    const metricName = process.env.GA4_VISITOR_METRIC || 'screenPageViews';
    const startDate = process.env.GA4_COUNTER_START_DATE || '2025-11-20';

    if (!propertyId || !clientEmail || !privateKey) {
        return NextResponse.json(
            { error: 'Missing configuration' },
            { status: 503 }
        );
    }

    try {
        const client = new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });

        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            metrics: [{ name: metricName }],
        });

        const count = Number(response.rows?.[0]?.metricValues?.[0]?.value ?? 0);

        return NextResponse.json(
            { count },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
                },
            }
        );
    } catch (error) {
        console.error('GA4 API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch visitor count' },
            { status: 500 }
        );
    }
}
