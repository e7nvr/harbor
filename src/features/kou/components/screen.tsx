"use client";

import {cn} from "@/lib/utils";
import React, {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import {
    CameraIcon,
    FlipHorizontal,
    FlipHorizontalIcon, InfoIcon,
    MoonIcon,
    PersonStanding,
    SunIcon,
    VideoIcon,
    Volume2, XIcon
} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {ModeToggle} from "@/features/kou/components/ui/mode-toogle";
import { Rings } from 'react-loader-spinner';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Slider} from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';

import * as cocossd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import {DetectedObject, ObjectDetection} from "@tensorflow-models/coco-ssd";
import {toast} from "sonner";
import {beep} from "@/lib/beep";
import {drawOnCanvas} from "@/lib/draw-utils";
import { loadFFmpeg, convertToMp4 } from '@/lib/ffmpeg-utils';


type Pros = {}
let interval: any = null;
let stopTimeout: any = null;


const KouScreen = () => {

    const [model, setModel] = useState<ObjectDetection>();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const [volume, setVolume] = useState(0.5);
    const [autoRecordedEnabled, setAutoRecordedEnabled] = useState(false);
    const [mirrored, setMirrored] = useState(true);
    const [chatMessages, setChatMessages] = useState<Array<{
        type: 'alert' | 'info',
        content: string,
        videoUrl?: string,
        timestamp: Date
    }>>([]);
    const [lastAlert, setLastAlert] = useState<{
        content: string;
        videoUrl: string;
        timestamp: Date;
    } | null>(null);

    // state for the model
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

    const [showInfo, setShowInfo] = useState(false);


    /*****************************************************************
     *  User Effects and Handlers
     *****************************************************************/

    useEffect(() => {
        // check if webcam is available
        if (!webcamRef.current) return

        const stream = (webcamRef.current.video as any).captureStream();
        if (!stream) return;

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = async (event) => {
            if (event.data.size == 0) return;

            const webmBlob = new Blob([event.data], {type: 'video/webm'});

            if (ffmpegLoaded) {
                try {
                    const mp4Blob = await convertToMp4(webmBlob);
                    saveBlob(mp4Blob, 'mp4');
                } catch (error) {
                    console.error('Error converting to MP4:', error);
                    toast('Failed to convert video. Saving as WebM.');
                    saveBlob(webmBlob, 'webm');
                }
            } else {
                saveBlob(webmBlob, 'webm');
            }
        };

        // @ts-ignore
        mediaRecorderRef.current.onstart = (event) => {
            setIsRecording(true);
        }

        // @ts-ignore
        mediaRecorderRef.current.onstop = (event) => {
            setIsRecording(false);
        }

        return () => {
            console.log('disposing media recorder');
            mediaRecorderRef.current?.stop();
            mediaRecorderRef.current = null;
        }
    }, [webcamRef, ffmpegLoaded]);


    useEffect(() => {
        setLoading(true);
        initModel();
    }, []);


    useEffect(() => {
        if (model) {
            setLoading(false);
        }
    }, [model])


    useEffect(() => {
        interval = setInterval(async () => {
            runPrediction();
        }, 100);

        return () => clearInterval(interval);
    }, [webcamRef.current, model, mirrored, autoRecordedEnabled, runPrediction])


    /**
     * Prediction and Model Functions
     */


    // load the model
    async function initModel() {
        const loadModel: ObjectDetection = await cocossd.load({
            base: 'mobilenet_v2'
        });
        setModel(loadModel);
    }


    async function runPrediction() {
        if (
            !model
            || !webcamRef.current
            || !webcamRef.current.video
            || !(webcamRef.current.video.readyState === 4)
            || !canvasRef.current
        ) return;

        const predictions: DetectedObject[] = await model.detect(webcamRef.current.video);
        const canvasContext: CanvasRenderingContext2D | null = canvasRef.current.getContext('2d');
        if (!canvasContext) return;

        let video: HTMLVideoElement = webcamRef.current.video;

        resizeCanvas(video, canvasContext);
        drawOnCanvas(mirrored, predictions, canvasContext);

        let isPerson: boolean = false;
        if (predictions.length > 0) {
            predictions.forEach((prediction) => {
                if (prediction.class === 'person') {
                    isPerson = true;
                }
            });
            if (isPerson && autoRecordedEnabled) {
                startRecording(true);
            }
        }
    }

    function resizeCanvas(video: HTMLVideoElement, canvas: CanvasRenderingContext2D) {
        const {videoWidth, videoHeight} = video;
        canvas.canvas.width = videoWidth;
        canvas.canvas.height = videoHeight;
    }


    const toggleAutoRecord = () => {
        if (!autoRecordedEnabled) {
            toast('Auto rec enabled');
            setAutoRecordedEnabled(true);
        } else {
            setAutoRecordedEnabled(false);
            toast('Auto rec disabled');
        }
    }

    /*****************************************************************
     *  Handler Functions
     *****************************************************************/


    const userPromptScreenshot = () => {
        if (!webcamRef.current) {
            toast('Camera not found. Please refresh');
            return;
        }

        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
            toast('Failed to capture image. Please try again.');
            return;
        }

        // Create a canvas to convert the image to JPEG
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            // @ts-ignore
            ctx.drawImage(img, 0, 0);

            // Convert to JPEG
            canvas.toBlob((blob) => {
                if (!blob) {
                    toast('Failed to convert image. Please try again.');
                    return;
                }

                // Create and click download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `alarm-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Clean up
                URL.revokeObjectURL(url);
            }, 'image/jpeg', 0.9); // 0.9 is the JPEG quality (0-1)
        };
        img.src = imageSrc;
    }

    const userPromptVideo = () => {
        if (!webcamRef.current) {
            toast('Camera not found. Please refresh');
            return;
        }

        // If rec is in progress, stop it and save the video
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.requestData();
            clearTimeout(stopTimeout);
            mediaRecorderRef.current.stop();
            toast('Recording saved successfully');

        } else {
            // Start rec
            startRecording();
            toast('Recording started');
        }
    }

    // @ts-ignore
    let recordedChunks = [];


    const startRecording = (doBeep: boolean = false) => {

        if (webcamRef.current && mediaRecorderRef.current?.state !== 'recording') {
            mediaRecorderRef.current?.start();
            if (doBeep) {
                // @ts-ignore
                beep(volume);
            }
            stopTimeout = setTimeout(() => {
                if (mediaRecorderRef.current?.state === 'recording') {
                    mediaRecorderRef.current.requestData();
                    mediaRecorderRef.current?.stop();
                }
            }, 5000);
        }
    }

    const saveBlob = (blob: Blob, extension: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `alarm-${Date.now()}.${extension}`;
        a.click();

        const now = new Date();
        const newAlert = {
            content: `🚨 ¡Alerta! Se ha detectado una persona a las ${format(now, 'HH:mm:ss')}. Video grabado automáticamente.`,
            videoUrl: url,
            timestamp: now
        };
        setLastAlert(newAlert);
        // @ts-ignore
        setChatMessages(prev => [newAlert, ...prev]);
    };

    useEffect(() => {
        async function initFFmpeg() {
            try {
                await loadFFmpeg();
                setFfmpegLoaded(true);
            } catch (error) {
                console.error('Failed to load FFmpeg:', error);
            }
        }

        initFFmpeg();
    }, []);

    const SocialMediaLinks = () => {
        return (
            <div className='flex flex-col gap-4'>
                <a href="/labs/detection-playground" target="_blank" rel="noopener noreferrer">
                    🕵️ Playground de Detección: Juega a ser detective con personas, manos, caras y poses.
                </a>
                <a href="/labs/alarm-zone" target="_blank" rel="noopener noreferrer">
                    🚨 Zona de Alarma: ¡No te salgas del cuadro o sufrirás las consecuencias sonoras!
                </a>
                <a href="/labs/zone-alarm" target="_blank" rel="noopener noreferrer">
                    🎨🔔 Lienzo de Alarmas: Pinta zonas, detecta gente 🖌️🚶‍♀️
                </a>

                {/* 
                <a href="/labs/dance-challenge" target="_blank" rel="noopener noreferrer">
                    💃 Reto de Baile: ¿Puedes engañar al detector de movimiento con tus pasos prohibidos?
                </a>
                <a href="/labs/emoji-mirror" target="_blank" rel="noopener noreferrer">
                    🤪 Espejo Emoji: Convierte tu cara en el emoji que representa tu estado de ánimo actual.
                </a>
                <a href="/labs/invisibility-cloak" target="_blank" rel="noopener noreferrer">
                    🧙‍♂️ Capa de Invisibilidad: Desaparece mágicamente de la cámara (o al menos inténtalo).
                </a>
                <a href="/labs/ai-director" target="_blank" rel="noopener noreferrer">
                    🎬 Director IA: Deja que la inteligencia artificial dirija tu próxima obra maestra cinematográfica.
                </a>
                */}
            </div>
        );
    };

    // inner components
    function RenderFeatureHighlightsSection() {
        return <div className="text-xs text-muted-foreground">
            <ul className="space-y-4">
                <li>
                    <strong>Voltear la camara ↔️</strong>
                    <p>Ajustar la orientacion de la camara.</p>
                    <Button className='h-6 w-6 my-2'
                            variant={'outline'} size={'icon'}
                            onClick={() => {
                                setMirrored((prev) => !prev)
                            }}
                    ><FlipHorizontal size={14}/></Button>
                </li>
                <Separator/>
                <li>
                    <strong>Tomar Foto 📸</strong>
                    <p>Capture instantaneas en cualquier momento desde la camara.</p>
                    <Button
                        className='h-6 w-6 my-2'
                        variant={'outline'} size={'icon'}
                        onClick={userPromptScreenshot}
                    >
                        <CameraIcon size={14}/>
                    </Button>
                </li>
                <li>
                    <strong>Grabacion de clip 📽️</strong>
                    <p>Grabacion un clip de la camara.</p>
                    <Button className='h-6 w-6 my-2'
                            variant={isRecording ? 'destructive' : 'outline'} size={'icon'}
                            onClick={userPromptVideo}
                    >
                        <VideoIcon size={14}/>
                    </Button>
                </li>
                <Separator/>
                <li>
                    <strong>Prender/Apagar la Alarma 🚫</strong>
                    <p>
                        Presione para prender/apagar la alarma automatica con grabacion automatica.
                    </p>
                    <Button className='h-6 w-6 my-2'
                            variant={autoRecordedEnabled ? 'destructive' : 'outline'}
                            size={'icon'}
                            onClick={toggleAutoRecord}
                    >
                        {autoRecordedEnabled ? <Rings color='white' height={30}/> : <PersonStanding size={14}/>}

                    </Button>
                </li>

                <li>
                    <strong>Control del Volumen 🔊</strong>
                    <p>Ajusta el volumen de las notificaciones.</p>
                </li>
                <Separator/>
                <li className="space-y-4">
                    <strong>¡Gabriel explora más diversión! 🎉</strong>
                    <SocialMediaLinks />
                    <br />
                </li>
            </ul>
        </div>
    }

    const RenderChatSection = () => {

        return (
            <ScrollArea className="h-full pr-4">
            <ul className="space-y-4">
                <Separator/>
                {chatMessages.length > 0 && (
                    <li>
                        <strong>Feed de Alertas 🎨</strong>
                        <p>
                            Highlights in {" "}
                            <span style={{color: "#FF0F0F"}}>red</span> and other objects in{" "}
                            <span style={{color: "#00B612"}}>green</span>.
                        </p>
                    </li>
                )}
                <Separator/>
                    <div className="flex flex-col gap-4">
                        {chatMessages.map((message, index) => (
                            <div key={index}
                                 className={`p-4 rounded-lg ${message.type === 'alert' ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                                <p className="mb-2 font-medium">{message.content}</p>
                                {message.videoUrl && (
                                    <video src={message.videoUrl} autoPlay loop muted
                                           className="w-full rounded-md"/>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    {format(message.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                                </p>
                            </div>
                        ))}
                        <Separator/>
                        <RenderFeatureHighlightsSection/>
                    </div>
                <Separator/>
            </ul>
            </ScrollArea>
        )};

        return (


            <div className={cn("relative flex h-screen")}>

                {lastAlert && (
                    <div className={cn(
                        "absolute top-4 left-4 w-64 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg",
                        "overflow-hidden transition-all duration-300 ease-in-out"
                    )}>
                        <div className="relative">
                            <video
                                src={lastAlert.videoUrl}
                                autoPlay
                                loop
                                muted
                                className="w-full h-36 object-cover"
                            />
                            <button
                                onClick={() => setLastAlert(null)}
                                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors"
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                        <div className="p-3">
                            <p className="text-sm font-medium">{lastAlert.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {format(lastAlert.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                            </p>
                        </div>
                    </div>
                )}

                {/* left division - container for webcam and canvas */}
                <div className={cn("relative")}>
                    <div className={cn("relative h-screen w-full")}>

                        <Webcam
                            ref={webcamRef}
                            mirrored={mirrored}
                            className={cn("", "h-full w-full object-contain p-2")}>
                        </Webcam>
                        <video
                            autoPlay={true}
                            muted={true}
                            playsInline={true}
                            className={cn("hidden bg-gray-500 ",
                                "h-full w-full ", "",
                                "object-contain p-2",
                                "")}>
                        </video>

                        <canvas
                            ref={canvasRef}
                            className={cn("bg-black/0",
                                "absolute ",
                                "top-0 left-0 h-full w-full ",
                                "object-contain",
                                ""
                            )}>
                        </canvas>

                    </div>
                </div>


                {/* right division */}
                {/* container for detection toolbox and action chat section */}
                <div className={cn("flex flex-row flex-1")}>

                    {/* detection toolbox */}
                    <div className={cn("border-primary/5 border-2 shadow-md rounded-md",
                        " flex flex-col gap-2 justify-between ",
                        "max-w-xs p-4")}>

                        {/* top section */}
                        <div className={cn("flex flex-col gap-2")}>
                            <Button variant="outline"
                                    size={"icon"} onClick={() => {
                                setMirrored((prev) => !prev);
                            }}>
                                <FlipHorizontalIcon/>
                            </Button>
                            <Separator className={"my-2"}/>
                        </div>

                        {/* middle section */}
                        <div className={cn("flex flex-col gap-2")}>
                            <Separator className={"my-2"}/>
                            <Button variant="outline"
                                    size={"icon"}
                                    onClick={userPromptScreenshot}>
                                <CameraIcon/>
                            </Button>
                            {/* Video Icon Button */}
                            <Button variant={isRecording ? 'destructive' : 'outline'}
                                    size={"icon"}
                                    onClick={userPromptVideo}>
                                <VideoIcon/>
                            </Button>
                            <Separator className={"my-2"}/>
                            <Button variant={autoRecordedEnabled ? 'destructive' : 'outline'}
                                    size={'icon'}
                                    onClick={toggleAutoRecord}>
                                {autoRecordedEnabled ? <Rings color={"white"} height={24} width={45}/> :
                                    <PersonStanding/>}
                            </Button>
                        </div>

                        {/* bottom section */}
                        <div className={cn("flex flex-col gap-2")}>
                            <Separator className={"my-2"}/>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} size={"icon"}
                                            onClick={() => {
                                            }}>
                                        <Volume2/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.2}
                                        defaultValue={[volume]}
                                        onValueCommit={([value]) => {
                                            setVolume(value);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>


                    {/* action chat section */}
                    <div className={cn("h-full flex-1 py-4 px-2")}>
                        <RenderChatSection/>
                    </div>

                </div>

                {/* Flotante con información de Kou */}
                <div className={cn(
                    "absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg",
                    "transition-opacity duration-300 max-w-md",
                    showInfo ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                    <h2 className="text-xl font-bold mb-2">🦉 Kou: Tu Vigilante Inteligente</h2>
                    <p className="mb-2">Detección automática y grabación inteligente 🎥🧠</p>
                    <p>
                        Con Kou, puedes:
                    </p>
                    <ul className="list-disc list-inside mt-2">
                        <li>Detectar personas automáticamente 🕵️‍♀️👀</li>
                        <li>Grabar clips cuando se detecta movimiento 📹🎬</li>
                        <li>Tomar fotos instantáneas 📸✨</li>
                        <li>Ajustar la sensibilidad de las alertas 🔧🚨</li>
                        <li>Recibir notificaciones en tiempo real 📱🔔</li>
                    </ul>
                    <p className="mt-2">
                        ¡Deja que Kou cuide tu espacio mientras tú te relajas! 🛋️😎
                    </p>
                </div>

                {/* Botón de información */}
                <Button
                    className="absolute top-4 right-4"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowInfo(!showInfo)}
                >
                    <InfoIcon />
                </Button>

            </div>
        );
}

export {KouScreen};