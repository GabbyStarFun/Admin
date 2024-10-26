import { NextResponse } from 'next/server';
import { insert } from '@/functions/Supabase';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const RATE_LIMIT_POINTS = parseInt(process.env.RATE_LIMIT_POINTS || '4', 10);
const RATE_LIMIT_DURATION = parseInt(process.env.RATE_LIMIT_DURATION || '300', 10);
const RATE_LIMIT_BLOCK_DURATION = parseInt(process.env.RATE_LIMIT_BLOCK_DURATION || '300', 10);

const IP_WHITELIST = (process.env.IP_WHITELIST || '').split(',').map(ip => ip.trim());

const rateLimiter = new RateLimiterMemory({
  points: RATE_LIMIT_POINTS,
  duration: RATE_LIMIT_DURATION,
  blockDuration: RATE_LIMIT_BLOCK_DURATION,
});

export async function POST(request: Request) {
  const apiKey = request.headers.get('x-api-key');

  if (apiKey !== API_KEY) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { name, message } = await request.json();

    if (!name || !message) {
      return NextResponse.json({ message: "Name and message are required" }, { status: 400 });
    }

    const clientIp = request.headers.get('x-forwarded-for') || '0.0.0.0';
    const isBot = request.headers.get("isBot") === 'true';
    const isWhitelisted = IP_WHITELIST.includes(clientIp);

    if (!isBot && !isWhitelisted) {
      try {
        const rateLimitResult = await rateLimiter.consume(clientIp);
        console.log(`Rate limit for ${clientIp}: ${rateLimitResult.remainingPoints} requests remaining`);
      } catch (rateLimitError) {
        console.warn(`Rate limit exceeded for IP: ${clientIp}`);
        return NextResponse.json({ message: "Rate limit exceeded. Please try again later." }, { status: 429 });
      }
    }

    const insertResponse = await insert("rdb", { by: name, ip: clientIp, song: message });
    return NextResponse.json({ message: "Request submitted successfully", data: insertResponse }, { status: 200 });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ message: "Failed to submit request. Please try again.", error: String(error) }, { status: 500 });
  }
}