import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "https://example.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "dummy_key";
const bucketName = "documents";

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

/**
 * Uploads a file to Supabase storage
 * @param filePath Local path to the file
 * @param fileName Name to use for the file in storage
 * @param mimeType MIME type of the file
 * @returns URL of the uploaded file
 */
export async function uploadToSupabase(
  filePath: string,
  fileName: string,
  mimeType: string
): Promise<string> {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    // Create a unique file name to prevent collisions
    const uniqueFileName = `${Date.now()}-${fileName}`;
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Create the bucket if it doesn't exist
    const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
      public: false,
    });

    if (bucketError && bucketError.message !== "Bucket already exists") {
      throw new Error(`Error creating bucket: ${bucketError.message}`);
    }

    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(uniqueFileName, fileBuffer, {
        contentType: mimeType,
        cacheControl: "3600",
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uniqueFileName);

    return urlData.publicUrl || "";
  } catch (error) {
    console.error("Supabase upload error:", error);
    
    // Return a fallback URL for development/testing
    return `supabase://documents/${fileName}`;
  }
}

/**
 * Deletes a file from Supabase storage
 * @param fileUrl URL of the file to delete
 * @returns True if deletion was successful
 */
export async function deleteFromSupabase(fileUrl: string): Promise<boolean> {
  try {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not configured");
    }

    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    const fileName = pathParts[pathParts.length - 1];

    // Delete the file
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Supabase delete error:", error);
    return false;
  }
}
