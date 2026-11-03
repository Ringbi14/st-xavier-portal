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
      quote,
      linkedinUrl,
      bot_check,
      designation,
      currentRole,
      organization,
      higherStudies,
      sector,
      location,
    } = body;

    // Honeypot check: reject bot submissions silently
    if (bot_check && typeof bot_check === "string" && bot_check.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: "Submission received." },
        { status: 200 }
      );
    }

    // 1. Strict Validation on Required Fields
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

    if (
      !photoUrl ||
      typeof photoUrl !== "string" ||
      photoUrl.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "photoUrl is required and must be a valid Cloudinary image URL." },
        { status: 400 }
      );
    }

    let cleanPhoto = photoUrl.trim();
    if (cleanPhoto.startsWith("http://")) {
      cleanPhoto = cleanPhoto.replace("http://", "https://");
    }

    if (!cleanPhoto.startsWith("https://")) {
      return NextResponse.json(
        { error: "photoUrl must be a secure HTTPS URL." },
        { status: 400 }
      );
    }

    try {
      const parsedUrl = new URL(cleanPhoto);
      if (parsedUrl.protocol !== "https:") {
        return NextResponse.json(
          { error: "photoUrl must use HTTPS protocol." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "photoUrl must be a valid URL string." },
        { status: 400 }
      );
    }

    if (!cleanPhoto.startsWith("https://res.cloudinary.com/")) {
      return NextResponse.json(
        { error: "photoUrl must be hosted on Cloudinary (https://res.cloudinary.com/...)." },
        { status: 400 }
      );
    }

    // 2. Sanitize and Normalize Optional Fields
    let cleanLinkedin = (typeof linkedinUrl === "string" ? linkedinUrl : "").trim();
    if (cleanLinkedin.startsWith("http://")) {
      cleanLinkedin = cleanLinkedin.replace("http://", "https://");
    }
    if (cleanLinkedin && !cleanLinkedin.startsWith("https://")) {
      cleanLinkedin = "https://" + cleanLinkedin;
    }
    cleanLinkedin = cleanLinkedin.replace(/^https:\/\/[a-z]{2}\.linkedin\.com\//i, "https://www.linkedin.com/");

    // Optional quote (max 300 characters)
    const cleanQuote = (typeof quote === "string" ? quote : "").trim().slice(0, 300);

    // Default currentRole, organization, higherStudies, location, sector to "" in alumni_profiles
    const cleanCurrentRole = (typeof currentRole === "string" ? currentRole : (typeof designation === "string" ? designation : "")).trim();
    const cleanOrganization = (typeof organization === "string" ? organization : "").trim();
    const cleanHigherStudies = (typeof higherStudies === "string" ? higherStudies : "").trim();
    const cleanLocation = (typeof location === "string" ? location : "").trim();
    const cleanSector = (typeof sector === "string" ? sector : "").trim();

    // 3. Generate document ID using adminDb
    const adminDb = getAdminDb();
    const docRef = adminDb.collection("alumni_profiles").doc();
    const id = docRef.id;

    const publicDetails = {
      fullName: fullName.trim(),
      batchYear: batchYear.trim(),
      designation: cleanCurrentRole,
      currentRole: cleanCurrentRole,
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
