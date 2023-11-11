import TextEditor from "./TextEditor";
import DocumentSelect from "./DocumentSelect";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/documents/:id" element={<TextEditor />} />
        <Route path="/" element={<DocumentSelect />} />
      </Routes>
    </Router>
  );
}
