import jwt from "jsonwebtoken";

const SECRET_KEY = "NonceBloxTask";

export const jwtToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; 
  if (!token) return res.status(401).json({ error: "Access Denied: No token provided" });

  try {
    const verified = jwt.verify(token, SECRET_KEY); 
    req.user = verified; 
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};