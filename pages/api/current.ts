import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../lib/serverAuth";

// API route to get the current user information
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if the request method is GET
    if (req.method !== "GET") {
      return res.status(405).end();
    }

    // Authenticate the user using serverAuth middleware
    const { currentUser } = await serverAuth(req, res);

    // Return the current user information as json response
    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  }
}
