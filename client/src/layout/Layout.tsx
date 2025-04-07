import { Outlet } from "react-router-dom";
import Sidebar from "../pages/LeftSideBar";
import UserList from "../pages/RightSideBar";
import { useState } from "react";
import { Menu, X, Users } from "lucide-react";

const Layout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleUserList = () => setShowUserList(!showUserList);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background relative">
      {/* Mobile header with toggle buttons */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white border-b sticky top-0 z-10">
        <button onClick={toggleSidebar} className="p-1">
          {showSidebar ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h2 className="text-xl font-bold text-primary">SocialConnect</h2>
        <button onClick={toggleUserList} className="p-1">
          <Users size={24} />
        </button>
      </div>

      {/* Left sidebar - responsive */}
      <div className={`
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        fixed md:static top-0 left-0 h-full z-20
        w-64 bg-white border-r transition-transform duration-300 ease-in-out
        md:block
      `}>
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto mt-0 md:mt-0">
        <Outlet />
      </main>

      {/* Right sidebar - responsive */}
      <div className={`
        ${showUserList ? 'translate-x-0' : 'translate-x-full'} 
        md:translate-x-0
        fixed md:static top-0 right-0 h-full z-20
        w-64 bg-white border-l transition-transform duration-300 ease-in-out
        md:block
      `}>
        <UserList />
      </div>

      {/* Backdrop for mobile when sidebar/userlist is open */}
      {(showSidebar || showUserList) && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => {
            setShowSidebar(false);
            setShowUserList(false);
          }}
        />
      )}
    </div>
  );
};

export default Layout;