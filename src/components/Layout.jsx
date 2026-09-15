import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-white">
      Skip to content
    </a>
    <Navbar />
    <main id="main" className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
