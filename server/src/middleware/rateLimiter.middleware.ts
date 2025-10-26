import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for waitlist endpoint
 * - 3 requests per 15 minutes per IP
 * - Prevents spam signups
 */
export const waitlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many signup attempts. Please try again later.',
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

/**
 * Rate limiter for feedback endpoint
 * - 5 requests per 15 minutes per IP
 */
export const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: 'Too Many Requests',
    message: 'Too many feedback submissions. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiter
 * - 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
