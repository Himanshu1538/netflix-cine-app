import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "../../lib/prismadb";
import serverAuth from "../../lib/serverAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if the request method is POST
    if (req.method === "POST") {
      // Perform server-side authentication
      const { currentUser } = await serverAuth(req, res);

      // Get movieId from the request body
      const { movieId } = req.body;

      // Find the movie with the given ID
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      // If the movie doesn't exist, throw an error
      if (!existingMovie) {
        throw new Error("Invalid ID");
      }

      // Update the user's favorite list by adding the movieId
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteIds: {
            push: movieId,
          },
        },
      });

      // Return the updated user as JSON response
      return res.status(200).json(user);
    }

    // Check if the request method is DELETE
    if (req.method === "DELETE") {
      const { currentUser } = await serverAuth(req, res);

      // Get movieId from the request body
      const { movieId } = req.body;

      // Find the movie with the given ID
      const existingMovie = await prismadb.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      // If the movie doesn't exist, throw an error
      if (!existingMovie) {
        throw new Error("Invalid ID");
      }

      // Update the user's favorite list by removing the movieId
      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favoriteIds: updatedFavoriteIds,
        },
      });

      // Return the updated user as JSON response
      return res.status(200).json(updatedUser);
    }

    return res.status(405).end();
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
