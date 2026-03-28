import { Router } from "express";
import { db } from "@workspace/db";
import { professionals, users, bookings } from "@workspace/db/schema";
import { eq, count, sql, desc } from "drizzle-orm";
import { requireAuth, requireRole, type AuthPayload } from "../middlewares/auth.js";
import type { Request } from "express";

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireRole("admin"));

// GET /api/admin/stats
router.get("/stats", async (_req, res) => {
  try {
    const [[{ totalUsers }], [{ totalProfessionals }], [{ totalBookings: totalBookingsCount }], [{ pendingVerifications }]] = await Promise.all([
      db.select({ totalUsers: count() }).from(users),
      db.select({ totalProfessionals: count() }).from(professionals),
      db.select({ totalBookings: count() }).from(bookings),
      db.select({ pendingVerifications: count() }).from(professionals).where(eq(professionals.verificationStatus, "pending")),
    ]);

    const [{ revenue }] = await db
      .select({ revenue: sql<string>`COALESCE(SUM(platform_fee), 0)` })
      .from(bookings)
      .where(eq(bookings.paymentStatus, "released"));

    res.json({
      totalUsers: Number(totalUsers),
      totalProfessionals: Number(totalProfessionals),
      totalBookings: Number(totalBookingsCount),
      pendingVerifications: Number(pendingVerifications),
      totalRevenue: parseFloat(revenue ?? "0"),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/professionals?status=pending|approved|rejected
router.get("/professionals", async (req, res) => {
  try {
    const { status } = req.query as { status?: string };
    const conditions = status
      ? [eq(professionals.verificationStatus, status as never)]
      : [];

    const rows = await db
      .select({
        id: professionals.id,
        userId: professionals.userId,
        discipline: professionals.discipline,
        licenseNumber: professionals.licenseNumber,
        licenseBody: professionals.licenseBody,
        institution: professionals.institution,
        verificationStatus: professionals.verificationStatus,
        certExpiry: professionals.certExpiry,
        createdAt: professionals.createdAt,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
      })
      .from(professionals)
      .innerJoin(users, eq(professionals.userId, users.id))
      .where(conditions.length > 0 ? conditions[0] : sql`1=1`)
      .orderBy(desc(professionals.createdAt));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/professionals/:id/verify
router.patch("/professionals/:id/verify", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body as { status: "approved" | "rejected" };

    if (!["approved", "rejected"].includes(status)) {
      res.status(400).json({ error: "status must be 'approved' or 'rejected'" });
      return;
    }

    const [updated] = await db
      .update(professionals)
      .set({ verificationStatus: status, updatedAt: new Date() })
      .where(eq(professionals.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Professional not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    const { role } = req.query as { role?: string };
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        phone: users.phone,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(role ? eq(users.role, role as never) : sql`1=1`)
      .orderBy(desc(users.createdAt));

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/bookings
router.get("/bookings", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt))
      .limit(100);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
