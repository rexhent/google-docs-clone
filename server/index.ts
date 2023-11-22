import { Pool, QueryResult } from "pg";
import { Server, Socket } from "socket.io";

const dotenv = require("dotenv").config();

interface Document {
  _id: string;
  data: any;
}

class DocumentSocketServer {
  private pool: Pool;
  private io: Server;
  private defaultValue: any = {};

  constructor(port: number) {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    });

    this.io = require("socket.io")(port, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true,
      },
    });

    this.initializeSocketEvents();
    console.log("This server is running pg");
  }

  private initializeSocketEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("connected")
      socket.on("document-select", async () => {
        const documents = await this.getAllDocuments();
        socket.emit("load-documents", documents);
      });

      socket.on("get-document", async (documentId: string) => {
        const document = await this.findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);

        socket.on("send-changes", (delta: any) => {
          socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

        socket.on("save-document", async (data: any) => {
          await this.updateDocument(documentId, data);
        });
      });
    });
  }

  private async findOrCreateDocument(id: string): Promise<Document> {
    if (id == null) throw new Error("Invalid document ID");

    const result: QueryResult = await this.pool.query(
      "SELECT * FROM documents WHERE _id = $1",
      [id]
    );
    const document: Document = result.rows[0];

    if (document) return document;

    await this.pool.query("INSERT INTO documents (_id, data) VALUES ($1, $2)", [
      id,
      this.defaultValue,
    ]);

    return { _id: id, data: this.defaultValue };
  }

  private async getAllDocuments(): Promise<Document[]> {
    const result: QueryResult = await this.pool.query(
      "SELECT _id FROM documents"
    );
    return result.rows;
  }

  private async updateDocument(id: string, data: any): Promise<void> {
    await this.pool.query("UPDATE documents SET data = $1 WHERE _id = $2", [
      data,
      id,
    ]);
  }
}

const documentSocketServer = new DocumentSocketServer(3001);
