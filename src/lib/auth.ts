import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: "admin" | "agent";
}

export const createToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: unknown): JwtPayload => {
  if (typeof token !== "string") {
    console.error("Invalid token type:", typeof token, token);
    throw new Error("Token must be a string");
  }

  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};

export const getUserFromToken = (
  token: string | undefined
): JwtPayload | null => {
  try {
    if (!token) return null;
    return verifyToken(token);
  } catch (error) {
    console.log(error);
    return null;
  }
};
