import { Outlet } from "react-router-dom";
import AdminDashboardNav from "./nav/AdminDashboardNav";

const AdminLayout = () => {
  return (
    <div className="spiffy-bg min-h-screen">
      <AdminDashboardNav />

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
