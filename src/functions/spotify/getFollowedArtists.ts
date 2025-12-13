import prisma from "@/lib/prisma";

export interface GetFollowedArtistsParams {
  userId: string;
}

export const getFollowedArtists = async ({ userId }: GetFollowedArtistsParams) => {
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
          following: true
        }
      });

      return {
        success: true,
        message: 'User created',
        data: []
      };
    }

    return {
      success: true,
      message: 'Successfully retrieved followed artists',
      data: user.following
    };
  } catch (error) {
    console.error('Get followed artists error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to get followed artists',
      data: []
    };
  }
};