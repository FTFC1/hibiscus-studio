
import React, { useState, useRef, useEffect } from 'react';
import { ReportData } from '../types';
import { copyToClipboard, getMarkdownContent } from '../utils';
import { CopyIcon, ChevronDownIcon } from './Icons';
import Button from './Button';

interface CopyDropdownProps {
  report: ReportData;
  showToast: (message: string) => void;
}

const CopyDropdown: React.FC<CopyDropdownProps> = ({ report, showToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCopy = (content: string, close = true) => {
    copyToClipboard(content, showToast);
    if (close) {
      setIsOpen(false);
    }
  };

  const copyItems = [
    { label: 'Copy Full Report', action: () => handleCopy(getMarkdownContent(report)) },
    { isDivider: true },
    { label: 'Copy TL;DR', action: () => handleCopy(report.tldr) },
    { label: 'Copy Key Points', action: () => handleCopy(report.keyPoints.map(p => `- ${p}`).join('\n')) },
    { label: 'Copy Feedback', action: () => handleCopy(report.feedbackAndRequirements.map(p => `- ${p}`).join('\n')) },
    { label: 'Copy Scene Breakdown', action: () => handleCopy(report.sceneBreakdown.map(s => `${s.timestamp.toFixed(1)}s: ${s.description}`).join('\n')) },
    { label: 'Copy Audio Transcript', action: () => handleCopy(report.audioTranscript) },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button onClick={() => setIsOpen(!isOpen)} variant="secondary" className="p-2 flex items-center">
        <CopyIcon className="w-5 h-5 mr-2" />
        Copy
        <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
          <ul className="py-1">
            {copyItems.map((item, index) => (
              item.isDivider ? (
                <li key={index} className="border-t border-gray-700 my-1"></li>
              ) : (
                <li key={index}>
                  <button
                    onClick={item.action}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CopyDropdown;
