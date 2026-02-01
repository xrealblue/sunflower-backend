// followArtist.ts
import { prisma } from "../../lib/prisma";

export const followArtist = async ({ userId, artistId }: { userId: string; artistId: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true }
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null
      };
    }

    const following = user.following || [];
    if (following.includes(artistId)) {
      return {
        success: false,
        message: "Already following this artist",
        data: null
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          push: artistId
        }
      }
    });

    return {
      success: true,
      message: "Artist followed successfully",
      data: { artistId }
    };
  } catch (error) {
    console.error("Follow artist error:", error);
    return {
      success: false,
      message: "Failed to follow artist",
      data: null
    };
  }
};