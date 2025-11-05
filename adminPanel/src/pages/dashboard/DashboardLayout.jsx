import React, { useState } from "react";

import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Welcome back 👋</h2>
          <div className="flex items-center gap-3">
            <img
              src="https://ui-avatars.com/api/?name=Sachin+Singh"
              alt="User"
              className="w-9 h-9 rounded-full border border-gray-300"
            />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default DashboardLayout;
