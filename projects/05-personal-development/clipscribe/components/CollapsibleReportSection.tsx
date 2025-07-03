import React, { useState } from 'react';
import { CopyIcon, ChevronDownIcon } from './Icons';

interface CollapsibleReportSectionProps {
  title: string;
  onCopy: () => void;
  children: React.ReactNode;
  titleAccessory?: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleReportSection: React.FC<CollapsibleReportSectionProps> = ({ title, onCopy, children, titleAccessory, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center grow text-left gap-4">
            <h2 className="text-lg font-semibold text-white tracking-wider uppercase">{title}</h2>
            {titleAccessory}
        </button>
        <div className="flex items-center">
            <button onClick={onCopy} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors" aria-label={`Copy ${title}`}>
              <CopyIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors" aria-label={isOpen ? 'Collapse section' : 'Expand section'}>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
      </div>
      {isOpen && (
        <div className="p-4 md:p-6 text-gray-300 prose prose-invert max-w-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleReportSection;
