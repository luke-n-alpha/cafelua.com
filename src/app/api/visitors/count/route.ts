import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET() {
    const propertyId = process.env.GA4_PROPERTY_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

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
            dateRanges: [{ startDate: '2020-01-01', endDate: 'today' }],
            metrics: [{ name: 'totalUsers' }],
        });

        const count = Number(response.rows?.[0]?.metricValues?.[0]?.value ?? 0);

        return NextResponse.json(
            { count },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
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
