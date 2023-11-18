// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Access-Control-Allow-Origin"],
    credentials: true,
  },
});

console.log("This server is running Prisma");

const defaultValue = {};

io.on("connection", (socket) => {
  socket.on("document-select", async () => {
    const documents = await getAllDocuments();
    socket.emit("load-documents", documents);
  });

  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data);
    });
  });
});

async function findOrCreateDocument(id) {
  if (!id) return;

  let document = await prisma.documents.findUnique({
    where: {
      _id: id,
    },
  });

  if (!document) {
    document = await prisma.documents.create({
      data: {
        _id: id,
        data: defaultValue,
      },
    });
  }

  return document;
}

async function getAllDocuments() {
  const documents = await prisma.documents.findMany({
    select: {
      _id: true,
    },
  });
  return documents;
}

async function updateDocument(id, data) {
  await prisma.documents.update({
    where: {
      _id: id,
    },
    data: {
      data: data,
    },
  });
}
