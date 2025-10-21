import { Outlet } from "react-router-dom";
import AdminNav from "./nav/AdminNav";

const AdminLayout = () => {
  return (
    <div className="spiffy-bg min-h-screen">
      <AdminNav />

      {/* Main Content Area */}
      <main className="pt-16 lg:ml-80">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
