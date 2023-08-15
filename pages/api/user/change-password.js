import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.status(401).json({ message: "Invalid request" });
    return;
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Not Authenticated!" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  let client;
  try {
    client = await connectToDatabase();
  } catch (error) {
    res.status(500).json({ message: "Connection timeout" });
    return;
  }

  const usersCollection = client.db().collection("users");

  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    client.close();
    return;
  }

  const currentPassword = user.password;
  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid Password" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();
  res.status(200).json({ message: "Password updated" });
}

export default handler;
