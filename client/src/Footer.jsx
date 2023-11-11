import "./Footer.css";
import PropTypes from "prop-types";

export default function Footer({ documentId, document }) {
  return (
    <div className="footer">
      <footer>
        {document && (
          <>
            ZZ
            <a href="/">
              <button>Home</button>
            </a>
            <p>{documentId}</p>
          </>
        )}
        <p>
          <a
            href="http://github.com/rexhent/google-docs-clone"
            target="_blank"
            rel="noreferrer"
          >
            &copy; {`GPLv3 rexhent ${new Date().getFullYear()}.`}
          </a>
        </p>
      </footer>
    </div>
  );
}

Footer.propTypes = {
  documentId: PropTypes.string.isRequired,
  document: PropTypes.bool.isRequired,
};
