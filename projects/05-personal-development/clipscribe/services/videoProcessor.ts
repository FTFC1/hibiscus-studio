import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

declare global {
  interface Window {
    ffmpeg: FFmpeg | null;
  }
}

window.ffmpeg = window.ffmpeg || null;
let ffmpegLoadingPromise: Promise<void> | null = null;

export const loadFfmpeg = (): Promise<void> => {
  if (window.ffmpeg && window.ffmpeg.loaded) {
    console.log("✅ FFmpeg already loaded and ready.");
    return Promise.resolve();
  }

  if (ffmpegLoadingPromise) {
    console.log("⏳ FFmpeg is already loading. Returning existing promise.");
    return ffmpegLoadingPromise;
  }
  
  console.log("🚀 Starting FFmpeg loading process...");
  ffmpegLoadingPromise = (async () => {
    try {
      window.ffmpeg = new FFmpeg();
      console.log("📦 Created new FFmpeg instance");
      
      // Add FFmpeg.wasm logging
      window.ffmpeg.on('log', ({ message }) => {
        console.log(`🔧 FFmpeg.wasm: ${message}`);
      });

      // Use local files (network-independent)
      console.log("🌐 Loading FFmpeg from local files...");
      const coreURL = await toBlobURL('/ffmpeg/ffmpeg-core.js', 'text/javascript');
      const wasmURL = await toBlobURL('/ffmpeg/ffmpeg-core.wasm', 'application/wasm');
      console.log("📦 Local FFmpeg files converted to blob URLs");
      
      const loadPromise = window.ffmpeg.load({
        coreURL: coreURL,
        wasmURL: wasmURL,
      });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("FFmpeg loading timeout after 30 seconds")), 30000)
      );
      
      await Promise.race([loadPromise, timeoutPromise]);
      
      if (!window.ffmpeg.loaded) {
        throw new Error("FFmpeg failed to load completely");
      }
      
      console.log("✅ FFmpeg loaded successfully and is ready!");
    } catch (error) {
      console.error("❌ FFmpeg loading failed:", error);
      window.ffmpeg = null;
      ffmpegLoadingPromise = null;
      throw error;
    }
  })();

  return ffmpegLoadingPromise;
};

export const compressVideo = async (videoFile: File, onProgress: (progress: number) => void): Promise<Blob> => {
  if (!window.ffmpeg || !window.ffmpeg.loaded) {
    throw new Error("FFmpeg is not loaded. Call `await loadFfmpeg()` first.");
  }

  const inputFileName = 'input.mp4';
  const outputFileName = 'output.mp4';

  window.ffmpeg.on('progress', ({ progress }) => {
    onProgress(progress * 100);
  });

  await window.ffmpeg.writeFile(inputFileName, new Uint8Array(await videoFile.arrayBuffer()));

  // -c:v libx264: Use the x264 codec for video.
  // -crf 28: Constant Rate Factor. Higher values mean more compression (lower quality). 28 is a good balance.
  // -preset ultrafast: A preset for encoding speed. 'ultrafast' is the fastest.
  // -c:a copy: Copy the audio stream without re-encoding.
  await window.ffmpeg.exec(['-i', inputFileName, '-c:v', 'libx264', '-crf', '28', '-preset', 'ultrafast', '-c:a', 'copy', outputFileName]);

  const data = await window.ffmpeg.readFile(outputFileName);

  await window.ffmpeg.deleteFile(inputFileName);
  await window.ffmpeg.deleteFile(outputFileName);

  return new Blob([data], { type: 'video/mp4' });
};