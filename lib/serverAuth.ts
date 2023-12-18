import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import prismadb from "./prismadb";
import { authOptions } from "../pages/api/auth/[...nextauth]";

// Server-side authentication middleware
const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get the user session
  const session = await getServerSession(req, res, authOptions);

  // If the user is not signed in, throw an error
  if (!session?.user?.email) {
    throw new Error("Not signed in");
  }

  // Find the user in the database using Prisma
  const currentUser = await prismadb.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  // If the user is not found, throw an error
  if (!currentUser) {
    throw new Error("Not signed in");
  }

  // Return the current user object
  return { currentUser };
};

export default serverAuth;
