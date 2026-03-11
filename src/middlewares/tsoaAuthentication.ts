import { Request } from "express";
import jwt from "jsonwebtoken";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<{ _id: string }> {
  if (securityName !== "bearerAuth") {
    throw new Error("Unknown security");
  }

  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET ?? "default_access_secret";

  try {
    const decoded = jwt.verify(token, secret) as { _id: string };
    return { _id: decoded._id };
  } catch {
    throw new Error("Unauthorized");
  }
}