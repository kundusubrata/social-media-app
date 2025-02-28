import jwt from "jsonwebtoken";

export const generateJwtToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};
