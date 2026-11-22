
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div>
          <h3>WardWatch</h3>
          <p>
            A public grievance management platform
            for better and more responsive local governance.
          </p>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} WardWatch.
            All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
