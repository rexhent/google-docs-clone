"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./page.css";
import Footer from "@/components/Footer";
import { v4 as uuidV4 } from "uuid";
import Image from "next/image";

export default function DocumentSelect() {
  const [documents, setDocuments] = useState("Loading...");
  const [socket, setSocket] = useState();
  const [docName, setDocName] = useState("");

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

  const handleInputChange = (e) => {
    setDocName(e.target.value);
  };

  return (
    <div>
      <div className="navbar">
        <h2>Select Existing Document</h2>
        <div className="form">
          <input
            value={docName}
            onChange={handleInputChange}
            id="input"
            type="text"
            placeholder="Enter document name"
          />
          <a href={docName == "" ? `/${uuidV4()}` : `/${docName}`}>
            <button>
              <Image
                src="/create.svg"
                width="24"
                height="24"
                alt="Create document button"
              />
            </button>
          </a>
        </div>
      </div>
      <div className="list">{listOfDocuments}</div>
      <Footer documentId="" document={false} />
    </div>
  );
}
