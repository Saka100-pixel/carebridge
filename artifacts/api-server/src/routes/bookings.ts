import { Router } from "express";
import { db } from "@workspace/db";
import { bookings, professionals, users } from "@workspace/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { requireAuth, type AuthPayload } from "../middlewares/auth.js";
import type { Request } from "express";

const router = Router();

const PLATFORM_FEE_RATE = 0.20; // 20%

// POST /api/bookings
router.post("/", requireAuth, async (req, res) => {
  try {
    const auth = (req as Request & { auth: AuthPayload }).auth;
    const {
      professionalId, shiftType, scheduledDate,
      patientNotes, patientAddress, patientName,
      paymentMethod, urgentRequest,
    } = req.body;

    if (!professionalId || !shiftType || !scheduledDate || !patientAddress || !patientName) {
      res.status(400).json({ error: "professionalId, shiftType, scheduledDate, patientAddress, and patientName are required" });
      return;
    }

    const [prof] = await db
      .select()
      .from(professionals)
      .where(eq(professionals.id, parseInt(professionalId, 10)))
      .limit(1);

    if (!prof) {
      res.status(404).json({ error: "Professional not found" });
      return;
    }

    if (prof.verificationStatus !== "approved") {
      res.status(400).json({ error: "This professional is not yet verified" });
      return;
    }

    const shiftRate = parseFloat(prof.shiftRate ?? "350");
    const platformFee = parseFloat((shiftRate * PLATFORM_FEE_RATE).toFixed(2));
    const totalAmount = parseFloat((shiftRate + platformFee).toFixed(2));

    const [booking] = await db
      .insert(bookings)
      .values({
        patientId: auth.userId,
        professionalId: prof.id,
        shiftType,
        scheduledDate: new Date(scheduledDate),
        totalAmount: totalAmount.toString(),
        platformFee: platformFee.toString(),
        patientNotes: patientNotes ?? null,
        patientAddress,
        patientName,
        paymentMethod: paymentMethod ?? null,
        urgentRequest: urgentRequest ?? false,
      })
      .returning();

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookings — returns bookings for the authenticated user
router.get("/", requireAuth, async (req, res) => {
  try {
    const auth = (req as Request & { auth: AuthPayload }).auth;

    // Find professional profile if user is a professional
    const [profProfile] = await db
      .select()
      .from(professionals)
      .where(eq(professionals.userId, auth.userId))
      .limit(1);

    let rows;
    if (auth.role === "professional" && profProfile) {
      rows = await db
        .select({
          id: bookings.id,
          shiftType: bookings.shiftType,
          scheduledDate: bookings.scheduledDate,
          status: bookings.status,
          totalAmount: bookings.totalAmount,
          platformFee: bookings.platformFee,
          paymentMethod: bookings.paymentMethod,
          paymentStatus: bookings.paymentStatus,
          patientName: bookings.patientName,
          patientAddress: bookings.patientAddress,
          patientNotes: bookings.patientNotes,
          urgentRequest: bookings.urgentRequest,
          createdAt: bookings.createdAt,
          professionalId: bookings.professionalId,
          patientId: bookings.patientId,
          patientFirstName: users.firstName,
          patientLastName: users.lastName,
        })
        .from(bookings)
        .innerJoin(users, eq(bookings.patientId, users.id))
        .where(eq(bookings.professionalId, profProfile.id))
        .orderBy(desc(bookings.createdAt));
    } else {
      rows = await db
        .select({
          id: bookings.id,
          shiftType: bookings.shiftType,
          scheduledDate: bookings.scheduledDate,
          status: bookings.status,
          totalAmount: bookings.totalAmount,
          platformFee: bookings.platformFee,
          paymentMethod: bookings.paymentMethod,
          paymentStatus: bookings.paymentStatus,
          patientName: bookings.patientName,
          patientAddress: bookings.patientAddress,
          patientNotes: bookings.patientNotes,
          urgentRequest: bookings.urgentRequest,
          createdAt: bookings.createdAt,
          professionalId: bookings.professionalId,
          patientId: bookings.patientId,
          profFirstName: users.firstName,
          profLastName: users.lastName,
        })
        .from(bookings)
        .innerJoin(professionals, eq(bookings.professionalId, professionals.id))
        .innerJoin(users, eq(professionals.userId, users.id))
        .where(eq(bookings.patientId, auth.userId))
        .orderBy(desc(bookings.createdAt));
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookings/:id
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const auth = (req as Request & { auth: AuthPayload }).auth;
    const id = parseInt(req.params.id, 10);

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id))
      .limit(1);

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    // Verify access: patient, professional on that booking, or admin
    const [profProfile] = await db
      .select()
      .from(professionals)
      .where(eq(professionals.userId, auth.userId))
      .limit(1);

    const isOwner = booking.patientId === auth.userId;
    const isProf = profProfile && booking.professionalId === profProfile.id;
    const isAdmin = auth.role === "admin";

    if (!isOwner && !isProf && !isAdmin) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/bookings/:id/status
router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const auth = (req as Request & { auth: AuthPayload }).auth;
    const id = parseInt(req.params.id, 10);
    const { status } = req.body as { status: string };

    const validStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `status must be one of: ${validStatuses.join(", ")}` });
      return;
    }

    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    const [profProfile] = await db
      .select()
      .from(professionals)
      .where(eq(professionals.userId, auth.userId))
      .limit(1);

    const isPatient = booking.patientId === auth.userId;
    const isProf = profProfile && booking.professionalId === profProfile.id;
    const isAdmin = auth.role === "admin";

    if (!isPatient && !isProf && !isAdmin) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: status as never,
        paymentStatus: status === "completed" ? "released" : booking.paymentStatus,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
      .returning();

    // Increment professional totalBookings on completion
    if (status === "completed") {
      await db
        .update(professionals)
        .set({ totalBookings: (booking.professionalId ?? 0) + 1 })
        .where(eq(professionals.id, booking.professionalId));
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
