import * as yup from "yup";
import { isValidObjectId } from "mongoose";

export const CreateUserSchema = yup.object().shape({
  userName: yup
    .string()
    .trim()
    .required("Name is missing!")
    .min(3, "Name is too short!")
    .max(20, "Name is too long!"),
  email: yup.string().required("Email is missing!").email("Invalid email id!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),
});

export const TokenAndIDVerification = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid userId!"),
    password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    ),
});

export const LoginValidationSchema = yup.object().shape({
  email: yup.string().required("Email is missing!").email("Invalid email id!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!"),
});

// Schema for validating User ID in the URL parameter
export const UserIdParamSchema = yup.object().shape({
  id: yup
    .string()
    .required("User ID is required!")
    .test('is-valid-object-id', 'Invalid user ID!', value => isValidObjectId(value)),
});

// Schema for updating user details
export const UpdateUserDetailsSchema = yup.object().shape({
  userName: yup
    .string()
    .trim()
    .min(3, "Name is too short!")
    .max(20, "Name is too long!")
    .optional(),
  email: yup
    .string()
    .email("Invalid email id!")
    .optional(),
  password: yup
    .string()
    .trim()
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    )
    .optional(),
});

// Schema for validating email when sending a verification link
export const EmailVerificationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is missing!")
    .email("Invalid email id!"),
});

// Schema for verifying email using token in URL parameter
export const VerifyEmailTokenSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
});


// Schema for creating an event
export const CreateEventSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().optional(),
  date: yup.date().required(),
  location: yup.string().required(),
  price: yup.number().required(),
  tags: yup.array().of(yup.string()).optional(),
  pictures: yup.array().of(yup.string()).optional(),
  type: yup.string().required(),
});


// Schema for updating an event
export const UpdateEventSchema = yup.object({
  title: yup.string().optional(),
  description: yup.string().optional(),
  date: yup.date().optional(),
  location: yup.string().optional(),
  price: yup.number().optional(),
  tags: yup.array().of(yup.string()).optional(),
  pictures: yup.array().of(yup.string()).optional(),
  type: yup.string().optional(),
});

// Schema for event ID
export const EventIdParamSchema = yup.object({
  id: yup.string().required(),
});

export const FilterQuerySchema = yup.object({
  location: yup.string().optional(),
  date: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").optional(),
  tags: yup.array().of(yup.string()).optional(),
  price_min: yup.number().optional(),
  price_max: yup.number().optional(),
});


export const CreateCouponSchema = yup.object({
  coupon_key: yup.string()
    .required("Coupon key is required")
    .trim()
    .min(3, "Coupon key must be at least 3 characters long")
    .max(20, "Coupon key cannot be longer than 20 characters"),
  usage: yup.number()
    .required("Usage limit is required")
    .integer("Usage must be an integer")
    .min(-1, "Usage must be -1 (infinite) or a positive integer")
    .default(-1),
    discount_percentage: yup.number()
    .required("Discount percentage  is required"),
});

export const CouponIdParamSchema = yup.object({
  id: yup.string()
    .required("Coupon ID is required")
    .test("is-valid-objectid", "Invalid Coupon ID", (value) => {
      return /^[0-9a-fA-F]{24}$/.test(value || "");
    }),
});

export const UpdateCouponSchema = yup.object({
  coupon_key: yup.string()
    .trim()
    .min(3, "Coupon key must be at least 3 characters long")
    .max(20, "Coupon key cannot be longer than 20 characters"),
  usage: yup.number()
  .integer("Usage must be an integer")
  .min(-1, "Usage must be -1 (infinite) or a positive integer"),
  discount_percentage: yup.number(),
});


export const CheckCouponSchema = yup.object({
  coupon_key: yup.string()
    .trim()
    .required("Coupon key is required")
    .min(3, "Coupon key must be at least 3 characters long")
    .max(20, "Coupon key cannot be longer than 20 characters"),
});

export const CreateBlogSchema = yup.object({
  title: yup.string().required('Title is required'),
  files: yup.array().of(yup.string().url('Each file must be a valid URL')),
  tags: yup.array().of(yup.string()),
  description: yup.string().required('Description is required'),
});
export const CreateCategorySchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Type is required'),
  description: yup.string().required('Description is required'),
});

export const BlogIdParamSchema = yup.object({
  id: yup.string().required('Blog ID is required').length(24, 'Blog ID must be a valid MongoDB ObjectId'),
});
export const CategoryIdParamSchema = yup.object({
  id: yup.string().required('Category ID is required').length(24, 'Category ID must be a valid MongoDB ObjectId'),
});

export const UpdateBlogSchema = yup.object().shape({
  title: yup.string(),
  files: yup.array().of(yup.string()),
  tags: yup.array().of(yup.string()),
  description: yup.string(),
});
export const updateCategorySchema = yup.object().shape({
  name: yup.string(),
  type: yup.string(),
  description: yup.string(),
});

export const CommentSchema = yup.object().shape({
  user_id: yup.string().required('User ID is required'),
  comment: yup.string().required('Comment text is required'),
});