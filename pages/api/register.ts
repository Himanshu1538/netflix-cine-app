import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "../../lib/prismadb";

// API route for user registration
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check if the request method is POST
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    // Extract email, name, and password from the request body
    const { email, name, password } = req.body;

    // Check if the email is already taken
    const existingUser = await prismadb.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(422).json({ error: "Email taken" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user in the database
    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: "",
        emailVerified: new Date(),
      },
    });

    // Return the user information as json response
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}
