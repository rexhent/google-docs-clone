import TextEditor from "./TextEditor";
import DocumentSelect from "./DocumentSelect";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

export default function App() {
  // const [dark, setDark] = useState(false);

  // useEffect(() => {
  //   if (
  //     window.matchMedia &&
  //     window.matchMedia("(prefers-color-scheme: dark)").matches
  //   ) {
  //     setDark(true);
  //   }

  //   window
  //     .matchMedia("(prefers-color-scheme: dark)")
  //     .addEventListener("change", (event) => {
  //       const newColorScheme = event.matches ? "dark" : "light";
  //       setDark(newColorScheme == dark);
  //     });
  // }, [dark]);

  return (
    <>
      {/* {dark ? (
        <link rel="icon" type="image/svg+xml" href="/description_white.svg" />
      ) : (
        <link rel="icon" type="image/svg+xml" href="/description_black.svg" />
      )} */}
      <Router>
        <Routes>
          <Route path="/:id" element={<TextEditor />} />
          <Route path="/" element={<DocumentSelect />} />
        </Routes>
      </Router>
    </>
  );
}
