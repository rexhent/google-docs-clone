import "./Footer.css";
import PropTypes from "prop-types";

export default function Footer({ documentId }) {
  return (
    <div className="footer">
      <footer>
        <p>{documentId}</p>
        <p>&copy; {`GPLv3 rexhent ${new Date().getFullYear()}.`}</p>
      </footer>
    </div>
  );
}

Footer.propTypes = {
  documentId: PropTypes.string.isRequired,
};
