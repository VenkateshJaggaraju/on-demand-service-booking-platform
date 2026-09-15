import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { PageNotFoundException } from "./exceptions/PageNotFoundException";
import { HomePage } from "./HomePage";
import { Services } from "./services/Services";
import {AdminLogin} from "./logins/admin/AdminLogin";
import { CustomerLogin } from "./logins/customer/CustomerLogin";
import { CustomerRegister } from "./logins/customer/CustomerRegister";

  
const router=createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <PageNotFoundException />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
    errorElement: <PageNotFoundException />,
  },
  {
    path:"/services",
    element:<Services/>,
  },
  {
    path: "/customer/login",
    element: <CustomerLogin />,
  },

  {
    path: "/customer/register",
    element: <CustomerRegister />,
  },

]);

function App() {
  

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
