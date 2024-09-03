"use client";

import {cn} from "@/lib/utils";
import {useEffect, useRef, useState} from "react";
import Webcam from "react-webcam";
import {CameraIcon, FlipHorizontalIcon, PersonStanding, VideoIcon, Volume2} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {ModeToggle} from "@/features/kou/components/ui/mode-toogle";
import { Rings } from 'react-loader-spinner';
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Slider} from "@/components/ui/slider";

import * as cocossd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import {DetectedObject, ObjectDetection} from "@tensorflow-models/coco-ssd";
import {toast} from "sonner";
import {webcam} from "@tensorflow/tfjs-data";
import {beep} from "@/lib/beep";
import {drawOnCanvas} from "@/lib/draw-utils";
import {convertToMp4AndDownload} from "@/lib/video-convert";


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

    // state for the model
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);


    /*****************************************************************
     *  User Effects and Handlers
     *****************************************************************/

    useEffect(() => {
        // check if webcam is available
        if (!webcamRef.current) return

        const stream = (webcamRef.current.video as any).captureStream();
        if (!stream) return;

        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size == 0) return;

            const blob = new Blob([event.data], {type: 'video'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `alarm-${Date.now()}.webm`;
            a.click();
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
    }, [webcamRef]);


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
        setAutoRecordedEnabled(!autoRecordedEnabled);
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

        // If recording is in progress, stop it and save the video
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.requestData();
            clearTimeout(stopTimeout);
            mediaRecorderRef.current.stop();

            // Convert to MP4 and download
            mediaRecorderRef.current.onstop = () => {
                // @ts-ignore
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                convertToMp4AndDownload(blob);
            };

            toast('Recording saved successfully');
        } else {
            // Start recording
            startRecording(true);
            toast('Recording started');
        }
    }

    // @ts-ignore
    let recordedChunks = [];


    const startRecording = (stream: any) => {
        let doBeep = true;
        recordedChunks = [];

        if (webcamRef.current && mediaRecorderRef.current?.state !== 'recording') {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            mediaRecorder.start();

            // const stream = webcamRef.current.video.srcObject as MediaStream;
            // const mediaRecorder = new MediaRecorder(stream);
            // mediaRecorderRef.current = mediaRecorder;

            // mediaRecorderRef.current?.start();
            doBeep && beep(volume);

            stopTimeout = setTimeout(() => {
                if (mediaRecorderRef.current?.state == 'recording') {
                    mediaRecorderRef.current.requestData();
                    mediaRecorderRef.current.stop();
                    toast('Recording saved successfully');
                }
            }, 30000);
        }
    }


    return (
        <div className={cn("flex h-screen")}>

                {/* left division - container for webcam and canvas */}
                <div className={cn("relative")}>
                    <div className={cn("relative h-screen w-full")}>

                        <Webcam
                            ref={webcamRef}
                            mirrored={mirrored}
                            className={cn("", "h-full w-full object-contain p-2" )}>
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
                <div className={cn("flex flex-row flex-1")} >

                    {/* detection toolbox */}
                    <div className={cn("border-primary/5 border-2 shadow-md rounded-md",
                        " flex flex-col gap-2 justify-between ",
                        "max-w-xs p-4")}>

                        {/* top section */}
                        <div className={cn("flex flex-col gap-2")}>
                            <ModeToggle />
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
                            <Button variant="outline"
                                    size={"icon"}
                                    onClick={userPromptVideo}>
                                <VideoIcon/>
                            </Button>
                            <Separator className={"my-2"}/>
                            <Button variant={autoRecordedEnabled ? 'destructive' : 'outline'}
                                    size={'icon'}
                                    onClick={toggleAutoRecord}>
                                {autoRecordedEnabled ? <Rings color={"white"} height={24} width={45}/> : <PersonStanding />}
                            </Button>
                        </div>

                        {/* bottom section */}
                        <div className={cn("flex flex-col gap-2")}>
                            <Separator className={"my-2"}/>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} size={"icon"}
                                            onClick={() => {}}>
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
                    <div className={cn("h-full flex-1 py-4 px-2 overflow-y-scroll")}>
                        [ action chat ]
                    </div>


                </div>

        </div>
    )
}

export { KouScreen };