"use client";
import React from 'react';

const SettingsManagement = ({
  showHeader,
  setShowHeader,
  allowModelSearch,
  setAllowModelSearch,
  allowInstallationFailed,
  setAllowInstallationFailed,
  allowCompleteSetup,
  setAllowCompleteSetup,
  adminStatus,
}: any) => {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 md:p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <span className="text-2xl">⚙️</span>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900">Setup Flow Settings</h2>
          <p className="text-gray-500 font-medium">Configure visibility and behavior of the printer setup flow</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
          <div>
            <label htmlFor="toggle-header" className="text-lg font-bold text-gray-700">Show Setup Header</label>
            <p className="text-sm text-gray-500 font-medium">Toggle the setup flow header shown on setup pages only.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="toggle-header"
              type="checkbox"
              checked={!!showHeader}
              onChange={(e) => setShowHeader?.(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 relative after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
          <div>
            <label htmlFor="toggle-model-search" className="text-lg font-bold text-gray-700">Enable Model Search</label>
            <p className="text-sm text-gray-500 font-medium">Allow users to search for printer models</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="toggle-model-search"
              type="checkbox"
              checked={!!allowModelSearch}
              onChange={(e) => setAllowModelSearch?.(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 relative after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100">
          <div>
            <label htmlFor="toggle-complete-setup" className="text-lg font-bold text-gray-700">Show Completion Page</label>
            <p className="text-sm text-gray-500 font-medium">Activate the Complete Setup landing page</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="toggle-complete-setup"
              type="checkbox"
              checked={!!allowCompleteSetup}
              onChange={(e) => setAllowCompleteSetup?.(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 relative after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors border border-transparent hover:border-rose-200">
          <div>
            <label htmlFor="toggle-installation-failed" className="text-lg font-bold text-rose-700 select-none">Force Installation Failed</label>
            <p className="text-sm text-rose-600">Override entire flow and show error page</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              id="toggle-installation-failed"
              type="checkbox"
              checked={!!allowInstallationFailed}
              onChange={(e) => setAllowInstallationFailed?.(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-rose-600 peer-focus:ring-4 peer-focus:ring-rose-300 relative after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full"></div>
          </label>
        </div>
      </div>

      {adminStatus && (
        <div className="mt-10 p-4 rounded-xl text-center font-bold text-sm bg-green-100 text-green-700">
          {adminStatus}
        </div>
      )}
    </div>
  );
};

export default SettingsManagement;
