import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const WebcamToMp4Converter: React.FC = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [recording, setRecording] = useState<boolean>(false);
    const [videoSrc, setVideoSrc] = useState<string>('');
    const ffmpegRef = useRef<FFmpeg>(new FFmpeg());
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const messageRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        load();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const load = async (): Promise<void> => {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        const ffmpeg = ffmpegRef.current;
        ffmpeg.on('log', ({ message }: { message: string }) => {
            if (messageRef.current) {
                messageRef.current.innerHTML = message;
            }
            console.log(message);
        });
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        setLoaded(true);
    };

    const startRecording = async (): Promise<void> => {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = streamRef.current;
            }
            mediaRecorderRef.current = new MediaRecorder(streamRef.current);

            const chunks: Blob[] = [];
            mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => chunks.push(e.data);
            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                await convertToMp4(blob);
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const stopRecording = (): void => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            setRecording(false);
        }
    };

    const convertToMp4 = async (webmBlob: Blob): Promise<void> => {
        const ffmpeg = ffmpegRef.current;
        const inputFileName = 'input.webm';
        const outputFileName = 'output.mp4';

        await ffmpeg.writeFile(inputFileName, await fetchFile(webmBlob));
        await ffmpeg.exec(['-i', inputFileName, outputFileName]);
        const data = await ffmpeg.readFile(outputFileName);
        // @ts-ignore
        const mp4Url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setVideoSrc(mp4Url);
    };

    if (!loaded) return <div>Loading FFmpeg...</div>;

    return (
        <div>
            <video ref={videoRef} width={640} height={480} autoPlay muted />
            <br />
            {!recording ? (
                <button onClick={startRecording}>Start Recording</button>
            ) : (
                <button onClick={stopRecording}>Stop Recording</button>
            )}
            <p ref={messageRef}></p>
            {videoSrc && (
                <div>
                    <h3>Converted MP4 Video:</h3>
                    <video src={videoSrc} controls width={640} height={480} />
                </div>
            )}
        </div>
    );
};

export default WebcamToMp4Converter;