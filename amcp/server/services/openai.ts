import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { log } from "../vite";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyzes a document using OpenAI to extract information
 * @param filePath Path to the document file
 * @param fileType Type of the document (PDF, DOC, etc.)
 * @returns Analysis object with summary, keywords, and categories
 */
export async function analyzeDocument(filePath: string, fileType: string): Promise<any | null> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      log("OPENAI_API_KEY not found in environment", "openai");
      console.warn("OpenAI API key not configured. Document analysis skipped.");
      return null;
    }
    
    if (!fs.existsSync(filePath)) {
      log(`File not found: ${filePath}`, "openai");
      return null;
    }
    
    // Read file as base64 for image-based documents
    const fileContent = fs.readFileSync(filePath);
    
    // For text files, we can directly extract content
    let textContent = '';
    if (['txt', 'md', 'csv', 'json', 'html', 'xml', 'js', 'ts', 'css'].includes(fileType.toLowerCase())) {
      textContent = fileContent.toString('utf-8').slice(0, 10000); // Limit to 10k chars
    }
    
    const base64Content = fileContent.toString('base64');
    const fileName = path.basename(filePath);

    // Create system prompt based on file type
    const systemPrompt = `Anda adalah asisten analisis dokumen untuk perusahaan konstruksi.
    Analisis dokumen ${fileType.toUpperCase()} berikut ini secara detail.
    Ekstrak informasi berikut:
    1. Ringkasan singkat mengenai dokumen (maksimal 300 karakter)
    2. 3-6 kata kunci atau tag yang relevan
    3. Kategori utama atau jenis dokumen (kontrak, laporan, spesifikasi, faktur, rencana, dsb.)
    4. Tanggal-tanggal penting yang disebutkan dalam dokumen
    5. Nilai numerik atau pengukuran yang signifikan
    6. Nama-nama orang atau organisasi yang disebutkan
    
    Format respons Anda sebagai objek JSON dengan struktur berikut:
    {
      "summary": "Teks ringkasan singkat",
      "keywords": ["katakunci1", "katakunci2", "katakunci3"],
      "category": "kategori utama", 
      "dates": ["format YYYY-MM-DD jika memungkinkan"],
      "values": ["nilai numerik dengan satuan"],
      "entities": ["nama orang/organisasi"]
    }`;

    // Use different approach based on file type
    let response;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(fileType.toLowerCase())) {
      // Use vision model for image-based documents
      response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analisis dokumen ini dan ekstrak informasi yang diminta: ${fileName}`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/${fileType};base64,${base64Content}`,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });
    } else {
      // Use regular model for text-based documents
      response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: textContent || `[Ini adalah dokumen ${fileType.toUpperCase()} yang membutuhkan analisis: ${fileName}]`,
          },
        ],
        response_format: { type: "json_object" },
      });
    }
    
    // Parse the response
    const analysisText = response.choices[0]?.message?.content || "{}";
    let analysis;
    
    try {
      analysis = JSON.parse(analysisText);
      
      // Add metadata
      analysis.analyzedAt = new Date().toISOString();
      analysis.fileType = fileType;
      analysis.fileName = fileName;
      
      return analysis;
    } catch (parseError) {
      log(`Error parsing OpenAI response: ${parseError.message}`, "openai");
      console.error("Error parsing OpenAI response:", parseError);
      
      // Create a structured response from the text if JSON parsing fails
      return {
        summary: "Terjadi kesalahan saat menganalisis dokumen.",
        keywords: [],
        category: "Tidak Terkategorisasi",
        analyzedAt: new Date().toISOString(),
        fileType: fileType,
        fileName: fileName
      };
    }
  } catch (error) {
    log(`Error analyzing document: ${error.message}`, "openai");
    console.error("Error analyzing document:", error);
    return null;
  }
}
