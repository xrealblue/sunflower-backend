// unfollowArtist.ts
import { prisma } from "@/lib/prisma";

export const unfollowArtist = async ({ userId, artistId }: { userId: string; artistId: string }) => {
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

    // Remove artist ID from following array
    const updatedFollowing = (user.following || []).filter(id => id !== artistId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        following: updatedFollowing
      }
    });

    return {
      success: true,
      message: "Artist unfollowed successfully",
      data: { artistId }
    };
  } catch (error) {
    console.error("Unfollow artist error:", error);
    return {
      success: false,
      message: "Failed to unfollow artist",
      data: null
    };
  }
};