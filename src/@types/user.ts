import { RoleDocument } from "#/models/roles";
import { Request } from "express";
import { ParsedQs } from "qs";
import { Schema } from "mongoose";

// Extend the global Express namespace
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: any;
        userName: string;
        email: string;
        verified: boolean;
        role: RoleDocument; // Add role to user
      };
    }
  }
}

export interface CreateUser extends Request {
  body: {
    userName: string;
    email: string;
    password: string;
    role?: string; // The role name provided by the admin
  };
}

export interface verifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}

export interface FilterQuery extends ParsedQs {
  location?: string;
  date?: string;
  tags?: string | string[];
  price_min?: string;
  price_max?: string;
}

export interface CommentPayload {
  user_id: Schema.Types.ObjectId;
  comment: string;
}
