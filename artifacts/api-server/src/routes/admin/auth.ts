import { Router } from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

const router = Router();
const ADMIN_COOKIE = "sk_admin_session";
const SESSION_PAYLOAD = "storekit-admin-session-v1";

function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "storekit-local-admin-secret";
}

function createSessionToken(): string {
  return createHmac("sha256", getAdminSecret()).update(SESSION_PAYLOAD).digest("hex");
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = createSessionToken();
  const provided = Buffer.from(token, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return provided.length === expectedBuffer.length && timingSafeEqual(provided, expectedBuffer);
}

function verifyAdminAuth(req: any, res: any): boolean {
  const cookie = req.cookies?.[ADMIN_COOKIE];
  if (!verifySessionToken(cookie)) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

router.post("/login", async (req, res): Promise<void> => {
  try {
    const { password } = req.body;
    // Default password so the store works on first deploy without any config
    const adminPassword = process.env.ADMIN_PASSWORD ?? "storekit2024";

    if (password !== adminPassword) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    res.cookie(ADMIN_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, message: "Logged in" });
  } catch (err) {
    req.log.error({ err }, "Admin login failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res): void => {
  res.clearCookie(ADMIN_COOKIE);
  res.json({ success: true, message: "Logged out" });
});

router.get("/check", (req, res): void => {
  if (verifyAdminAuth(req, res)) {
    res.json({ success: true, message: "Authenticated" });
  }
});

export { verifyAdminAuth };
export default router;
