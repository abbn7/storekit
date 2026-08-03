/**
 * GET /api/config
 * Returns public runtime configuration for the frontend.
 * Safe to expose — only publishable/public keys, never secrets.
 */
import { Router } from "express";

const router = Router();

router.get("/", (_req, res): void => {
  res.json({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? null,
    stripeEnabled: !!process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

export default router;
