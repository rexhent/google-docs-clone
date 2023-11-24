import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import Image from "next/image";
import styles from "./Header.module.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Header({ document }) {
  const [docName, setDocName] = useState("");

  const handleInputChange = (e) => {
    setDocName(e.target.value);
  };
  return (
    <div className={styles.navbar}>
      {document && (
        <>
          <a href="/" className={styles.a}>
            <button className={styles.homeButton}>Home</button>
          </a>
        </>
      )}
      <h2>Documents</h2>
      {!document && (
        <div className={styles.form}>
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
      )}
    </div>
  );
}
