
import { DeleteUser, generateForgetPasswordLink, GetUserDetails, grantValid, Login, Logout, register, sendReverificationToken, updatePassword, UpdateUserDetails, verifyEmail, VerifyEmailWithToken } from "#/controllers/user";
import { isAuth, isValidPassResetToken } from "#/middleware/auth";
import { validate } from "#/middleware/validator";

import { CreateUserSchema, TokenAndIDVerification, UpdatePasswordSchema, LoginValidationSchema, UserIdParamSchema, EmailVerificationSchema, UpdateUserDetailsSchema} from "#/utils/validationSchema";


import { Router } from "express";


const router = Router();

router.post("/register", validate(CreateUserSchema), register);
router.post("/verify-email", validate(TokenAndIDVerification), verifyEmail);
router.post("/re-verify-email", sendReverificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.get("/verify-email/:token", validate(TokenAndIDVerification), VerifyEmailWithToken);
router.post("/verify-pass-reset-token", validate(TokenAndIDVerification), isValidPassResetToken, grantValid);
router.post('/update-password', validate(UpdatePasswordSchema), isValidPassResetToken, updatePassword);
router.post('/login',validate(LoginValidationSchema), Login);
router.post("/logout", isAuth, Logout);
router.post("/delete", isAuth, DeleteUser);
router.get("/users/:id", validate(UserIdParamSchema), isAuth, GetUserDetails);
router.put("/users/:id", validate(UserIdParamSchema), isAuth, validate(UpdateUserDetailsSchema), UpdateUserDetails);



router.get('/is-auth', isAuth, (req, res) => {
 res.json({profile : req.user,})
})




export default router;
