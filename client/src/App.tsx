import { RouterProvider } from "react-router-dom";
import { Router } from "./router/Router";
import {ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
    <RouterProvider router={Router} />;
    <ToastContainer position="top-center" autoClose={3000}/>
    </>
  )
}
export default App;