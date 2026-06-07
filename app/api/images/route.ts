import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface GalleryImage {
  id: string;
  url: string;
  tags: string[];
  name: string;
}

export async function GET() {
  try {
    const allResources: any[] = [];
    let nextCursor: string | undefined = undefined;
    do {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'sugar-pages/',
        max_results: 500,
        next_cursor: nextCursor,
        tags: true,
      });
      allResources.push(...result.resources);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    const images: GalleryImage[] = allResources.map((r: any) => ({
      id: r.public_id,
      url: r.secure_url,
      tags: r.tags ?? [],
      name: r.public_id.split('/').pop() ?? r.public_id,
    }));

    return NextResponse.json(images, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
