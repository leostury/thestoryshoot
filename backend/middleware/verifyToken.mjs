import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  let token = null;

  if (authHeader) {
    token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;
  }

  // Fallback dari cookie
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token || token === "null" || token === "undefined") {
    return res
      .status(401)
      .json({ status: false, message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    const message =
      err.name === "TokenExpiredError"
        ? "Token kadaluarsa"
        : "Token tidak valid";
    return res.status(403).json({ status: false, message });
  }
};
