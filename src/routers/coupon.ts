import { Router } from 'express';
import { checkCoupon, createCoupon, deleteCoupon, getAllCoupons, updateCoupon } from '#/controllers/coupon';
import { validate } from '#/middleware/validator';
import { CheckCouponSchema, CouponIdParamSchema, CreateCouponSchema, UpdateCouponSchema } from '#/utils/validationSchema';
import { isAuth } from '#/middleware/auth';

const router = Router();

// Create a new coupon
router.post('/', isAuth, validate(CreateCouponSchema), createCoupon);

// Get all coupons
router.get('/', isAuth,  getAllCoupons);

// Delete a coupon by ID
router.delete('/:id',isAuth, validate(CouponIdParamSchema, 'params'), deleteCoupon);

// Update a coupon by ID
router.put('/:id',isAuth, validate(CouponIdParamSchema, 'params'), validate(UpdateCouponSchema), updateCoupon);

// Check if a coupon is valid
router.post('/check',isAuth, validate(CheckCouponSchema), checkCoupon);


export default router;
