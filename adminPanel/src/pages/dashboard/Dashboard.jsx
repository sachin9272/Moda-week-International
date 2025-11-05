import React from "react";
import DashboardLayout from "./DashboardLayout";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h1>
      <p className="text-gray-600">
        Here you can see your recent activities and analytics.
      </p>
    </DashboardLayout>
  );
};

export default DashboardPage;