import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";
import authRoutes from "./routes/authRoutes";
import mainRoutes from "./routes/mainRoutes";

const router = createBrowserRouter([
  ...mainRoutes,
  ...authRoutes,
  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
