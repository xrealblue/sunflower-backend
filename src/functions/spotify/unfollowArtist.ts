import prisma from "@/lib/prisma";

export interface FollowArtistParams {
  userId: string;
  artistId: string;
}

export const unfollowArtist = async ({ userId, artistId }: FollowArtistParams) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.following.includes(artistId)) {
      throw new Error('Not following this artist');
    }

    const updatedFollowing = user.following.filter(id => id !== artistId);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        following: updatedFollowing
      },
      select: {
        id: true,
        name: true,
        following: true
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