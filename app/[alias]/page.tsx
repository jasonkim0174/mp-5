import { redirect } from 'next/navigation';
import getCollection from '@/db';

interface PageProps {
    params: { alias: string };
}

export default async function AliasPage({ params }: PageProps) {
    const { alias } = params;

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
