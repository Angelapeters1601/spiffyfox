import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <div className="spiffy-bg flex min-h-screen flex-col">
      <Nav />

      <main className="container mx-auto flex-grow px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
