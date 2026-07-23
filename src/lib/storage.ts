import { createAdminClient } from "./supabase/server";

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  DOCUMENTS: "documents",
  VAULT: "vault",
} as const;

/**
  Ensure Supabase Storage buckets exist and are correctly configured.
 */
export async function ensureStorageBucketsExist() {
  const adminSupabase = createAdminClient();
  const { data: buckets, error } = await adminSupabase.storage.listBuckets();

  if (error) {
    console.error("Failed to list Supabase storage buckets:", error.message);
    return;
  }

  const existingNames = new Set((buckets || []).map((b: { name: string }) => b.name));

  // 1. Avatars Bucket (Public access for user avatars & org logos)
  if (!existingNames.has(STORAGE_BUCKETS.AVATARS)) {
    await adminSupabase.storage.createBucket(STORAGE_BUCKETS.AVATARS, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
    });
  }

  // 2. Verification Documents Bucket (Private access for GST, PAN, NOC, Certificates)
  if (!existingNames.has(STORAGE_BUCKETS.DOCUMENTS)) {
    await adminSupabase.storage.createBucket(STORAGE_BUCKETS.DOCUMENTS, {
      public: false,
      fileSizeLimit: 26214400, // 25MB
      allowedMimeTypes: [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });
  }

  // 3. Vault Bucket (Private access for NDAs, MOUs, Reports, Deliverables)
  if (!existingNames.has(STORAGE_BUCKETS.VAULT)) {
    await adminSupabase.storage.createBucket(STORAGE_BUCKETS.VAULT, {
      public: false,
      fileSizeLimit: 52428800, // 50MB
    });
  }
}

/**
  Upload a file buffer directly to Supabase Storage.
 */
export async function uploadToStorage(
  bucket: string,
  filePath: string,
  fileBuffer: Buffer | Uint8Array,
  contentType: string
) {
  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Supabase Storage Upload Error: ${error.message}`);
  }

  // Get Public URL if public bucket
  if (bucket === STORAGE_BUCKETS.AVATARS) {
    const { data: publicUrlData } = adminSupabase.storage.from(bucket).getPublicUrl(filePath);
    return { path: data.path, url: publicUrlData.publicUrl, isPublic: true };
  }

  // Generate 1-hour signed URL for private buckets
  const { data: signedUrlData, error: signedErr } = await adminSupabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 3600);

  if (signedErr) {
    return { path: data.path, url: "", isPublic: false };
  }

  return { path: data.path, url: signedUrlData.signedUrl, isPublic: false };
}
