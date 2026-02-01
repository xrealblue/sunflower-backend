import emailService from "../../services/emailService";
import type { Request, Response } from "express";

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const isConnected = await emailService.verifyConnection();

    res.status(200).json({
      success: isConnected,
      message: isConnected ? 'SMTP connection verified' : 'SMTP connection failed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying connection',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}