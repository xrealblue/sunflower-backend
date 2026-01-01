import emailService from "@/services/emailService";
import type { Request, Response } from "express";

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const { to, subject, text, html, from } = req.body;

    if (!to || !subject || (!text && !html)) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, and (text or html)',
      });
      return;
    }

    await emailService.sendEmail({ to, subject, text, html, from });

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}