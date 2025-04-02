import React from "react";
import { Home, User, Users, LogOut, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useAuth";
import { toast } from "react-toastify";

const LeftSideBar= () => {
  const navigate = useNavigate();
  const {logout} = useLogout();

  const isAuthenticated = localStorage.getItem("token") ? true : false;
  
  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  }
  const handleLogin = () => {
    navigate("/signin");
  }
  return (
    <div className="w-64 bg-white border-r h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-primary">SocialConnect</h2>

      <nav className="space-y-4">
        <SidebarItem icon={<Home />} label="Home" to="/" />
        <SidebarItem icon={<User />} label="My Profile" to="/myprofile" />
        <SidebarItem icon={<Users />} label="Followers" to="/followers" />
        <SidebarItem icon={<Users />} label="Following" to="/following" />
        {isAuthenticated ? (
          <button
          onClick={handleLogout}
          className="flex items-center space-x-3 p-2 rounded-md cursor-pointer 
            hover:bg-gray-100 text-red-500 mt-auto w-full"
        >
          <LogOut />
          <span className="font-medium">Logout</span>
        </button>
        ): (
          <button
          onClick={handleLogin}
          className="flex items-center space-x-3 p-2 rounded-md cursor-pointer 
            hover:bg-gray-100 text-red-500 mt-auto w-full"
        >
          <LogIn />
          <span className="font-medium">Login</span>
        </button>
        )}
      </nav>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  to: string;
}

const SidebarItem = ({ icon, label, to, className = "" }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className={`
      flex items-center space-x-3 p-2 rounded-md cursor-pointer 
      hover:bg-gray-100 ${className}
    `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default LeftSideBar;
