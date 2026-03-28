import { Router } from "express";
import { db } from "@workspace/db";
import { professionals, users } from "@workspace/db/schema";
import { eq, and, like, sql } from "drizzle-orm";
import { requireAuth, requireRole, type AuthPayload } from "../middlewares/auth.js";
import type { Request } from "express";

const router = Router();

// GET /api/professionals — public, filterable
router.get("/", async (req, res) => {
  try {
    const { discipline, location, available, page = "1", limit = "12" } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [eq(professionals.verificationStatus, "approved")];

    if (discipline) conditions.push(eq(professionals.discipline, discipline as never));
    if (location) conditions.push(like(professionals.location, `%${location}%`));
    if (available === "true") conditions.push(eq(professionals.available, true));

    const rows = await db
      .select({
        id: professionals.id,
        userId: professionals.userId,
        discipline: professionals.discipline,
        licenseNumber: professionals.licenseNumber,
        licenseBody: professionals.licenseBody,
        institution: professionals.institution,
        yearsExperience: professionals.yearsExperience,
        specializations: professionals.specializations,
        location: professionals.location,
        shiftRate: professionals.shiftRate,
        hourlyRate: professionals.hourlyRate,
        available: professionals.available,
        rating: professionals.rating,
        totalBookings: professionals.totalBookings,
        profilePhoto: professionals.profilePhoto,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(professionals)
      .innerJoin(users, eq(professionals.userId, users.id))
      .where(and(...conditions))
      .limit(limitNum)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(professionals)
      .where(and(...conditions));

    res.json({
      professionals: rows,
      pagination: { page: pageNum, limit: limitNum, total: Number(count), pages: Math.ceil(Number(count) / limitNum) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/professionals/:id — public
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [row] = await db
      .select({
        id: professionals.id,
        userId: professionals.userId,
        discipline: professionals.discipline,
        licenseNumber: professionals.licenseNumber,
        licenseBody: professionals.licenseBody,
        bio: professionals.bio,
        institution: professionals.institution,
        yearsExperience: professionals.yearsExperience,
        specializations: professionals.specializations,
        location: professionals.location,
        shiftRate: professionals.shiftRate,
        hourlyRate: professionals.hourlyRate,
        available: professionals.available,
        verificationStatus: professionals.verificationStatus,
        rating: professionals.rating,
        totalBookings: professionals.totalBookings,
        profilePhoto: professionals.profilePhoto,
        certExpiry: professionals.certExpiry,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
      })
      .from(professionals)
      .innerJoin(users, eq(professionals.userId, users.id))
      .where(eq(professionals.id, id))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Professional not found" });
      return;
    }

    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/professionals/me — create professional profile (requires auth as professional)
router.post("/me", requireAuth, requireRole("professional"), async (req, res) => {
  try {
    const auth = (req as Request & { auth: AuthPayload }).auth;

    const existing = await db
      .select()
      .from(professionals)
      .where(eq(professionals.userId, auth.userId))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ error: "Professional profile already exists. Use PUT /api/professionals/me to update." });
      return;
    }

    const {
      discipline, licenseNumber, licenseBody, bio, institution,
      yearsExperience, specializations, location, shiftRate, hourlyRate,
      profilePhoto, certExpiry,
    } = req.body;

    if (!discipline) {
      res.status(400).json({ error: "discipline is required" });
      return;
    }

    const [prof] = await db
      .insert(professionals)
      .values({
        userId: auth.userId,
        discipline,
        licenseNumber: licenseNumber ?? null,
        licenseBody: licenseBody ?? null,
        bio: bio ?? null,
        institution: institution ?? null,
        yearsExperience: yearsExperience ?? null,
        specializations: specializations ?? null,
        location: location ?? null,
        shiftRate: shiftRate ?? null,
        hourlyRate: hourlyRate ?? null,
        profilePhoto: profilePhoto ?? null,
        certExpiry: certExpiry ?? null,
      })
      .returning();

    res.status(201).json(prof);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/professionals/me — update own profile
router.put("/me", requireAuth, requireRole("professional"), async (req, res) => {
  try {
    const auth = (req as Request & { auth: AuthPayload }).auth;

    const [existing] = await db
      .select()
      .from(professionals)
      .where(eq(professionals.userId, auth.userId))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Professional profile not found. Create one first with POST /api/professionals/me" });
      return;
    }

    const {
      bio, institution, yearsExperience, specializations,
      location, shiftRate, hourlyRate, available, profilePhoto, certExpiry,
    } = req.body;

    const [updated] = await db
      .update(professionals)
      .set({
        bio: bio ?? existing.bio,
        institution: institution ?? existing.institution,
        yearsExperience: yearsExperience ?? existing.yearsExperience,
        specializations: specializations ?? existing.specializations,
        location: location ?? existing.location,
        shiftRate: shiftRate ?? existing.shiftRate,
        hourlyRate: hourlyRate ?? existing.hourlyRate,
        available: available !== undefined ? available : existing.available,
        profilePhoto: profilePhoto ?? existing.profilePhoto,
        certExpiry: certExpiry ?? existing.certExpiry,
        updatedAt: new Date(),
      })
      .where(eq(professionals.userId, auth.userId))
      .returning();

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
