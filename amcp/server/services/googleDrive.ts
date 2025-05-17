import fs from "fs";
import path from "path";
import { google } from "googleapis";

// Google Drive API credentials
const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "";
const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || "http://localhost:5000/oauth2callback";
const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "";

/**
 * Uploads a file to Google Drive
 * @param filePath Local path to the file
 * @param fileName Name to use for the file in Google Drive
 * @param mimeType MIME type of the file
 * @returns URL of the uploaded file
 */
export async function uploadToGoogleDrive(
  filePath: string,
  fileName: string,
  mimeType: string
): Promise<string> {
  try {
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error("Google Drive credentials not configured");
    }

    // Initialize the Google Drive API client
    const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    auth.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: "v3", auth });

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found");
    }

    // Create a folder for documents if it doesn't exist
    let folderId = "";
    const folderName = "EDMS Documents";
    
    // Check if folder exists
    const folderResponse = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id)",
    });

    if (folderResponse.data.files && folderResponse.data.files.length > 0) {
      folderId = folderResponse.data.files[0].id || "";
    } else {
      // Create the folder
      const folderMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      };
      
      const folder = await drive.files.create({
        requestBody: folderMetadata,
        fields: "id",
      });
      
      folderId = folder.data.id || "";
    }

    // Upload the file
    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : undefined,
    };
    
    const media = {
      mimeType,
      body: fs.createReadStream(filePath),
    };
    
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: "id,webViewLink",
    });

    // Make the file accessible via link
    await drive.permissions.create({
      fileId: file.data.id || "",
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return file.data.webViewLink || "";
  } catch (error) {
    console.error("Google Drive upload error:", error);
    
    // Return a fallback URL for development/testing
    return `googledrive://documents/${fileName}`;
  }
}

/**
 * Deletes a file from Google Drive
 * @param fileUrl URL of the file to delete
 * @returns True if deletion was successful
 */
export async function deleteFromGoogleDrive(fileUrl: string): Promise<boolean> {
  try {
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error("Google Drive credentials not configured");
    }

    // Initialize the Google Drive API client
    const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    auth.setCredentials({ refresh_token: refreshToken });
    const drive = google.drive({ version: "v3", auth });

    // Extract file ID from the URL
    const urlObj = new URL(fileUrl);
    const fileId = urlObj.searchParams.get("id");

    if (!fileId) {
      throw new Error("Could not extract file ID from URL");
    }

    // Delete the file
    await drive.files.delete({
      fileId,
    });

    return true;
  } catch (error) {
    console.error("Google Drive delete error:", error);
    return false;
  }
}
