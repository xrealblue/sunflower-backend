import type { User } from '@/generated/prisma/client';
import { prisma } from '../lib/prisma';

export class UserService {
  // Create a new user
  static async createUser(data: {
    username: string;
    displayName: string;
  }): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        notifications: true,
        follows: true,
      },
    });
  }

  // Get user by username
  static async getUserByUsername(username: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { username },
      include: {
        notifications: true,
        follows: true,
      },
    });
  }

  // Update user
  static async updateUser(id: string, data: Partial<{
    username: string;
    displayName: string;
  }>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // Delete user
  static async deleteUser(id: string): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // Get all users with pagination
  static async getUsers(skip = 0, take = 10): Promise<User[]> {
    return await prisma.user.findMany({
      skip,
      take,
      include: {
        notifications: true,
        follows: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Search users by username or display name
  static async searchUsers(query: string): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        notifications: true,
        follows: true,
      },
    });
  }
}