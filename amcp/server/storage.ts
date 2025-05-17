import { eq, desc, count, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  users, projects, documents,
  type User, type InsertUser, 
  type Project, type InsertProject, 
  type Document, type InsertDocument 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  getRecentProjects(limit?: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocuments(): Promise<Document[]>;
  getDocumentsByProject(projectId: number): Promise<Document[]>;
  getRecentDocuments(limit?: number): Promise<Document[]>;
  getDocumentsByUserId(userId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  updateDocumentAnalysis(id: number, analysis: any): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Stats operations
  getStats(): Promise<{
    totalDocuments: number;
    activeProjects: number;
    documentsThisMonth: number;
    storage: string;
  }>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private documents: Map<number, Document>;
  private userIdCounter: number;
  private projectIdCounter: number;
  private documentIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.documents = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    this.documentIdCounter = 1;

    // Initialize with sample admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "Admin Sistem",
      role: "admin"
    });

    // Initialize with sample projects
    this.createProject({
      name: "Pembangunan Apartemen Grand Residence",
      description: "Proyek pembangunan apartemen mewah di Jakarta Selatan",
      location: "Jakarta Selatan",
      status: "active",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      startDate: new Date(),
      endDate: new Date(Date.now() + 31536000000), // 1 year from now
    });

    this.createProject({
      name: "Jembatan Suramadu Extension",
      description: "Proyek perpanjangan jembatan Suramadu",
      location: "Surabaya",
      status: "active",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
      startDate: new Date(),
      endDate: new Date(Date.now() + 15768000000), // 6 months from now
    });

    this.createProject({
      name: "Bandung Tech Park",
      description: "Pembangunan tech park di Bandung",
      location: "Bandung",
      status: "pending",
      image: "https://pixabay.com/get/gad66bd55e9659dd65a8b1eb3e69a78ebc0224f003914a1332944abe9190d36a077372b4b7ba7817be77e4c87a8b6d59d6b975c4c54a89f29d9caec96f677e919_1280.jpg",
      startDate: new Date(),
      endDate: null,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getRecentProjects(limit: number = 3): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id, 
      name: insertProject.name,
      location: insertProject.location,
      description: insertProject.description || null,
      status: insertProject.status || "active",
      image: insertProject.image || null,
      startDate: insertProject.startDate || null,
      endDate: insertProject.endDate || null,
      createdAt: now, 
      updatedAt: now 
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject: Project = { 
      ...project, 
      ...projectData,
      updatedAt: new Date() 
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentsByProject(projectId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.projectId === projectId);
  }

  async getRecentDocuments(limit: number = 4): Promise<Document[]> {
    return Array.from(this.documents.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(doc => doc.userId === userId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentIdCounter++;
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id, 
      name: insertDocument.name,
      type: insertDocument.type,
      description: insertDocument.description || null,
      projectId: insertDocument.projectId || null,
      userId: insertDocument.userId,
      filePath: insertDocument.filePath,
      storageType: insertDocument.storageType,
      fileSize: insertDocument.fileSize,
      mimeType: insertDocument.mimeType,
      isAnalyzed: false,
      analysis: null,
      createdAt: now, 
      updatedAt: now 
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, documentData: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;

    const updatedDocument: Document = { 
      ...document, 
      ...documentData,
      updatedAt: new Date() 
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async updateDocumentAnalysis(id: number, analysis: any): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;

    const updatedDocument: Document = { 
      ...document, 
      analysis,
      isAnalyzed: true,
      updatedAt: new Date() 
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Stats operations
  async getStats(): Promise<{
    totalDocuments: number;
    activeProjects: number;
    documentsThisMonth: number;
    storage: string;
  }> {
    const totalDocuments = this.documents.size;
    
    const activeProjects = Array.from(this.projects.values())
      .filter(project => project.status === 'active').length;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const documentsThisMonth = Array.from(this.documents.values())
      .filter(doc => doc.createdAt >= startOfMonth).length;
    
    // Calculate storage in bytes and convert to human-readable format
    const totalStorage = Array.from(this.documents.values())
      .reduce((total, doc) => total + doc.fileSize, 0);
    
    const storage = this.formatBytes(totalStorage);
    
    return {
      totalDocuments,
      activeProjects,
      documentsThisMonth,
      storage
    };
  }

  // Helper function to format bytes
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// PostgreSQL Storage implementation with Drizzle ORM
export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private client: ReturnType<typeof postgres>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    this.client = postgres(process.env.DATABASE_URL, { max: 10 });
    this.db = drizzle(this.client);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const result = await this.db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getProjects(): Promise<Project[]> {
    return await this.db.select().from(projects).orderBy(desc(projects.updatedAt));
  }

  async getRecentProjects(limit: number = 3): Promise<Project[]> {
    return await this.db.select().from(projects)
      .orderBy(desc(projects.updatedAt))
      .limit(limit);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await this.db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await this.db.update(projects)
      .set({ ...projectData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await this.db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    const result = await this.db.select().from(documents).where(eq(documents.id, id)).limit(1);
    return result[0];
  }

  async getDocuments(): Promise<Document[]> {
    return await this.db.select().from(documents).orderBy(desc(documents.createdAt));
  }

  async getDocumentsByProject(projectId: number): Promise<Document[]> {
    return await this.db.select().from(documents)
      .where(eq(documents.projectId, projectId))
      .orderBy(desc(documents.createdAt));
  }

  async getRecentDocuments(limit: number = 4): Promise<Document[]> {
    return await this.db.select().from(documents)
      .orderBy(desc(documents.createdAt))
      .limit(limit);
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return await this.db.select().from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const result = await this.db.insert(documents).values(insertDocument).returning();
    return result[0];
  }

  async updateDocument(id: number, documentData: Partial<InsertDocument>): Promise<Document | undefined> {
    const result = await this.db.update(documents)
      .set({ ...documentData, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return result[0];
  }

  async updateDocumentAnalysis(id: number, analysis: any): Promise<Document | undefined> {
    const result = await this.db.update(documents)
      .set({ analysis, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return result[0];
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await this.db.delete(documents).where(eq(documents.id, id)).returning();
    return result.length > 0;
  }

  async getStats(): Promise<{ totalDocuments: number; activeProjects: number; documentsThisMonth: number; storage: string; }> {
    // Get total documents count
    const totalDocsResult = await this.db.select({ count: count() }).from(documents);
    const totalDocuments = totalDocsResult[0]?.count || 0;

    // Get active projects count
    const activeProjectsResult = await this.db.select({ count: count() }).from(projects)
      .where(eq(projects.status, 'active'));
    const activeProjects = activeProjectsResult[0]?.count || 0;

    // Get documents created this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const docsThisMonthResult = await this.db.select({ count: count() }).from(documents)
      .where(sql`${documents.createdAt} >= ${firstDayOfMonth}`);
    const documentsThisMonth = docsThisMonthResult[0]?.count || 0;

    // Get total storage size in bytes (sum of fileSize)
    const storageResult = await this.db.select({
      totalSize: sql<number>`sum(${documents.fileSize})`
    }).from(documents);
    const totalSizeInBytes = storageResult[0]?.totalSize || 0;

    return {
      totalDocuments,
      activeProjects,
      documentsThisMonth,
      storage: this.formatBytes(totalSizeInBytes)
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Initialize either MemStorage or PostgresStorage based on environment
// Using MemStorage for development/testing and PostgresStorage for production
export const storage = process.env.DATABASE_URL 
  ? new PostgresStorage() 
  : new MemStorage();
