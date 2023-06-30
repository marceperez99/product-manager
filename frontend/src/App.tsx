import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import { AuthProvider } from "./hooks/useAuthentication";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import NewProduct from "./pages/new-product";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SignUpSuccess from "./pages/signup-success";
import { SnackbarProvider } from "notistack";
import EditProduct from "./pages/edit-product";

const routes = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/signup-success", element: <SignUpSuccess /> },
  { path: "/product/new", element: <NewProduct /> },
  { path: "/product/:id", element: <EditProduct /> },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <SnackbarProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={routes} />
        </AuthProvider>
      </QueryClientProvider>
    </SnackbarProvider>
  );
}

export default App;
