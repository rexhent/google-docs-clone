const { createDocumentSchema, pool } = require("./documentSchema.ts");
// import { createDocumentSchema, pool } from "./documentSchema";

const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
  },
});

console.log("This server is running pg");

const defaultValue: any = {};

io.on("connection", (socket: any) => {
  socket.on("document-select", async () => {
    const documents = await getAllDocuments();
    socket.emit("load-documents", documents);
  });

  socket.on("get-document", async (documentId: string) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta: any) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data: object) => {
      await updateDocument(documentId, data);
    });
  });
});

async function findOrCreateDocument(id: string) {
  if (id == null) return;

  const result = await pool.query("SELECT * FROM documents WHERE _id = $1", [
    id,
  ]);
  const document = result.rows[0];

  if (document) return document;

  await pool.query("INSERT INTO documents (_id, data) VALUES ($1, $2)", [
    id,
    defaultValue,
  ]);

  return { _id: id, data: defaultValue };
}

async function getAllDocuments() {
  const result = await pool.query("SELECT _id FROM documents");
  return result.rows;
}

async function updateDocument(id: string, data: object) {
  await pool.query("UPDATE documents SET data = $1 WHERE _id = $2", [data, id]);
}
