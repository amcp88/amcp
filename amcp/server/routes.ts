import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { insertProjectSchema, insertDocumentSchema } from "@shared/schema";
import { analyzeDocument } from "./services/openai";
import { uploadToSupabase } from "./services/supabase";
import { uploadToGoogleDrive } from "./services/googleDrive";

// Extend Request to include file from multer
declare global {
  namespace Express {
    interface Request {
      file?: any;
    }
  }
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
      cb(null, uploadDir);
    },
    filename: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setting up the server
  const httpServer = createServer(app);

  // ===== API Routes =====

  // Get stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ===== Project Routes =====

  // Get all projects
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get recent projects
  app.get("/api/projects/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const projects = await storage.getRecentProjects(limit);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching recent projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get project by ID
  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create project
  app.post("/api/projects", async (req: Request, res: Response) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update project
  app.patch("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      
      const updatedProject = await storage.updateProject(id, validatedData);
      
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete project
  app.delete("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ===== Document Routes =====

  // Get all documents
  app.get("/api/documents", async (req: Request, res: Response) => {
    try {
      const documents = await storage.getDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get recent documents
  app.get("/api/documents/recent", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      const documents = await storage.getRecentDocuments(limit);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching recent documents:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get documents by project ID
  app.get("/api/projects/:projectId/documents", async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const documents = await storage.getDocumentsByProject(projectId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching project documents:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get document by ID
  app.get("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Upload document
  app.post("/api/documents/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      const fileSize = file.size;
      const filePath = file.path;
      const fileName = req.body.name || file.originalname;
      const fileType = path.extname(file.originalname).substring(1).toUpperCase();
      const mimeType = file.mimetype;

      // Determine storage type based on file size
      // Less than 10MB: Supabase, Greater than 10MB: Google Drive
      const sizeThreshold = 10 * 1024 * 1024; // 10MB
      const storageType = fileSize < sizeThreshold ? "supabase" : "googledrive";

      // The URL where the file is stored (either Supabase or Google Drive)
      let storedFileUrl = "";

      if (storageType === "supabase") {
        // Upload to Supabase
        storedFileUrl = await uploadToSupabase(filePath, fileName, mimeType);
      } else {
        // Upload to Google Drive
        storedFileUrl = await uploadToGoogleDrive(filePath, fileName, mimeType);
      }

      // Create document record in database
      const documentData = {
        name: fileName,
        description: req.body.description || "",
        type: fileType,
        projectId: req.body.projectId ? parseInt(req.body.projectId) : null,
        userId: 1, // Default to the admin user for now
        filePath: storedFileUrl,
        storageType,
        fileSize,
        mimeType,
      };

      const validatedData = insertDocumentSchema.parse(documentData);
      const document = await storage.createDocument(validatedData);

      // Analyze document content if it's a text-based document
      const textBasedTypes = ["PDF", "DOC", "DOCX", "TXT"];
      if (textBasedTypes.includes(fileType)) {
        // Process with OpenAI asynchronously
        analyzeDocument(filePath, fileType)
          .then(async (analysis) => {
            if (analysis) {
              await storage.updateDocumentAnalysis(document.id, analysis);
            }
          })
          .catch((error) => {
            console.error("Error analyzing document:", error);
          });
      }

      // Delete temporary file
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });

      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update document
  app.patch("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDocumentSchema.partial().parse(req.body);
      
      const updatedDocument = await storage.updateDocument(id, validatedData);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(updatedDocument);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete document
  app.delete("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export report
  app.get("/api/reports/export", async (req: Request, res: Response) => {
    try {
      const reportType = req.query.type || 'document';
      const timeRange = req.query.timeRange || 'month';
      const format = req.query.format || 'pdf';
      
      // This would normally generate the report, but for now we'll just send a placeholder response
      res.json({ 
        message: "Report generation is not implemented yet",
        reportType,
        timeRange,
        format
      });
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
