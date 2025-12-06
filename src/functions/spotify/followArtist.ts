import prisma from "@/lib/prisma";

export interface FollowArtistParams {
  userId: string;
  artistId: string;
}

export const followArtist = async ({ userId, artistId }: FollowArtistParams) => {
  try {
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

    const isFollowing = user.following.some((artist) => artist.id === artistId);
    if (isFollowing) {
      throw new Error('Already following this artist');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          connect: { id: artistId }
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
      message: 'Successfully followed artist',
      data: updatedUser
    };
  } catch (error) {
    throw error;
  }
};
