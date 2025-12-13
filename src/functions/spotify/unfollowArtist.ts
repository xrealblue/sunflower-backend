import prisma from "@/lib/prisma";

export interface FollowArtistParams {
  userId: string;
  artistId: string;
}

export const unfollowArtist = async ({ userId, artistId }: FollowArtistParams) => {
  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { following: true }
    });

    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          name: "User", 
          email: `${userId}@temp.com`,
          following: []
        },
        select: {
          id: true,
          name: true,
          following: true
        }
      });

      return {
        success: false,
        message: 'User was not following this artist',
        data: newUser
      };
    }

    if (!user.following.includes(artistId)) {
      return {
        success: false,
        message: 'Not following this artist',
        data: null
      };
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
    console.error('Unfollow artist error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to unfollow artist',
      data: null
    };
  }
};