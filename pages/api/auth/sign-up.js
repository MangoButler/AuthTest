import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";
import { validateEmail } from "../../../lib/validators";

async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    const { email, password } = data;
    if (
      !email ||
      !password ||
      !validateEmail(email) ||
      password.trim().length < 7
    ) {
      res.status(422).json({ message: "Invalid email or password" });
      return;
    }
    let client;
    try {
      client = await connectToDatabase();
    } catch (error) {
      res.status(500).json({ message: "Failed to create user, try again!" });
      return;
    }

    const db = client.db();

    const exisitngUser = await db.collection("users").findOne({ email: email });
    if (exisitngUser) {
      res.status(422).json({ message: "Email adress already registered!" });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);
    let result;
    try {
      result = await db
        .collection("users")
        .insertOne({ email: email, password: hashedPassword });
      res.status(201).json({ message: "Successfully created user!" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user, try again!" });
    }

    client.close();
  }
}

export default handler;
