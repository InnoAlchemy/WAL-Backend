import { Request } from "express";
import { Schema } from "mongoose";
import { ParsedQs } from "qs";

export interface CreateUser extends Request {
    body: {
        userName: string;
        email: string;
        password: string;
    };
}

export interface verifyEmailRequest extends Request {
    body: {
        userId: string;
        token: string;
    };
}

declare global {
    namespace Express {
      interface Request {
        user : {
          id: any,
          userName: string,
          email: string,
          verified: boolean 
        }
      }
    }
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