import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "../../../lib/prismadb";
import serverAuth from "../../../lib/serverAuth";

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
    await serverAuth(req, res);

    // Extract movieId from the request query parameters
    const { movieId } = req.query;

    // Check the type of movieId
    if (typeof movieId !== "string") {
      throw new Error("Invalid Id");
    }

    // Check if the movieId exist
    if (!movieId) {
      throw new Error("Missing Id");
    }

    // Fetch the movie with the specified movieId from the database
    const movies = await prismadb.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    // Return the movie details as JSON response
    return res.status(200).json(movies);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
