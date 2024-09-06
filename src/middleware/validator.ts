import { RequestHandler } from "express";
import * as yup from "yup";

export const validate = (
  schema: yup.ObjectSchema<any>,
  fields: 'body' | 'query' | 'params' | Array<'body' | 'query' | 'params'> = 'body'
): RequestHandler => {
  return async (req, res, next) => {
    try {
      // Ensure fields is an array for consistency
      const fieldsArray = Array.isArray(fields) ? fields : [fields];

      console.log(req.query);

      // Loop through each field and validate
      for (const field of fieldsArray) {
        await schema.validate(req[field], {
          abortEarly: false, // Collect all errors, not just the first
        });
      }

      console.log(req.query);
      next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors = error.inner.map(err => ({
          path: err.path,
          message: err.message,
        }));
        res.status(422).json({ errors: validationErrors });
      } else {
        res.status(500).json({ error: "An error occurred during validation!" });
      }
    }
  };
};
