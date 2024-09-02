"use client";


import {cn} from "@/lib/utils";
import {useRef, useState} from "react";
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


type Pros = {}
let stopTimeout: any = null;

const KouScreen = () => {

    const [model, setModel] = useState<ObjectDetection>();
    const [loading, setLoading] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const webcamRef = useRef<Webcam>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const [autoRecordedEnabled, setAutoRecordedEnabled] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    const [mirrored, setMirrored] = useState(true);
    const [volume, setVolume] = useState(0.5);

    async function loadModel() {
        // 'lite_mobilenet_v2' | 'mobilenet_v2'
        const loadModel: ObjectDetection = await cocossd.load({
            base: 'mobilenet_v2'
        });
        setModel(loadModel);
    }

    const toggleAutoRecord = () => {
        setAutoRecordedEnabled(!autoRecordedEnabled);
    }

    /*****************************************************************
     *  Handler Functions
     *****************************************************************/


    const userPromptScreenshot = () => {
        // take a picture
        if (!webcamRef.current) {
            toast('Camera not found. Please refresh');
        } else {
            const imageSrc = webcamRef.current.getScreenshot();
            const blob =  base64toBlob(imageSrc);

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href= url;
            a.download = `alarm-${Date.now()}.png`;
            a.click();
        }
    }

    const userPromptVideo = () => {

        if (!webcamRef.current) {
            toast('Camera not found. Please refresh');
        }

        // start recording
        if (mediaRecorderRef.current?.state == 'recording') {
            // check if recording is already in progress
            // then stop recording
            // and save the video and download it

            mediaRecorderRef.current.requestData();
            clearTimeout(stopTimeout);
            mediaRecorderRef.current.stop();
            toast('Recording saved successfully');
        }

        // if not recording
        // then start recording
        // const stream = webcamRef.current.video.srcObject as MediaStream;
        // const mediaRecorder = new MediaRecorder(stream);
        // mediaRecorderRef.current = mediaRecorder;
        startRecording(true);
        toast('Recording started');
    }


    function startRecording(doBeep: boolean) {

        if (webcamRef.current && mediaRecorderRef.current?.state !== 'recording') {
            // const stream = webcamRef.current.video.srcObject as MediaStream;
            // const mediaRecorder = new MediaRecorder(stream);
            // mediaRecorderRef.current = mediaRecorder;
            mediaRecorderRef.current?.start();
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