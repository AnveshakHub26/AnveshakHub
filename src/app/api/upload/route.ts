import { NextRequest, NextResponse } from "next/server";
import { uploadToStorage, STORAGE_BUCKETS, ensureStorageBucketsExist } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "document";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    await ensureStorageBucketsExist();

    // Determine target bucket
    let bucket: string = STORAGE_BUCKETS.DOCUMENTS;
    if (category === "avatar" || category === "logo") {
      bucket = STORAGE_BUCKETS.AVATARS;
    } else if (category === "nda" || category === "mou" || category === "contract" || category === "deliverable") {
      bucket = STORAGE_BUCKETS.VAULT;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename & create unique storage path
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${category}/${timestamp}_${sanitizedName}`;

    const result = await uploadToStorage(bucket, storagePath, buffer, file.type);

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully to Supabase Storage",
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        bucket,
        path: result.path,
        url: result.url,
        isPublic: result.isPublic,
      }
    });
  } catch (error: any) {
    console.error("File Upload Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file to Supabase Storage" },
      { status: 500 }
    );
  }
}
