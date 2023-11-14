"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const mongoose = require("mongoose");
const DocumentSchema = require("./Document.ts");
const dotenv = require("dotenv").config();
mongoose.connect(process.env.DB, {});
const io = require("socket.io")(3001, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true,
    },
});
console.log("This server is running");
const defaultValue = "";
io.on("connection", (socket) => {
    socket.on("document-select", () => __awaiter(void 0, void 0, void 0, function* () {
        const documents = yield getAllDocuments();
        socket.emit("load-documents", documents);
    }));
    socket.on("get-document", (documentId) => __awaiter(void 0, void 0, void 0, function* () {
        const document = yield findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);
        socket.on("send-changes", (delta) => {
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });
        socket.on("save-document", (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield DocumentSchema.findByIdAndUpdate(documentId, { data });
        }));
    }));
});
function findOrCreateDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id == null)
            return;
        const document = yield DocumentSchema.findById(id);
        if (document)
            return document;
        return yield DocumentSchema.create({ _id: id, data: defaultValue });
    });
}
function getAllDocuments() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield DocumentSchema.find({}, "_id");
    });
}
