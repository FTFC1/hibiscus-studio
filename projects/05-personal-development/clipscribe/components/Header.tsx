
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SettingsIcon, ChevronLeftIcon } from './Icons';

const Header: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            { !isHomePage ? (
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    <ChevronLeftIcon className="w-6 h-6" />
                </Link>
            ) : <div className="w-6"/>}
            <h1 className="text-xl font-bold text-white">ClipScribe</h1>
          </div>
          <nav className="flex items-center space-x-2">
            <Link to="/" className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800">
                <HomeIcon className="w-6 h-6" />
            </Link>
            <Link to="/settings" className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-800">
                <SettingsIcon className="w-6 h-6" />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;