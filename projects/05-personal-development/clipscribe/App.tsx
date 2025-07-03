
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import ReportPage from './pages/ReportPage';
import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
  const { apiKey } = useAppContext();

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/report/:id" element={apiKey || window.location.hash.includes('/report/example') ? <ReportPage /> : <Navigate to="/settings" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;