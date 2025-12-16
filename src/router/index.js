import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  ...rootRoutes,
  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
