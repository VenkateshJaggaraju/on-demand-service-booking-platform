import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { PageNotFoundException } from "./exceptions/PageNotFoundException";
import { HomePage } from "./HomePage";
import { Services } from "./services/Services";
import { AdminLogin } from "./logins/admin/AdminLogin";
import { CustomerLogin } from "./logins/customer/CustomerLogin";
import { CustomerRegister } from "./logins/customer/CustomerRegister";
import { PrivateRoute } from "./utils/PrivateRoute";
import { ServiceProviderRegister } from "./logins/service_provider/ServiceProviderRegister";
import { ServiceProviderLogin } from "./logins/service_provider/ServiceProviderLogin";
import { ProvideServices } from "./services/ProvideServices";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <PageNotFoundException />,
  },

  {
    path: "/admin",
    children: [
      {
        path: "login",
        element: <AdminLogin />,
      },
    ],
  },

  {
    path: "/customer",
    children: [
      {
        path: "login",
        element: <CustomerLogin />,
      },
      {
        path: "register",
        element: <CustomerRegister />,
      },
    ],
  },

  {
    path: "/service-provider",
    children: [
      {
        path: "login",
        element: <ServiceProviderLogin />,
      },
      {
        path: "register",
        element: <ServiceProviderRegister />,
      },
      {
        path: "provide-services",
        element: (
          <PrivateRoute role="SERVICEPROVIDER">
            <ProvideServices />
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "/services",
    element: (
      <PrivateRoute role="CUSTOMER">
        <Services />
      </PrivateRoute>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
