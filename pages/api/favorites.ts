import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "../../lib/prismadb";
import serverAuth from "../../lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if the request method is GET
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    // Perform server-side authentication
    const { currentUser } = await serverAuth(req, res);

    // Fetch all favorited movies based on the user's favoriteIds
    const favoritedMovies = await prismadb.movie.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds,
        },
      },
    });

    // Return the favorited movies as JSON response
    return res.status(200).json(favoritedMovies);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
