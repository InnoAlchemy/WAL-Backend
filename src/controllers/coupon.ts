import {  RequestHandler } from "express";
import Coupon from "#/models/coupon";

export const createCoupon: RequestHandler = async (req, res) => {
    try {
      const { coupon_key, usage,discount_percentage } = req.body;
  
      // Validate required fields
      if (!coupon_key || typeof usage !== "number" || typeof discount_percentage !== "number") {
        return res.status(400).json({ error: "coupon_key and usage are required." });
      }
  
      // Create a new coupon
      const coupon = new Coupon({ coupon_key, usage,discount_percentage });
      await coupon.save();
  
      res.status(201).json(coupon);
    } catch (error) {
      // Handle duplicate coupon_key
      if ((error as any).code === 11000) {
        res.status(400).json({ error: "Coupon key already exists." });
      } else {
        res.status(400).json({ error: (error as Error).message });
      }
    }
  };
  // Get all coupons
export const getAllCoupons: RequestHandler = async (req, res) => {
    try {
      const coupons = await Coupon.find({});
      res.status(200).json(coupons);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // Delete a coupon by ID
export const deleteCoupon: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
  
      const coupon = await Coupon.findByIdAndDelete(id);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
  
      res.status(200).json({ message: "Coupon deleted" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };
  
  // Update a coupon by ID
  export const updateCoupon: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { coupon_key, usage ,discount_percentage} = req.body;
  
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
  
      if (coupon_key !== undefined) coupon.coupon_key = coupon_key;
      if (usage !== undefined) coupon.usage = usage;
      if (discount_percentage !== undefined) coupon.discount_percentage = discount_percentage;
  
      await coupon.save();
  
      res.status(200).json(coupon);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };

  // Check if a coupon is valid
export const checkCoupon: RequestHandler = async (req, res) => {
    try {
      const { coupon_key } = req.body;
  
      // Find the coupon by its key
      const coupon = await Coupon.findOne({ coupon_key });
      if (!coupon) {
        return res.status(404).json({ valid: false, message: "Coupon not found" });
      }
  
      // Check coupon usage
      if (coupon.usage === 0) {
        return res.status(200).json({ valid: false, message: "Coupon has been fully used" });
      }
  
      res.status(200).json({ valid: true, message: "Coupon is valid" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  };