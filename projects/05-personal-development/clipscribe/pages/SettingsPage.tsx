
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import { testApiKey } from '../services/geminiService';

const SettingsPage: React.FC = () => {
  const { apiKey, setApiKey, showToast } = useAppContext();
  const [currentKey, setCurrentKey] = useState(apiKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleTestAndSave = async () => {
    if (!currentKey.trim()) {
      showToast('Please enter an API key to test.');
      return;
    }
    setIsTesting(true);
    try {
        const isValid = await testApiKey(currentKey);
        if (isValid) {
            setApiKey(currentKey);
            showToast('API Key is valid and has been saved!');
            navigate(from, { replace: true });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred."
        showToast(`Test Failed: ${errorMessage}`);
    } finally {
        setIsTesting(false);
    }
  };

  const handleClear = () => {
    setCurrentKey('');
    setApiKey(null);
    showToast('API Key cleared.');
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
          Google Gemini API Key
        </label>
        <input
          type="password"
          id="apiKey"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          placeholder="Enter your API key"
        />
        <p className="text-xs text-gray-500 mt-2">
          Your API key is stored securely in your browser's local storage and is never sent to our servers.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
            <Button onClick={handleClear} variant="secondary" className="py-2">
                Clear Key
            </Button>
            <Button onClick={() => navigate(from, { replace: true })} variant="secondary" className="py-2">
                Cancel
            </Button>
            <Button onClick={handleTestAndSave} className="col-span-2 py-2" disabled={isTesting || !currentKey}>
                {isTesting ? 'Testing...' : 'Test & Save Key'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;