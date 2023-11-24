"use client";
import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import "./TextEditor.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import ChannelBar from "@/components/ChannelBar";
import TopNavigation from "@/components/TopNavigation";
import ContentContainer from "@/components/ContentContainer";
import TextEditor from "@/components/TextEditor";

const SAVE_INTERVAL_MS = 2000;
const DEFAULT_TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const MOBILE_TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  ["image", "clean"],
];

export default function Document({ params }) {
  const documentId = params.id;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <div>
        {!isMobile ? (
          <>
            <SideBar />
            <TopNavigation params={documentId} />
          </>
        ) : (
          <Header document={true} />
        )}

        <div className="flex">
          {!isMobile && <ChannelBar />}
          <TextEditor params={documentId} />
        </div>
        <Footer documentId={documentId} document={true}></Footer>
      </div>
    </>
  );
}
