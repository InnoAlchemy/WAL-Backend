import { RequestHandler } from "express";
import jwt from 'jsonwebtoken'

import { CreateUser, verifyEmailRequest } from "#/@types/user";
import User from "#/models/user";
import Role from "#/models/roles";
import { generateToken } from "#/utils/helper";

import emailVerificationToken from "#/models/emailVerificationToken";
import { isValidObjectId } from "mongoose";
import passwordResettoken from "#/models/passwordResettoken";
import crypto from 'crypto'
import { JWT_SECRET, PASSWORD_RESET_LINK } from "#/utils/variables";

import { sendForgetPasswordLink, sendPassResetSuccessEmail, sendVerificationMail } from "#/utils/mail";

export const register: RequestHandler = async (req: CreateUser, res) => {
  const { email, password, userName } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Find the "Client" role
    const clientRole = await Role.findOne({ name: "Client" });
    if (!clientRole) {
      return res.status(500).json({ error: "Client role not found" });
    }

    // Create a new user and assign the "Client" role
    const user = await User.create({ 
      userName, 
      email, 
      password, 
      role: clientRole._id  // Assign the Client role to the user
    });

    // Send verification email
    const token = generateToken();
    await emailVerificationToken.create({
      owner: user._id,
      token,
    });
    sendVerificationMail(token, { userName, email, userId: user._id.toString() });

    res.status(201).json({ message: "Registration successful. Please verify your email.", user });
  } catch (error) {
    console.error('Error in register:', error); // Debugging
    res.status(500).json({ error: "Internal server error" });
  }
};
export const verifyEmail: RequestHandler = async (req: verifyEmailRequest, res) => {
  const { token, userId } = req.body;
   const verificationToken = await emailVerificationToken.findOne({
  owner: userId,
})

if(!verificationToken) return res.status(403).json({error: "Invalid token!"})

const matched = await verificationToken.compareToken(token) 
if(!matched) return res.status(403).json({error: "Invalid token!"})

  await User.findByIdAndUpdate(userId, {
    verified: true
  })

  await emailVerificationToken.findByIdAndDelete(verificationToken._id)

  res.json({message: 'email is verified'})
};

export const sendReverificationToken: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!isValidObjectId(userId)) {
      console.log('Invalid ObjectId:', userId); // Debugging
      return res.status(403).json({ error: "Invalid request!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId); // Debugging
      return res.status(403).json({ error: "Invalid request!" });
    }

    if(user.verified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    await emailVerificationToken.findOneAndDelete({ owner: userId });

    const token = generateToken();

    await emailVerificationToken.create({
      owner: userId,
      token
    });

    sendVerificationMail(token, {
      userName: user.userName,
      email: user.email,
      userId: user._id.toString()
    });

    res.json({ message: "Please Check your mail." });
  } catch (error) {
    console.error('Error in sendReverificationToken:', error); // Debugging
    res.status(500).json({ error: "Internal server error" });
  }
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {

  const {email} = req.body;

  const user = await User.findOne({email});
  if(!user) return res.status(404).json({error: "Account not found!"})


    const token = crypto.randomBytes(36).toString('hex'); 
 await passwordResettoken.create({
    owner: user._id,
    token,
  })

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}`

  sendForgetPasswordLink({ email: user.email, link: resetLink });

  res.json({ message: "Check you registered mail." });


};

export const grantValid: RequestHandler = async (req, res) => {

 res.json({valid: true});
};

export const updatePassword: RequestHandler = async (req, res) => {

  const{password, userId} = req.body;

 const user = await User.findById(userId);
 if(!user) return res.status(404).json({error: "Unothorized access!"})

 const matched = await user.comparePassword(password)
 if(matched) return res.status(422).json({error: "The new password must be different!"})

  user.password = password
  await user.save()

  passwordResettoken.findOneAndDelete({owner: user._id});

  // send the success email
 sendPassResetSuccessEmail(user.userName, user.email)
 res.json({message: "Password reset Successfully!"})

  
};

export const Login: RequestHandler = async (req, res) => {

  const{password, email} = req.body;
  
  const user = await User.findOne({
    email
  })

  if(!user) return res.status(403).json({error: "Email/Password mismatch!"});
  if(!user.verified) return res.status(403).json({error: "User is not verified!"});

 const matched = await user.comparePassword(password);
 if(!matched) return res.status(403).json({error: "Email/Password mismatch!"});


 const token = jwt.sign({userId: user._id, role: user.role}, JWT_SECRET)

 user.tokens.push({token})

 await user.save();

 res.json({profile: {id: user._id, userName: user.userName, email: user.email, verified: user.verified }, token})
  
};

export const Logout: RequestHandler = async (req, res) => {
  const { token } = req.body;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    user.tokens = user.tokens.filter(t => t.token !== token);
    await user.save();

    res.json({ message: "Successfully logged out!" });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const DeleteUser: RequestHandler = async (req, res) => {
  const { token } = req.body;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(payload.userId);
    if (!user) return res.status(404).json({ error: "User not found!" });

    await User.findByIdAndDelete(payload.userId);
    res.json({ message: "User account deleted successfully!" });
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const GetUserDetails: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('userName email email_verified_at createdAt');
    if (!user) return res.status(404).json({ error: "User not found!" });

    res.json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving user details!" });
  }
};

export const UpdateUserDetails: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { userName, email, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found!" });

    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (password) {
      const isSamePassword = await user.comparePassword(password);
      if (isSamePassword) return res.status(400).json({ error: "New password must be different!" });
      user.password = password;
    }

    await user.save();
    res.json({ message: "User details updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating user details!" });
  }
};

export const VerifyEmailWithToken: RequestHandler = async (req, res) => {
  const { token } = req.params;

  try {
    const verificationToken = await emailVerificationToken.findOne({ token });
    if (!verificationToken) return res.status(400).json({ error: "Invalid token!" });

    const user = await User.findById(verificationToken.owner);
    if (!user) return res.status(404).json({ error: "User not found!" });

    user.verified = true;
    await user.save();

    await emailVerificationToken.findByIdAndDelete(verificationToken._id);

    res.json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while verifying email!" });
  }
};
