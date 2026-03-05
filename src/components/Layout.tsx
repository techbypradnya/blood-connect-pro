import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow animate-fade-in">{children}</main>
    <Footer />
  </div>
);

export default Layout;
