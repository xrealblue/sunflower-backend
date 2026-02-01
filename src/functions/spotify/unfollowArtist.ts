// unfollowArtist.ts
import { prisma } from "../../lib/prisma";

interface UnfollowArtistParams {
  userId: string;
  artistId: string;
}

export const unfollowArtist = async ({
  userId,
  artistId,
}: UnfollowArtistParams) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    // Ensure following is a string array
    const following: string[] = Array.isArray(user.following)
      ? (user.following as string[])
      : [];

    // Remove artist ID
    const updatedFollowing = following.filter(
      (id) => id !== artistId
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        following: updatedFollowing,
      },
    });

    return {
      success: true,
      message: "Artist unfollowed successfully",
      data: { artistId },
    };
  } catch (error) {
    console.error("Unfollow artist error:", error);
    return {
      success: false,
      message: "Failed to unfollow artist",
      data: null,
    };
  }
};
