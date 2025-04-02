import { Outlet } from "react-router-dom";
import Sidebar from "../pages/LeftSideBar";
import UserList from "../pages/RightSideBar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* This will render child routes */}
      </main>
      <UserList />
    </div>
  );
};

export default Layout;
