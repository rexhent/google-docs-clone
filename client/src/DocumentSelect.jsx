import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./DocumentSelect.css";
import Footer from "./Footer";
import { v4 as uuidV4 } from "uuid";
import "./assets/create.svg";

export default function DocumentSelect() {
  const [documents, setDocuments] = useState("Loading...");
  const [socket, setSocket] = useState();
  const [docName, setDocName] = useState("");

  useEffect(() => {
    // const s = io(`http://170.64.216.101`);
    const s = io(`https://google-docs-clone-backend-r332h.ondigitalocean.app/`);
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
          <a
            href={
              docName == "" ? `/documents/${uuidV4()}` : `/documents/${docName}`
            }
          >
            <button>
              <img src="./assets/create.svg" />
            </button>
          </a>
        </div>
      </div>
      <div className="list">{listOfDocuments}</div>
      <Footer documentId="" document={false} />
    </div>
  );
}
