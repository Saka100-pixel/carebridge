import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import professionalsRouter from "./professionals.js";
import bookingsRouter from "./bookings.js";
import reviewsRouter from "./reviews.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/professionals", professionalsRouter);
router.use("/bookings", bookingsRouter);
router.use("/reviews", reviewsRouter);
router.use("/admin", adminRouter);

export default router;
