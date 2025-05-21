import connectDB from "@/lib/db";
import User from "@/models/user.model";

export async function getUserById(userId: string) {
  await connectDB();
  const user = await User.findById(userId).lean();
  return user;
}
