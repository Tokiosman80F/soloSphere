import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Main = () => {
  return (
    <div className="container mx-auto px-10 pt-3 ">
      <Navbar></Navbar>
      <div className="min-h-[calc(100vh-4rem-1rem)]">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Main;
