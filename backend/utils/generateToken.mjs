import crypto from "crypto";

export const generateToken = () => {
  return crypto.randomBytes(40).toString("hex");
};
