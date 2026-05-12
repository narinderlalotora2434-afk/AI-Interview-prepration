import { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { useInterviewStore } from '@/store/useInterviewStore';

export const WebcamAI = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { updateRealtimeFeedback, features } = useInterviewStore();
  const detectorRef = useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);

  useEffect(() => {
    const initDetector = async () => {
      await tf.setBackend('webgl');
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig = {
        runtime: 'tfjs' as const,
        refineLandmarks: true,
      };
      detectorRef.current = await faceLandmarksDetection.createDetector(model, detectorConfig);
    };

    const startVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    if (features.webcam) {
      initDetector();
      startVideo();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [features.webcam]);

  useEffect(() => {
    let animationId: number;

    const detect = async () => {
      if (
        videoRef.current && 
        videoRef.current.readyState === 4 && 
        detectorRef.current
      ) {
        const faces = await detectorRef.current.estimateFaces(videoRef.current);
        
        if (faces.length > 0) {
          const face = faces[0] as any;
          
          // Eye Contact Detection (Simple heuristic: look for iris position relative to eye corners)
          const leftEye = face.keypoints.filter((k: any) => k.name === 'leftEye');
          const rightEye = face.keypoints.filter((k: any) => k.name === 'rightEye');
          
          // Simplified Eye Contact logic
          const hasEyeContact = faces.length === 1; // Placeholder for more complex gaze tracking
          
          // Emotion/Confidence heuristic (placeholder)
          const confidence = 75 + (Math.random() * 20); // Random for demo, but can be based on head stability
          
          updateRealtimeFeedback({
            confidence: Math.round(confidence),
            emotion: 'Confident'
          });
        }
      }
      animationId = requestAnimationFrame(detect);
    };

    if (features.webcam) {
      detect();
    }

    return () => cancelAnimationFrame(animationId);
  }, [features.webcam, updateRealtimeFeedback]);

  if (!features.webcam) return null;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black border border-white/10">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-full h-full object-cover mirror"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        <div className="px-3 py-1 rounded-lg bg-emerald-500/80 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
           AI Processing Active
        </div>
      </div>
    </div>
  );
};
