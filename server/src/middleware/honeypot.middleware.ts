import { Request, Response, NextFunction } from 'express';

/**
 * Honeypot middleware to catch bots
 *
 * Add a hidden field to your forms that humans won't fill but bots will.
 * If the field is filled, reject the request.
 *
 * Example frontend implementation:
 * <input type="text" name="website" style="display:none" tabIndex="-1" autoComplete="off" />
 */
export const honeypotCheck = (fieldName: string = 'website') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const honeypotValue = req.body[fieldName];

    // If honeypot field is filled, it's likely a bot
    if (honeypotValue && honeypotValue.trim() !== '') {
      console.warn(`[HONEYPOT] Blocked submission with ${fieldName}: ${honeypotValue}`);
      res.status(400).json({
        error: 'Invalid Submission',
        message: 'Please try again.',
      });
      return;
    }

    next();
  };
};

/**
 * Disposable email domains to block
 */
const disposableEmailDomains = [
  'tempmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'yopmail.com',
  'trashmail.com',
  'getnada.com',
];

/**
 * Block disposable/temporary email addresses
 */
export const blockDisposableEmails = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const email = req.body.email?.toLowerCase();

  if (!email) {
    next();
    return;
  }

  const domain = email.split('@')[1];

  if (disposableEmailDomains.includes(domain)) {
    console.warn(`[SPAM] Blocked disposable email: ${email}`);
    res.status(400).json({
      error: 'Invalid Email',
      message: 'Please use a valid email address.',
    });
    return;
  }

  next();
};
