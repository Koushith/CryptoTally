import { Request, Response } from 'express';
import { db } from '../config/database';
import { waitlist } from '../db/schema';
import { eq } from 'drizzle-orm';
import { sendTelegramNotification } from '../services/telegram.service';

/**
 * Join waitlist
 * POST /api/waitlist
 */
export const joinWaitlist = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      name,
      source,
      userType,
      companyName,
      teamSize,
      paymentVolume,
      useCase,
      referralSource
    } = req.body;

    // Validation
    if (!email || email.trim().length === 0) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Email is required',
      });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Please provide a valid email address',
      });
      return;
    }

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email.trim().toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      res.status(200).json({
        success: true,
        message: "You're already on the waitlist!",
        data: {
          id: existingUser[0].id,
          alreadyExists: true,
        },
      });
      return;
    }

    // Insert to waitlist
    const [result] = await db.insert(waitlist).values({
      email: email.trim().toLowerCase(),
      name: name?.trim() || null,
      source: source || 'app',
      userType: userType?.trim() || null,
      companyName: companyName?.trim() || null,
      teamSize: teamSize?.trim() || null,
      paymentVolume: paymentVolume?.trim() || null,
      useCase: useCase?.trim() || null,
      referralSource: referralSource?.trim() || null,
    }).returning();

    // Send Telegram notification (non-blocking)
    sendTelegramNotification({
      email: email.trim(),
      name: name?.trim(),
      source: source || 'app',
      userType: userType?.trim(),
      companyName: companyName?.trim(),
      teamSize: teamSize?.trim(),
      paymentVolume: paymentVolume?.trim(),
      useCase: useCase?.trim(),
      referralSource: referralSource?.trim(),
    }).catch(err => {
      console.error('Failed to send Telegram notification:', err);
      // Don't fail the request if notification fails
    });

    res.status(201).json({
      success: true,
      message: "You've been added to the waitlist!",
      data: {
        id: result.id,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to join waitlist. Please try again.',
    });
  }
};

/**
 * Get all waitlist entries (admin only - for future use)
 * GET /api/waitlist
 */
export const getAllWaitlist = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allEntries = await db
      .select()
      .from(waitlist)
      .orderBy(waitlist.createdAt);

    res.status(200).json({
      success: true,
      count: allEntries.length,
      data: allEntries,
    });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch waitlist',
    });
  }
};

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
