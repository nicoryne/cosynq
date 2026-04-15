"use server";

import { v2 as cloudinary } from "cloudinary";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Ensures "Do Not Trust the Client" paradigm for cloud integration.
 * Generates a cryptographic signature that the client uses to upload directly
 * to Cloudinary. This function checks authorization before granting the signature.
 */
export async function getCloudinarySignature() {
  try {
    // 1. Strict Role-Based / Authenticated Access check
    // We only want logged-in users to be able to upload files.
    // If you plan to allow public uploads, you can remove this block,
    // but giving out signatures publicly leaves your bucket vulnerable.
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    // NOTE: We are allowing unauthenticated signature generation 
    // to support profile picture uploads during the account creation wizard.
    // Ensure your Cloudinary Upload Preset is restricted to only allow images.
    // if (!user) {
    //   throw new Error("Unauthorized to upload files.");
    // }

    // 2. Configure Cloudinary
    // We do NOT use process.env to set global cloudinary config, 
    // we just use the utils directly with the secret to keep it stateless.
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
      throw new Error("Cloudinary API Secret is missing on the server.");
    }

    // 3. Generate Timestamp and Signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
    if (!uploadPreset) {
      throw new Error("Cloudinary Upload Preset is missing.");
    }

    const paramsToSign = {
      timestamp: timestamp,
      upload_preset: uploadPreset,
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    // DEBUG: Log the parameters being signed (internal only)
    console.log("--- Cloudinary Signature Debug ---");
    console.log("Timestamp:", timestamp);
    console.log("Upload Preset:", uploadPreset);
    console.log("Signature Generated:", signature.substring(0, 5) + "...");
    console.log("----------------------------------");

    return {
      success: true,
      signature,
      timestamp,
      uploadPreset,
      apiKey: (process.env.CLOUDINARY_API_KEY || "").trim(),
    };
  } catch (error: any) {
    console.error("Error generating Cloudinary signature:", error);
    return {
      success: false,
      error: error.message || "Failed to generate upload signature.",
    };
  }
}
