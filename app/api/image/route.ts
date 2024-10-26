import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    if (!id) {
      return new Response(JSON.stringify({ message: 'Missing ID parameter' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const targetUrl = `${process.env.radio}/api/station/lime/art/${id}`;
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch image' }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const contentType = response.headers.get('content-type');
    if (!contentType) {
      return new Response(JSON.stringify({ error: 'Invalid content type' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}