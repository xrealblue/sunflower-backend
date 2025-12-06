import prisma from "@/lib/prisma";

export interface FollowArtistParams {
  userId: string;
  artistId: string;
}

export const followArtist = async ({ userId, artistId }: FollowArtistParams) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: artistId }
    });

    if (!artist) {
      throw new Error('Artist not found');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.following.includes(artistId)) {
      throw new Error('Already following this artist');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        following: {
          push: artistId
        }
      },
      select: {
        id: true,
        name: true,
        following: true
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

