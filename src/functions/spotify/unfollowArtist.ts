import prisma from "@/lib/prisma";

export interface FollowArtistParams {
  userId: string;
  artistId: string;
}

export const unfollowArtist = async ({ userId, artistId }: FollowArtistParams) => {
  try {
    // Check if user exists and get their following list
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        following: {
          select: { id: true }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if following the artist
    const isFollowing = user.following.some((artist) => artist.id === artistId);
    if (!isFollowing) {
      throw new Error('Not following this artist');
    }

    // Remove artist from following list using disconnect
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          disconnect: { id: artistId }
        }
      },
      select: {
        id: true,
        name: true,
        following: {
          select: {
            id: true,
            name: true,
            images: true,
            genres: true
          }
        }
      }
    });

    return {
      success: true,
      message: 'Successfully unfollowed artist',
      data: updatedUser
    };
  } catch (error) {
    throw error;
  }
};