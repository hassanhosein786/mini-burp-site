import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { DashboardLayout } from "./layouts/DashboardLayout.jsx";
import { FindingDetailPage } from "./pages/FindingDetailPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { PagesPage } from "./pages/PagesPage.jsx";
import { ScanDetailPage } from "./pages/ScanDetailPage.jsx";
import { ScanProgressPage } from "./pages/ScanProgressPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "scans/:scanId/progress", element: <ScanProgressPage /> },
      { path: "scans/:scanId", element: <ScanDetailPage /> },
      { path: "scans/:scanId/pages", element: <PagesPage /> },
      { path: "scans/:scanId/findings/:findingId", element: <FindingDetailPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
