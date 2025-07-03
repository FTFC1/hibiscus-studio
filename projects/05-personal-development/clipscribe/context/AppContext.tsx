
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { ReportData, UploadedFile } from '../types';
import Toast from '../components/Toast';

interface AppContextType {
  apiKey: string | null;
  setApiKey: (key: string | null) => void;
  reports: ReportData[];
  addReport: (report: ReportData) => void;
  getReport: (id: string) => ReportData | undefined;
  showToast: (message: string) => void;
  pendingFileForAnalysis: File | null;
  setPendingFileForAnalysis: (file: File | null) => void;
  uploadPromise: Promise<UploadedFile> | null;
  setUploadPromise: (promise: Promise<UploadedFile> | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(() => localStorage.getItem('gemini_api_key'));
  const [reports, setReports] = useState<ReportData[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingFileForAnalysis, setPendingFileForAnalysis] = useState<File | null>(null);
  const [uploadPromise, setUploadPromise] = useState<Promise<UploadedFile> | null>(null);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }, [apiKey]);

  const setApiKey = (key: string | null) => {
    setApiKeyState(key);
  };

  const addReport = (report: ReportData) => {
    setReports(prev => [...prev, report]);
  };

  const getReport = (id: string) => {
    return reports.find(r => r.id === id);
  };

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const value = { apiKey, setApiKey, reports, addReport, getReport, showToast, pendingFileForAnalysis, setPendingFileForAnalysis, uploadPromise, setUploadPromise };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toastMessage && <Toast message={toastMessage} />}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
