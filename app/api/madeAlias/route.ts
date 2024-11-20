import { NextRequest, NextResponse } from 'next/server';
import getCollection from '@/db';

export async function POST(req: NextRequest) {
    try {
        const { alias, url } = await req.json();

        if (!alias || !url) {
            return NextResponse.json(
                { error: 'Both alias and URL are required.' },
                { status: 400 }
            );
        }

        const urlPattern = /^https:\/\/www\./;
        if (!urlPattern.test(url)) {
            return NextResponse.json(
                { error: 'Invalid URL. Please ensure it starts with https://www.' },
                { status: 400 }
            );
        }

        const collection = await getCollection('alias-archive');

        const existingAlias = await collection.findOne({ alias });
        if (existingAlias) {
            return NextResponse.json(
                { error: 'Alias is already in use choose another one.' },
                { status: 409 }
            );
        }

        const newAliasEntry = { alias, url, createdAt: new Date() };
        await collection.insertOne(newAliasEntry);

        return NextResponse.json(
            { message: 'Alias created successfully!', alias },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error handling alias creation:', error);
        return NextResponse.json(
            { error: 'Something went wrong. Please try again later.' },
            { status: 500 }
        );
    }
}
