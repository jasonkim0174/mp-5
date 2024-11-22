import { redirect } from 'next/navigation';
import getCollection from '@/db';

interface PageProps {
    params: { alias: string };
}

export const dynamic = 'force-dynamic';

export default async function AliasPage({ params }: PageProps) {
    const { alias } = params;

    if (!process.env.MONGO_URI) {
        console.warn('MONGO_URI is not defined. Skipping database connection.');
        return <h1>Environment variable not set. Cannot resolve alias.</h1>;
    }

    try {
        const collection = await getCollection('alias-archive');
        const entry = await collection.findOne({ alias });

        if (!entry) {
            return <h1>Alias not found</h1>;
        }

        redirect(entry.url);
    } catch (error) {
        console.error('Error fetching alias:', error);
        return <h1>Something went wrong. Please try again later.</h1>;
    }
}
