import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./DocumentSelect.css";

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
          <a key={id} href={`/documents/:${id}`}>
            {id}
          </a>
        ));

  return (
    <div>
      <navbar>
        <h2>Select Existing Document</h2>
        <a href="/new/">
          <button>
            <img src="../create.svg" />
          </button>
        </a>
      </navbar>
      <div className="list">{listOfDocuments}</div>
    </div>
  );
}
