
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

function PublicLayout() {
  return (
    <div className="public-layout">
      <Navbar />

      <main className="public-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;
