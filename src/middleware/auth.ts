import passwordResettoken from "#/models/passwordResettoken";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "#/models/user";
import { ObjectId } from "mongoose";
import { RoleDocument } from "#/models/roles";




export const isValidPassResetToken: RequestHandler = async (req, res, next) => {

    const {token, userId} = req.body;
  
    const resetToken = await passwordResettoken.findOne({owner: userId});
  
    if(!resetToken) return res.status(403).json({error: "Unauthorized access, invalid token!"})
  
     const matched = await resetToken.compareToken(token)
  
     if(!matched) return res.status(403).json({error: "Unauthorized access, invalid token!"})
  
     next();
  
};



export const isAuth: RequestHandler = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized request!" });
      }
  
      const token = authorization.split("Bearer ")[1];
      if (!token) {
        return res.status(403).json({ error: "Unauthorized request!" });
      }
  
      const verifiedToken = verify(token, JWT_SECRET) as JwtPayload;
      const userId = verifiedToken.userId;
  
      // Adjust the query to match the token inside the tokens array
      const user = await User.findOne({
        _id: userId,
        'tokens.token': token,
      }).populate('role'); // Ensure the role is populated if it's a reference
  
      if (!user) {
        return res.status(403).json({ error: "Unauthorized request!" });
      }
  
      // Attach user details, including role, to the request object
      if (user.role && typeof user.role !== 'string') {
        req.user = {
          id: user._id,
          userName: user.userName,
          email: user.email,
          verified: user.verified,
          role: user.role as RoleDocument,  // Cast it to RoleDocument if populated
        };
      } else {
        return res.status(403).json({ error: "Role not populated!" });
      }
  
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(500).json({ error: "Internal server error!" });
    }
  };

  export const hasRoles = (requiredRoles: string[]): RequestHandler => {
    return (req, res, next) => {
      // Check if the user is authenticated and has a role
      if (!req.user || !req.user.role) {
        return res.status(403).json({ error: "Forbidden. No role assigned." });
      }
  
      // Check if the user's role is in the array of required roles
      const userRole = req.user.role.name;  // Assuming role has a `name` field
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
      }
  
      next();
    };
  };