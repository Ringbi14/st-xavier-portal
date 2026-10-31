import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import type { Auth } from "firebase-admin/auth";
import type { DecodedIdToken } from "firebase-admin/auth";

export const dynamic = "force-dynamic";

interface AuthSuccess {
  adminAuth: Auth;
  decoded: DecodedIdToken;
}

interface AuthFailure {
  error: string;
  status: number;
}

async function authenticateAdmin(req: Request): Promise<AuthSuccess | AuthFailure> {
  try {
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "Missing or malformed Authorization header.", status: 401 };
    }

    const token = authHeader.split("Bearer ")[1]?.trim();
    if (!token) {
      return { error: "Missing bearer token in authorization header.", status: 401 };
    }

    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);

    if (decoded.admin !== true) {
      return {
        error: "Forbidden: Verified administrator claim is required to access this endpoint.",
        status: 403,
      };
    }

    return { adminAuth, decoded };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Firebase Admin credentials not found")) {
      return {
        error:
          "Firebase Admin service account key is not configured on the server. Please set FIREBASE_SERVICE_ACCOUNT_KEY in your environment variables.",
        status: 503,
      };
    }
    console.error("Authentication verification failed:", err);
    return { error: `Authentication failed: ${msg}`, status: 401 };
  }
}

// ====================================================================
// GET: List all accounts with { admin: true } custom claims
// ====================================================================
export async function GET(req: Request) {
  try {
    const authResult = await authenticateAdmin(req);
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { adminAuth, decoded } = authResult;
    const listResult = await adminAuth.listUsers(100);

    const adminAccounts = listResult.users
      .filter((u) => u.customClaims?.admin === true)
      .map((u) => ({
        uid: u.uid,
        email: u.email || "",
        displayName: u.displayName || u.email?.split("@")[0] || "Faculty Admin",
        lastSignInTime: u.metadata.lastSignInTime || null,
        creationTime: u.metadata.creationTime || null,
        disabled: u.disabled,
        isCurrentCaller: u.uid === decoded.uid,
      }));

    return NextResponse.json({
      admins: adminAccounts,
      callerUid: decoded.uid,
    });
  } catch (err: unknown) {
    console.error("Failed to list admin accounts:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ====================================================================
// POST: Directly create or update and provision an admin account
// ====================================================================
export async function POST(req: Request) {
  try {
    const authResult = await authenticateAdmin(req);
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { adminAuth } = authResult;
    const body = await req.json().catch(() => ({}));
    const { displayName, email, password } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Initial password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (displayName || "").trim() || cleanEmail.split("@")[0];

    let userRecord;
    let isExisting = false;

    try {
      userRecord = await adminAuth.getUserByEmail(cleanEmail);
      isExisting = true;
      userRecord = await adminAuth.updateUser(userRecord.uid, {
        displayName: cleanName,
        password: password,
        disabled: false,
        emailVerified: true,
      });
    } catch (lookupErr: unknown) {
      const errCode = (lookupErr as { code?: string })?.code;
      if (errCode === "auth/user-not-found") {
        userRecord = await adminAuth.createUser({
          email: cleanEmail,
          displayName: cleanName,
          password: password,
          emailVerified: true,
          disabled: false,
        });
      } else {
        throw lookupErr;
      }
    }

    // Provision admin claim
    await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true });

    return NextResponse.json({
      success: true,
      message: isExisting
        ? `Existing account ${cleanEmail} updated and provisioned as Administrator.`
        : `Faculty administrator account for ${cleanEmail} created successfully.`,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      },
    });
  } catch (err: unknown) {
    console.error("Failed to provision admin account:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ====================================================================
// DELETE: Directly remove a faculty administrator account
// ====================================================================
export async function DELETE(req: Request) {
  try {
    const authResult = await authenticateAdmin(req);
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { adminAuth, decoded } = authResult;

    const url = new URL(req.url);
    let targetUid = url.searchParams.get("uid");
    if (!targetUid) {
      const body = await req.json().catch(() => ({}));
      targetUid = body.uid;
    }

    if (!targetUid || typeof targetUid !== "string") {
      return NextResponse.json({ error: "Target administrator UID is required." }, { status: 400 });
    }

    // Safety guard: Cannot delete yourself
    if (targetUid === decoded.uid) {
      return NextResponse.json(
        { error: "You cannot delete your own active administrator account." },
        { status: 400 }
      );
    }

    // Revoke sessions and delete account from Auth
    await adminAuth.revokeRefreshTokens(targetUid);
    await adminAuth.deleteUser(targetUid);

    return NextResponse.json({
      success: true,
      message: "Administrator account and login credentials have been permanently deleted.",
    });
  } catch (err: unknown) {
    console.error("Failed to delete admin account:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
