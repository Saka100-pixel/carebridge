import { Router } from "express";
import { db } from "@workspace/db";
import { reviews, bookings, professionals, users } from "@workspace/db/schema";
import { eq, avg, sql } from "drizzle-orm";
import { requireAuth, type AuthPayload } from "../middlewares/auth.js";
import type { Request } from "express";

const router = Router();

// POST /api/reviews
router.post("/", requireAuth, async (req, res) => {
  try {
    const auth = (req as Request & { auth: AuthPayload }).auth;
    const { bookingId, revieweeId, rating, comment } = req.body;

    if (!bookingId || !revieweeId || !rating) {
      res.status(400).json({ error: "bookingId, revieweeId, and rating are required" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "rating must be 1–5" });
      return;
    }

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(bookingId, 10)))
      .limit(1);

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (booking.status !== "completed") {
      res.status(400).json({ error: "Can only review completed bookings" });
      return;
    }

    const [review] = await db
      .insert(reviews)
      .values({
        bookingId: parseInt(bookingId, 10),
        reviewerId: auth.userId,
        revieweeId: parseInt(revieweeId, 10),
        rating: parseInt(rating, 10),
        comment: comment ?? null,
      })
      .returning();

    // Update professional rating average
    const [profProfile] = await db
      .select()
      .from(professionals)
      .where(eq(professionals.userId, parseInt(revieweeId, 10)))
      .limit(1);

    if (profProfile) {
      const [{ avgRating }] = await db
        .select({ avgRating: avg(reviews.rating) })
        .from(reviews)
        .where(eq(reviews.revieweeId, parseInt(revieweeId, 10)));

      await db
        .update(professionals)
        .set({ rating: parseFloat(avgRating ?? "0").toFixed(2) })
        .where(eq(professionals.id, profProfile.id));
    }

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/reviews?professionalUserId=123
router.get("/", async (req, res) => {
  try {
    const { professionalUserId } = req.query as Record<string, string>;

    if (!professionalUserId) {
      res.status(400).json({ error: "professionalUserId query param is required" });
      return;
    }

    const rows = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        reviewerFirstName: users.firstName,
        reviewerLastName: users.lastName,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .where(eq(reviews.revieweeId, parseInt(professionalUserId, 10)));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
