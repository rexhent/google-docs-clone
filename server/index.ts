const mongoose = require("mongoose");
const DocumentSchema = require("./Document.ts");
const dotenv = require("dotenv").config();

class DocumentSocketServer {
  private io: Server;
  private defaultValue = "";

  constructor() {
    mongoose.connect(process.env.DB, {});
    this.io = require("socket.io")(3001, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true,
      },
    });
    this.initializeSocketEvents();
    console.log("This server is running");
  }

  private initializeSocketEvents(): void {
    this.io.on("connection", (socket: any) => {
      socket.on("document-select", async () => {
        const documents = await this.getAllDocuments();
        socket.emit("load-documents", documents);
      });

      socket.on("get-document", async (documentId: string) => {
        const document = await this.findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);

        socket.on("send-changes", (delta: Object) => {
          socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

        socket.on("save-document", async (data: Object) => {
          await DocumentSchema.findByIdAndUpdate(documentId, { data });
        });
      });
    });
  }

  private async findOrCreateDocument(id: string) {
    if (id == null) return;

    const document = await DocumentSchema.findById(id);
    if (document) return document;
    return await DocumentSchema.create({ _id: id, data: this.defaultValue });
  }

  private async getAllDocuments() {
    return await DocumentSchema.find({}, "_id");
  }
}
