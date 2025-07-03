
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { startBackgroundUpload, finishAnalysis } from '../services/geminiService';
import { ReportData, UploadedFile } from '../types';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { MAX_FILE_SIZE_BYTES, MAX_VIDEO_DURATION_SECONDS, COST_PER_MINUTE_VIDEO, GEMINI_MODEL } from '../constants';
import { VideoRecorderIcon, UploadIcon, DocumentIcon, SettingsIcon, WalletIcon } from '../components/Icons';
import { loadFfmpeg, compressVideo } from '../services/videoProcessor';

interface ConfirmationDetails {
    file: File;
    duration: number;
    estimatedCost: number;
}

const ANALYSIS_STAGES = ['Compressing', 'Uploading', 'Processing', 'Analyzing', 'Finalizing'];

const HomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);
  const [isFfmpegLoading, setIsFfmpegLoading] = useState(true);
  const [ffmpegError, setFfmpegError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { apiKey, showToast, addReport, pendingFileForAnalysis, setPendingFileForAnalysis, uploadPromise, setUploadPromise } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const elapsedTimeRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  // Load FFmpeg when the component mounts
  useEffect(() => {
    const load = async () => {
      console.log("Attempting to load FFmpeg...");
      try {
        await loadFfmpeg();
        setIsFfmpegLoading(false);
        console.log("FFmpeg loaded successfully.");
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during FFmpeg loading.';
        console.error("Failed to load FFmpeg:", e);
        setFfmpegError(`Failed to load video processing tools: ${errorMessage}. Please refresh the page.`);
        showToast("Failed to load video processing tools.");
        setIsFfmpegLoading(false); // Still set to false to stop loading indicator
      }
    };
    load();
  }, []);
  
  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    elapsedTimeRef.current = 0;
    setElapsedTime(0);
    stopTimer(); // Ensure no multiple timers
    timerRef.current = window.setInterval(() => {
      elapsedTimeRef.current += 1;
      setElapsedTime(elapsedTimeRef.current);
    }, 1000);
  }, [stopTimer]);

  const handleProceedFromPending = useCallback(async (file: File, promise: Promise<UploadedFile>) => {
    if (!apiKey) {
      showToast('API key is missing.');
      return;
    }
    setIsLoading(true);
    startTimer();

    const progressCallback = (status: string, stageIndex: number) => {
        setLoadingText(status);
        setCurrentStageIndex(stageIndex);
    };

    try {
        const analysisResult = await finishAnalysis(apiKey, promise, progressCallback);
        const analysisDurationSeconds = elapsedTimeRef.current;
        stopTimer();

        const report: ReportData = {
            id: new Date().toISOString(),
            videoFileName: file.name,
            analysisDurationSeconds,
            ...analysisResult,
            suggestedTitle: analysisResult.suggestedTitle || file.name,
        };

        addReport(report);
        navigate(`/report/${report.id}`);
    } catch (error) {
        stopTimer();
        console.error('Processing failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        showToast(`Error: ${errorMessage}`);
        setIsLoading(false);
        setUploadPromise(null);
    }
  }, [apiKey, startTimer, stopTimer, addReport, navigate, setUploadPromise, showToast]);

  useEffect(() => {
    // This effect handles returning from the settings page with a file waiting
    if (pendingFileForAnalysis && apiKey) {
        const file = pendingFileForAnalysis;
        setPendingFileForAnalysis(null); // Clear it to prevent re-triggering

        // If an upload was already in progress, use it. Otherwise, start a new one.
        const promiseToUse = uploadPromise || startBackgroundUpload(apiKey, file);
        if (!uploadPromise) {
            setUploadPromise(promiseToUse);
        }
        
        // Proceed directly to analysis, skipping confirmation
        handleProceedFromPending(file, promiseToUse);
    }
  }, [apiKey, pendingFileForAnalysis, setPendingFileForAnalysis, handleProceedFromPending, uploadPromise, setUploadPromise, showToast]);


  useEffect(() => {
      // Cleanup timer on unmount
      return () => stopTimer();
  }, [stopTimer]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = async (file: File) => {
     if (isFfmpegLoading || ffmpegError) {
        showToast("Video processing tools are not ready. Please wait or refresh.");
        return;
    }

     if (!file.type.startsWith('video/')) {
        showToast('Invalid file type. Please upload a video file.');
        return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        showToast(`File is too large. Max size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`);
        return;
    }
    
    await prepareForAnalysis(file);
  };
  
  const prepareForAnalysis = async (file: File) => {
    setIsLoading(true);
    setLoadingText('Validating video...');
    try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            setIsLoading(false);
            if (video.duration > MAX_VIDEO_DURATION_SECONDS) {
                showToast(`Video is too long. Max duration is ${MAX_VIDEO_DURATION_SECONDS / 60} minutes.`);
                return;
            }
            const estimatedCost = (video.duration / 60) * COST_PER_MINUTE_VIDEO;
            setConfirmationDetails({ file, duration: video.duration, estimatedCost });
        };

        video.onerror = () => {
             showToast('Could not read video file.');
             setIsLoading(false);
        }
    } catch (error) {
      console.error('Validation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      showToast(`Error: ${errorMessage}`);
      setIsLoading(false);
    }
  };

  const handleConfirmAnalysis = async () => {
    if (!confirmationDetails) return;
    const { file } = confirmationDetails;

    if (!apiKey) {
      showToast('Please set your API key in Settings first.');
      setPendingFileForAnalysis(file); // Persist the file for the return trip
      navigate('/settings', { state: { from: location.pathname } });
      return;
    }
    
    setIsLoading(true);
    startTimer();
    setLoadingText('Compressing video...');
    setCurrentStageIndex(0);

    let compressedFile: File;
    try {
        const compressedBlob = await compressVideo(file, (progress) => {
            setLoadingText(`Compressing video... ${progress.toFixed(0)}%`);
        });
        compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
    } catch (e) {
        stopTimer();
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during compression.';
        console.error("Video compression failed:", e);
        showToast(`Video compression failed: ${errorMessage}`);
        setIsLoading(false);
        return;
    }

    // If upload was started in background, the promise will be in context.
    // If not, it means something went wrong, so we try to start it now.
    let promiseToUse = uploadPromise;
    if (!promiseToUse) {
        try {
            promiseToUse = startBackgroundUpload(apiKey, compressedFile);
            setUploadPromise(promiseToUse);
        } catch (e) {
             showToast('Failed to start upload. Check API key or network.');
             return;
        }
    }
    
    setConfirmationDetails(null);
    handleProceedFromPending(compressedFile, promiseToUse);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileSelection(droppedFiles[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleCancel = () => {
    stopTimer();
    setIsLoading(false);
    setLoadingText('');
    setConfirmationDetails(null);
    setPendingFileForAnalysis(null);
    setUploadPromise(null);
    showToast('Analysis cancelled.');
  };

  if (isLoading && !confirmationDetails) {
    return <Loader text={loadingText} elapsedTime={elapsedTime} stages={ANALYSIS_STAGES} currentStageIndex={currentStageIndex} onCancel={handleCancel} />;
  }

  if (confirmationDetails) {
    return (
        <div className="flex flex-col items-center justify-center text-center w-full h-full py-8 px-4">
            <div className="w-full max-w-md mx-auto bg-gray-800/60 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-3">Confirm Analysis</h2>
                <p className="text-gray-400 mb-6 break-words">Ready to analyze <span className="font-semibold text-gray-200">{confirmationDetails.file.name}</span>?</p>
                
                <div className="text-left bg-gray-900/50 border border-gray-700 rounded-lg p-4 space-y-3 mb-8">
                    <div className="flex justify-between items-center text-gray-300">
                        <span>Duration:</span>
                        <span className="font-mono text-white">{confirmationDetails.duration.toFixed(1)}s</span>
                    </div>
                     <div className="flex justify-between items-center text-gray-300 border-t border-gray-700 pt-3 mt-3">
                        <span className="flex items-center gap-2"><WalletIcon className="w-5 h-5"/> Est. Cost:</span>
                        <span className="font-mono text-white">${confirmationDetails.estimatedCost.toFixed(4)}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => setConfirmationDetails(null)} variant="secondary" className="w-full py-3">
                        Cancel
                    </Button>
                     <Button onClick={handleConfirmAnalysis} variant="primary" className="w-full py-3">
                        Proceed with Analysis
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">Estimate based on video duration for the {GEMINI_MODEL} model (${COST_PER_MINUTE_VIDEO.toFixed(3)}/min). Actual cost may vary.</p>
            </div>
        </div>
    );
  }

  return (
    <div 
        className="w-full h-full flex flex-col justify-center items-center p-4"
        onDragOver={handleDragEvents}
        onDrop={handleDrop}
    >
        <div className="w-full max-w-4xl">
            <div className="text-center mb-12">
                <div className="bg-gray-800 p-4 rounded-full inline-block mb-4">
                    <VideoRecorderIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Screen Recording Analyzer
                </h1>
                <p className="text-md md:text-lg text-gray-400">
                    AI-powered analysis with structured reports
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Step 1: API Key */}
                <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8">
                    <div className="flex items-center mb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${apiKey ? 'bg-green-500' : 'bg-gray-600'}`}>
                            <span className="text-white font-bold">1</span>
                        </div>
                        <h2 className="text-xl font-semibold text-white">Configure API Key</h2>
                    </div>
                    <p className="text-gray-400 mb-4">
                        An API key is required for analysis. Your key is stored securely in your browser's local storage.
                    </p>
                    <Button onClick={() => navigate('/settings')} variant="secondary">
                        <SettingsIcon className="w-5 h-5 mr-2" />
                        {apiKey ? 'Update API Key' : 'Set API Key'}
                    </Button>
                </div>

                {/* Step 2: Analyze Recording */}
                <div 
                    className={`bg-gray-800/60 border border-gray-700 rounded-2xl p-8 ${!apiKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onDragOver={apiKey ? handleDragEvents : undefined}
                    onDrop={apiKey ? handleDrop : undefined}
                >
                    <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-4">
                            <span className="text-white font-bold">2</span>
                        </div>
                        <h2 className="text-xl font-semibold text-white">Analyze Recording</h2>
                    </div>
                    <p className="text-gray-400 mb-4">
                        Upload a video file to get a detailed analysis, including transcription, key points, and more.
                    </p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="video/*"
                        disabled={!apiKey}
                    />
                    <Button onClick={handleUploadClick} variant="primary" disabled={!apiKey || isFfmpegLoading || !!ffmpegError}>
                        <UploadIcon className="w-5 h-5 mr-2" />
                        Upload and Analyze
                    </Button>
                    {isFfmpegLoading && <p className="text-xs text-yellow-400/80 text-center">Initializing video processing tools...</p>}
                    {ffmpegError && <p className="text-xs text-red-400/80 text-center">Error: {ffmpegError}</p>}
                </div>
            </div>
            
            <div className="text-center mt-12">
                <Button onClick={() => navigate(`/report/example`)} variant="ghost" className="text-gray-400 hover:text-white">
                    <DocumentIcon className="w-5 h-5 mr-2" />
                    View Sample Report
                </Button>
            </div>
        </div>
    </div>
  );
};

export default HomePage;