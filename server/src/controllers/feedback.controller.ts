import { Request, Response } from 'express';
import { db } from '../config/database';
import { feedback } from '../db/schema';

/**
 * Submit feedback
 * POST /api/feedback
 */
export const submitFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📝 Feedback submission received:', req.body);
    const { name, email, type, message } = req.body;

    // Validation
    if (!message || message.trim().length === 0) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Message is required',
      });
      return;
    }

    if (!type || !['bug', 'feature', 'feedback'].includes(type)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Valid feedback type is required (bug, feature, feedback)',
      });
      return;
    }

    if (email && !isValidEmail(email)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Please provide a valid email address',
      });
      return;
    }

    // Insert feedback
    console.log('💾 Inserting feedback into database...');
    const [result] = await db.insert(feedback).values({
      name: name?.trim() || null,
      email: email?.trim() || null,
      type: type.trim(),
      message: message.trim(),
    }).returning();

    console.log('✅ Feedback saved successfully:', result.id);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      data: {
        id: result.id,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit feedback. Please try again.',
    });
  }
};

/**
 * Get all feedback
 * GET /api/feedback
 */
export const getAllFeedback = async (_req: Request, res: Response): Promise<void> => {
  try {
    const allFeedback = await db
      .select()
      .from(feedback)
      .orderBy(feedback.createdAt);

    // Format feedback for frontend display
    const formattedFeedback = allFeedback.map((item) => ({
      id: item.id.toString(),
      type: item.type,
      title: item.message.split('\n\n')[0] || item.message.substring(0, 100),
      description: item.message,
      author: item.name || 'Anonymous',
      email: item.email,
      date: formatDate(item.createdAt),
      votes: 0, // TODO: Implement voting system
      status: 'open' as const, // TODO: Add status field to database
      createdAt: item.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedFeedback.length,
      data: formattedFeedback,
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch feedback',
    });
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  return `${diffWeek} week${diffWeek > 1 ? 's' : ''} ago`;
}

/**
 * Simple email validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
