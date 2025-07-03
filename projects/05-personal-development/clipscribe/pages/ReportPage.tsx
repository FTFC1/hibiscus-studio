
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ReportData, Scene } from '../types';
import { copyToClipboard } from '../utils';
import { getExampleReport, createChatSession } from '../services/geminiService';
import Loader from '../components/Loader';
import { ChatIcon, ChevronDownIcon, CopyIcon } from '../components/Icons';
import ReportSection from '../components/ReportSection';
import CollapsibleReportSection from '../components/CollapsibleReportSection';
import ChatModal from '../components/ChatModal';
import { Chat } from '@google/genai';
import CopyDropdown from '../components/CopyDropdown';

const SceneAccordionItem: React.FC<{ scene: Scene, isOpen: boolean, onToggle: () => void }> = ({ scene, isOpen, onToggle }) => {
    return (
        <div className="border-b border-gray-700/50">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-700/30 transition-colors"
            >
                <div className="flex gap-4 items-center">
                    <span className="font-mono text-sm bg-gray-700 text-indigo-300 rounded px-2 py-1">{scene.timestamp.toFixed(1)}s</span>
                    <p className="font-semibold text-gray-200">{scene.description.split('.')[0]}</p>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-900/40">
                    <p className="text-gray-300">{scene.description}</p>
                </div>
            )}
        </div>
    );
};


const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReport, showToast, apiKey } = useAppContext();
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [openSceneIndex, setOpenSceneIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    let currentReport: ReportData | undefined;
    if (id === 'example') {
      currentReport = getExampleReport();
    } else {
      currentReport = getReport(id);
    }

    if (currentReport) {
      setReport(currentReport);
      if (apiKey) {
        const chat = createChatSession(apiKey, currentReport);
        setChatInstance(chat);
      }
    } else {
      showToast('Report not found.');
      navigate('/');
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, getReport, showToast, apiKey]);

  if (isLoading) {
    return <Loader text="Loading report..." />;
  }

  if (!report) {
    return <div className="text-center">Report not found.</div>;
  }

  const audioTranscriptWordCount = report.audioTranscript.split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{report.suggestedTitle}</h1>
            <p className="text-sm text-gray-500 mt-1 break-all">Original file: {report.videoFileName}</p>
            <p className="text-sm text-gray-500 mt-1">Analysis took {report.analysisDurationSeconds.toFixed(1)} seconds</p>
        </div>
        <div className="flex-shrink-0 self-start sm:self-center">
            <CopyDropdown report={report} showToast={showToast} />
        </div>
      </div>
      
      <div className="space-y-6">
        <ReportSection title="TL;DR" onCopy={() => copyToClipboard(report.tldr, showToast)}>
          <p>{report.tldr}</p>
        </ReportSection>

        <ReportSection title="Key Points" onCopy={() => copyToClipboard(report.keyPoints.join('\n'), showToast)}>
          <ul className="list-disc space-y-2 pl-5">
            {report.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
          </ul>
        </ReportSection>

        {report.feedbackAndRequirements && report.feedbackAndRequirements.length > 0 && (
             <ReportSection title="Feedback & Requirements" onCopy={() => copyToClipboard(report.feedbackAndRequirements.join('\n'), showToast)}>
                <ul className="list-disc space-y-2 pl-5">
                    {report.feedbackAndRequirements.map((point, index) => <li key={index}>{point}</li>)}
                </ul>
            </ReportSection>
        )}

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white tracking-wider uppercase">Scene Breakdown</h2>
                <button onClick={() => copyToClipboard(report.sceneBreakdown.map(s => `${s.timestamp.toFixed(1)}s: ${s.description}`).join('\n'), showToast)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors" aria-label="Copy Scene Breakdown">
                    <CopyIcon className="w-5 h-5" />
                </button>
            </div>
             <div className="text-gray-300">
                {report.sceneBreakdown.map((scene: Scene, index: number) => (
                    <SceneAccordionItem 
                        key={index}
                        scene={scene}
                        isOpen={openSceneIndex === index}
                        onToggle={() => setOpenSceneIndex(openSceneIndex === index ? null : index)}
                    />
                ))}
            </div>
        </div>
        
        <CollapsibleReportSection 
            title="Audio Transcript"
            onCopy={() => copyToClipboard(report.audioTranscript, showToast)}
            titleAccessory={
                <span className="ml-3 text-sm font-medium text-gray-400 bg-gray-700/50 px-2 py-1 rounded-md">
                    {audioTranscriptWordCount} words
                </span>
            }
        >
          <p className="whitespace-pre-wrap">{report.audioTranscript || "No audio detected."}</p>
        </CollapsibleReportSection>
      </div>

      {apiKey && (
        <>
            <button
                onClick={() => setIsChatOpen(true)}
                className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform hover:scale-110"
                aria-label="Open chat"
                title="Chat with AI about this report"
            >
                <ChatIcon className="w-8 h-8" />
            </button>
            <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} chatInstance={chatInstance} />
        </>
      )}
    </div>
  );
};

export default ReportPage;