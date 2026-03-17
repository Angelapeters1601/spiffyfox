import { Outlet } from "react-router-dom";
import AdminNav from "./nav/AdminNav";

const AdminLayout = () => {
  return (
    <div className="spiffy-bg min-h-screen">
      <AdminNav />

      {/* Main Content Area  */}
      <main className="pt-2">
        <div className="flex min-h-[calc(100vh-4rem)] items-start justify-center">
          <div className="w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Content Container */}
            <div className="rounded-3xl">
              <div className="p-6 lg:p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
