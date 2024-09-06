import express from "express";
import "dotenv/config";
import "./db";
import authRouter from "./routers/auth";
import eventRouter from "./routers/event"; // Import eventRouter
import couponRouter from "./routers/coupon"; // Import eventRouter
import blogRouter from "./routers/blog"; 



const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));


// Routes
app.use("/auth", authRouter);
app.use("/events", eventRouter); // Use eventRouter
app.use("/coupons", couponRouter);
app.use("/blogs", blogRouter)



const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
