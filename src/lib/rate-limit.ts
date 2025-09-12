import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds (default: 1 minute)
  max?: number; // Max requests per window (default: 10)
  message?: string; // Error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (req: NextRequest) => string; // Custom key generator
}

// Default configurations for different endpoints
export const rateLimitConfigs = {
  default: {
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later.',
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
  },
  stripe: {
    windowMs: 60 * 1000, // 1 minute
    max: 20, // 20 requests per minute
  },
};

// Get client identifier from request
function getClientId(req: NextRequest): string {
  // Try to get user ID from headers (if authenticated)
  const userId = req.headers.get('x-user-id');
  if (userId) return `user:${userId}`;

  // Try to get IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  return `ip:${ip}`;
}

// Rate limiting middleware for Next.js API routes
export function rateLimit(options: RateLimitOptions = {}) {
  const {
    windowMs = 60 * 1000,
    max = 10,
    message = 'Too many requests, please try again later.',
    keyGenerator = getClientId,
  } = options;

  return async function rateLimitMiddleware(req: NextRequest) {
    const key = `${req.nextUrl.pathname}:${keyGenerator(req)}`;
    const now = Date.now();

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, entry);
    } else {
      entry.count++;
    }

    // Check if limit exceeded
    if (entry.count > max) {
      return NextResponse.json(
        { error: message },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    const remaining = Math.max(0, max - entry.count);
    
    return {
      headers: {
        'X-RateLimit-Limit': max.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
      },
    };
  };
}

// Helper function to apply rate limiting to API route handlers
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions = {}
) {
  const limiter = rateLimit(options);

  return async function rateLimitedHandler(req: NextRequest) {
    const rateLimitResult = await limiter(req);

    // If rate limit exceeded, return error response
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult;
    }

    // Otherwise, call the handler and add rate limit headers
    const response = await handler(req);
    
    if (rateLimitResult.headers) {
      Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    return response;
  };
}