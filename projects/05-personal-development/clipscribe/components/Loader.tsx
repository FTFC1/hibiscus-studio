
import React from 'react';
import Button from './Button';

interface LoaderProps {
  text: string;
  elapsedTime?: number; // Time in seconds
  stages?: string[];
  currentStageIndex?: number;
  onCancel?: () => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toFixed(0).padStart(2, '0');
    return `${mins}:${secs}`;
}

const Loader: React.FC<LoaderProps> = ({ text, elapsedTime, stages, currentStageIndex = 0, onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 w-full max-w-md mx-auto">
      <div className="text-center">
        <p className="text-xl text-gray-200">{text}</p>
        {elapsedTime !== undefined && (
            <p className="text-5xl text-gray-400 font-mono mt-2 tracking-wider">{formatTime(elapsedTime)}</p>
        )}
      </div>

      {stages && stages.length > 0 && (
        <div className="w-full pt-4">
            <div className="grid w-full mb-2 text-center" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`}}>
                {stages.map((stage, index) => (
                    <div key={stage} className={`text-xs font-medium ${index <= currentStageIndex ? 'text-indigo-400' : 'text-gray-500'}`}>
                        {stage}
                    </div>
                ))}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
                <div 
                    className="bg-indigo-500 h-2 rounded-full absolute top-0 left-0 transition-all duration-500 ease-out progress-bar-indeterminate" 
                    style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}>
                </div>
            </div>
        </div>
      )}

      {onCancel && (
        <div className="pt-4">
            <Button onClick={onCancel} variant="secondary">Cancel</Button>
        </div>
      )}
    </div>
  );
};

export default Loader;