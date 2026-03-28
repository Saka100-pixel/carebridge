import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Enums ──────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", [
  "patient",
  "professional",
  "admin",
]);

export const disciplineEnum = pgEnum("discipline", [
  "registered_nurse",
  "midwife",
  "physiotherapist",
  "mental_health_counsellor",
  "certified_caregiver",
]);

export const shiftTypeEnum = pgEnum("shift_type", ["8h", "12h", "24h"]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "mtn_momo",
  "airtel_money",
  "zamtel",
  "card",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "held",
  "released",
  "refunded",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "approved",
  "rejected",
]);

// ── Users ──────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("patient"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Professionals ──────────────────────────────────────────────────────────────
export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  discipline: disciplineEnum("discipline").notNull(),
  licenseNumber: text("license_number"),
  licenseBody: text("license_body"), // "NMCZ" | "HPCZ"
  bio: text("bio"),
  institution: text("institution"),
  yearsExperience: integer("years_experience"),
  specializations: text("specializations").array(),
  location: text("location"),
  shiftRate: decimal("shift_rate", { precision: 10, scale: 2 }),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  available: boolean("available").notNull().default(true),
  verificationStatus: verificationStatusEnum("verification_status")
    .notNull()
    .default("pending"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalBookings: integer("total_bookings").notNull().default(0),
  profilePhoto: text("profile_photo"),
  certExpiry: text("cert_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Bookings ───────────────────────────────────────────────────────────────────
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id")
    .notNull()
    .references(() => users.id),
  professionalId: integer("professional_id")
    .notNull()
    .references(() => professionals.id),
  shiftType: shiftTypeEnum("shift_type").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  status: bookingStatusEnum("status").notNull().default("pending"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method"),
  paymentStatus: paymentStatusEnum("payment_status")
    .notNull()
    .default("pending"),
  patientNotes: text("patient_notes"),
  patientAddress: text("patient_address").notNull(),
  patientName: text("patient_name").notNull(),
  urgentRequest: boolean("urgent_request").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Reviews ────────────────────────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id")
    .notNull()
    .references(() => bookings.id),
  reviewerId: integer("reviewer_id")
    .notNull()
    .references(() => users.id),
  revieweeId: integer("reviewee_id")
    .notNull()
    .references(() => users.id),
  rating: integer("rating").notNull(), // 1–5
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Insert schemas (Zod) ───────────────────────────────────────────────────────
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  totalBookings: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

// ── Select types ───────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type Professional = typeof professionals.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
