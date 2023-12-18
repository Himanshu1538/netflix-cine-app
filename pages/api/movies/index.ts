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

    // Fetch all movies from the database
    const movies = await prismadb.movie.findMany();

    // Return the list of movies as JSON response
    return res.status(200).json(movies);
  } catch (error) {
    console.log({ error });
    return res.status(500).end();
  }
}
