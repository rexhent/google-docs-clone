import "./Footer.css";

export default function Footer(documentId) {
  return (
    <div className="footer">
      <footer>
        <p>{documentId}</p>
        <p>{`&copy GPLv3 rexhent ${new Date().getFullYear()}.`}</p>
      </footer>
    </div>
  );
}
