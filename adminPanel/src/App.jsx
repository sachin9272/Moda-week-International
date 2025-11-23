import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardPage from "./pages/dashboard/Dashboard";
import News from "./pages/dashboard/newsSection/News";
import AddNews from "./pages/dashboard/newsSection/AddNews";
import EditNews from "./pages/dashboard/newsSection/EditNews";
import NewsDetail from "./pages/dashboard/newsSection/NewsDetail";
import AdminDashboard from "./pages/dashboard/applicationSection/Application";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            <DashboardLayout />
            // </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="news" element={<News />}></Route>
          <Route path="/dashboard/news/:id" element={<NewsDetail />} />
          <Route path="/dashboard/news-edit/:id" element={<EditNews />} />
          <Route path="news-add" element={<AddNews />} />
          <Route path="applications" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
