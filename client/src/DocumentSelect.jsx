import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./DocumentSelect.css";
import Footer from "./Footer";

export default function DocumentSelect() {
  const [documents, setDocuments] = useState("Loading...");
  const [socket, setSocket] = useState();

  useEffect(() => {
    const s = io(`http://170.64.188.137:3001`);
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
          <a key={id} href={`/documents/${id}`}>
            <button key={id}> {id}</button>
          </a>
        ));

  const [docName, setDocName] = useState("");

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
          <a href={docName == "" ? "/new/" : `/documents/${docName}`}>
            <button>
              <img src="../create.svg" />
            </button>
          </a>
        </div>
      </div>
      <div className="list">{listOfDocuments}</div>
      <Footer documentId="" document={false} />
    </div>
  );
}
