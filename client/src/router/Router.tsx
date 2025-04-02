import { createBrowserRouter } from "react-router-dom";
import SignUp from "../auth/Signup";
import Layout from "../layout/Layout";
import Home from "../pages/Home";
import Signin from "../auth/Signin";
import MyProfile from "../profile/MyProfile";
import ProtectiveRoute from "../auth/ProtectiveRoute";
import UserProfile from "../profile/UserProfile";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectiveRoute>
            <Home />
          </ProtectiveRoute>
        ),
      },
      {
        path: "/myprofile",
        element: (
          <ProtectiveRoute>
            <MyProfile />
          </ProtectiveRoute>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectiveRoute>
            <UserProfile />
          </ProtectiveRoute>
        ),
      },
    ],
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "signin",
    element: <Signin />,
  },
]);
