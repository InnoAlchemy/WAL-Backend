import passwordResettoken from "#/models/passwordResettoken";
import { JWT_SECRET } from "#/utils/variables";
import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "#/models/user";
import { ObjectId } from "mongoose";




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
            'tokens.token': token  // Use dot notation to match the nested field
        });

        if (!user) {
            return res.status(403).json({ error: "Unauthorized request!" });
        }

        req.user = {
            id: user._id,
            userName: user.userName,
            email: user.email,
            verified: user.verified
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
};
