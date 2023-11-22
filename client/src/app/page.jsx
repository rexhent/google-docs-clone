"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./page.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function DocumentSelect() {
  const [documents, setDocuments] = useState("Loading...");
  const [socket, setSocket] = useState();

  useEffect(() => {
    const s = io(`https://google-docs-clone-69nb.onrender.com`);
    // const s = io(`https://ec2.rexhent.xyz/`);
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null) return;

    socket.once("load-documents", (documents) => {
      const ids = documents.map((doc) => doc._id);
      setDocuments(ids);
    });

    socket.emit("document-select");
  }, [documents, socket]);

  const listOfDocuments =
    documents === "Loading..."
      ? documents
      : documents.map((id) => (
          <a key={id} href={`/${id}`}>
            <button key={id}> {id}</button>
          </a>
        ));

  return (
    <div>
      <Header document={false} />
      <div className="list">{listOfDocuments}</div>
      <Footer documentId="" document={false} />
    </div>
  );
}
