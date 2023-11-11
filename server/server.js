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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Document_1 = __importDefault(require("./Document"));
mongoose.connect("mongodb://localhost/google-docs-clone", {});
const io = require("socket.io")(3001, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true,
    },
});
const defaultValue = "";
io.on("connection", (socket) => {
    socket.on("document-select", () => __awaiter(void 0, void 0, void 0, function* () {
        const documents = yield getAllDocuments();
        socket.emit("load-documents", documents);
    }));
    socket.on("get-document", (documentId) => __awaiter(void 0, void 0, void 0, function* () {
        const document = yield findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document === null || document === void 0 ? void 0 : document.data);
        socket.on("send-changes", (delta) => {
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });
        socket.on("save-document", (data) => __awaiter(void 0, void 0, void 0, function* () {
            yield Document_1.default.findByIdAndUpdate(documentId, { data });
        }));
    }));
});
function findOrCreateDocument(id) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id == null)
            return;
        const document = yield Document_1.default.findById(id);
        if (document)
            return document;
        return yield Document_1.default.create({ _id: id, data: defaultValue });
    });
}
function getAllDocuments() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Document_1.default.find({}, "_id");
    });
}
