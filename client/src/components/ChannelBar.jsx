import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BsHash } from "react-icons/bs";
import { FaChevronDown, FaChevronRight, FaPlus } from "react-icons/fa";

const topics = ["tailwind-css", "react"];
const questions = ["jit-compilation", "purge-files", "dark-mode"];
const random = ["variants", "plugins"];

const ChannelBar = () => {
  const [documents, setDocuments] = useState("Loading...");
  const [socket, setSocket] = useState();
  const [topics, setTopics] = useState(["tailwind-css", "react"]);

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

  return (
    <div className="channel-bar shadow-lg">
      <ChannelBlock />
      <div className="channel-container">
        <Dropdown header="Documents" selections={documents} />
        {/* <Dropdown header="Questions" selections={questions} />
        <Dropdown header="Random" selections={random} /> */}
      </div>
    </div>
  );
};

const Dropdown = ({ header, selections }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="dropdown">
      <div onClick={() => setExpanded(!expanded)} className="dropdown-header">
        <ChevronIcon expanded={expanded} />
        <h5
          className={
            expanded ? "dropdown-header-text-selected" : "dropdown-header-text"
          }
        >
          {header}
        </h5>
        <FaPlus
          size="12"
          className="text-accent text-opacity-80 my-auto ml-auto"
        />
      </div>
      {expanded &&
        Array.isArray(selections) &&
        selections.map &&
        selections.map((selection) => (
          <DocumentSelection key={selection} selection={selection} />
        ))}
    </div>
  );
};

const ChevronIcon = ({ expanded }) => {
  const chevClass = "text-accent text-opacity-80 my-auto mr-1";
  return expanded ? (
    <FaChevronDown size="14" className={chevClass} />
  ) : (
    <FaChevronRight size="14" className={chevClass} />
  );
};

const DocumentSelection = ({ selection }) => (
  <div className="dropdown-selection">
    <BsHash size="24" className="text-gray-400" />
    <h5 className="dropdown-selection-text">
      <a href={selection}>{selection}</a>
    </h5>
  </div>
);

const ChannelBlock = () => (
  <div className="channel-block">
    <h5 className="channel-block-text">Channels</h5>
  </div>
);

export default ChannelBar;
