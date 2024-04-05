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
      // Return 405 Method Not Allowed status
      return res.status(405).end();
    }

    // Perform server-side authentication
    await serverAuth(req, res);

    // Count the total number of movies in the database
    const moviesCount = await prismadb.movie.count();

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * moviesCount);

    // Fetch a single random movie from the database based on the random-index
    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex,
    });

    // Return the randomly selected movie as JSON response
    return res.status(200).json(randomMovies[0]);
  } catch (error) {
    console.log(error);
    // Return a 500 Internal Server Error status
    return res.status(500).end();
  }
}
