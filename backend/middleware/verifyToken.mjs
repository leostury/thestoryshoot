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

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  console.log("🔐 verifyToken - Checking token");
  console.log("Auth Header:", authHeader ? "✅ Present" : "❌ Missing");
  console.log(
    "Token:",
    token ? `✅ Found (${token.substring(0, 20)}...)` : "❌ Not found",
  );
  console.log(
    "TOKEN_SECRET:",
    process.env.ACCESS_TOKEN_SECRET ? "✅ Set" : "❌ Not set",
  );

  if (!token || token === "null" || token === "undefined") {
    console.log("❌ No token - returning 401");
    return res
      .status(401)
      .json({ status: false, message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("✅ Token valid untuk user ID:", decoded.id);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    const message =
      err.name === "TokenExpiredError"
        ? "Token kadaluarsa"
        : "Token tidak valid";
    return res.status(403).json({ status: false, message });
  }
};
