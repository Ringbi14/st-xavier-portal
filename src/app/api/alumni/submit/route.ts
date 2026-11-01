import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const {
      fullName,
      batchYear,
      email,
      photoUrl,
      designation,
      currentRole,
      organization,
      higherStudies,
      quote,
      linkedinUrl,
      sector,
      location,
    } = body;

    // 1. Required Field Validation
    if (
      !fullName ||
      typeof fullName !== "string" ||
      fullName.trim().length < 2 ||
      fullName.trim().length > 100
    ) {
      return NextResponse.json(
        { error: "fullName is required and must be between 2 and 100 characters." },
        { status: 400 }
      );
    }

    if (
      !batchYear ||
      typeof batchYear !== "string" ||
      batchYear.trim().length < 2 ||
      batchYear.trim().length > 20
    ) {
      return NextResponse.json(
        { error: "batchYear is required and must be between 2 and 20 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (
      !email ||
      typeof email !== "string" ||
      email.trim().length < 5 ||
      email.trim().length > 150 ||
      !emailRegex.test(email.trim())
    ) {
      return NextResponse.json(
        { error: "A valid email address between 5 and 150 characters is required." },
        { status: 400 }
      );
    }

    if (typeof photoUrl !== "string") {
      return NextResponse.json(
        { error: "photoUrl is required and must be a string." },
        { status: 400 }
      );
    }

    // 2. Sanitize and Normalize Optional Fields (default to "")
    let cleanPhoto = photoUrl.trim();
    if (cleanPhoto.startsWith("http://")) {
      cleanPhoto = cleanPhoto.replace("http://", "https://");
    }

    let cleanLinkedin = (typeof linkedinUrl === "string" ? linkedinUrl : "").trim();
    if (cleanLinkedin.startsWith("http://")) {
      cleanLinkedin = cleanLinkedin.replace("http://", "https://");
    }
    if (cleanLinkedin && !cleanLinkedin.startsWith("https://")) {
      cleanLinkedin = "https://" + cleanLinkedin;
    }
    cleanLinkedin = cleanLinkedin.replace(/^https:\/\/[a-z]{2}\.linkedin\.com\//i, "https://www.linkedin.com/");

    const cleanDesignation = (typeof designation === "string" ? designation : (typeof currentRole === "string" ? currentRole : "")).trim();
    const cleanOrganization = (typeof organization === "string" ? organization : "").trim();
    const cleanHigherStudies = (typeof higherStudies === "string" ? higherStudies : "").trim();
    const cleanQuote = (typeof quote === "string" ? quote : "").trim();
    const cleanSector = (typeof sector === "string" ? sector : "Public Sector").trim() || "Public Sector";
    const cleanLocation = (typeof location === "string" ? location : "").trim();

    // 3. Generate document ID using adminDb
    const adminDb = getAdminDb();
    const docRef = adminDb.collection("alumni_profiles").doc();
    const id = docRef.id;

    const publicDetails = {
      fullName: fullName.trim(),
      batchYear: batchYear.trim(),
      designation: cleanDesignation,
      currentRole: cleanDesignation,
      organization: cleanOrganization,
      sector: cleanSector,
      location: cleanLocation,
      higherStudies: cleanHigherStudies,
      quote: cleanQuote,
      linkedinUrl: cleanLinkedin,
      photoUrl: cleanPhoto,
      approved: false,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    };

    const privateContact = {
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
      createdAt: FieldValue.serverTimestamp(),
    };

    // 4. Atomic batch write: alumni_profiles, alumni (for dashboard compatibility), and alumni_private
    const batch = adminDb.batch();
    batch.set(docRef, publicDetails);
    batch.set(adminDb.collection("alumni").doc(id), publicDetails);
    batch.set(adminDb.collection("alumni_private").doc(id), privateContact);
    await batch.commit();

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error: any) {
    console.error("Alumni submission error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to submit alumni profile." },
      { status: 400 }
    );
  }
}
