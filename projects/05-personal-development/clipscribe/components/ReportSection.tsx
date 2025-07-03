import React from 'react';
import { CopyIcon } from './Icons';

interface ReportSectionProps {
  title: string;
  onCopy: () => void;
  children: React.ReactNode;
  titleAccessory?: React.ReactNode;
}

const ReportSection: React.FC<ReportSectionProps> = ({ title, onCopy, children, titleAccessory }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center">
            <h2 className="text-lg font-semibold text-white tracking-wider uppercase">{title}</h2>
            {titleAccessory}
        </div>
        <button onClick={onCopy} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
          <CopyIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 md:p-6 text-gray-300 prose prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
};

export default ReportSection;