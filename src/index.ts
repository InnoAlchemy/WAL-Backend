import express from "express";
import "dotenv/config";
import "./db";
import authRouter from "./routers/auth";
import eventRouter from "./routers/event"; // Import eventRouter
import couponRouter from "./routers/coupon"; // Import eventRouter
import blogRouter from "./routers/blog"; 
import categoryRoutes from "./routers/category"; 



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));



app.use("/auth", authRouter);
app.use("/events", eventRouter);
app.use("/coupons", couponRouter);
app.use("/blogs", blogRouter)
app.use("/category", categoryRoutes)



const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
