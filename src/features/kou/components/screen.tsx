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



const KouScreen = () => {

    const [model, setModel] = useState<ObjectDetection>();
    const [loading, setLoading] = useState(false);

    const canvasRef = useRef();
    const webcamRef = useRef();
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
            // download the image with timestamp
            a.download = `screenshot-${Date.now()}.png`;
        }
    }

    const userPromptVideo = () => {
        // start recording
        if (!webcamRef.current) {
            toast('Camera not found. Please refresh');
        } else {
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.start();
                setIsRecording(true);
            } else {
                toast('MediaRecorder not found. Please refresh');
            }
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
                            autoPlay=""
                            muted=""
                            playsInline=""
                            className={cn("hidden bg-gray-500 ",
                                "h-full w-full ", "",
                                "object-contain p-2",
                                "")}>
                        </video>

                        <canvas
                            ref={canvasRef}
                            className={cn("bg-black/70",
                                "absolute ",
                                "top-0 left-0 h-full w-full ",
                                "object-contain",
                                ""
                            )}>
                        </canvas>

                    </div>
                </div>


            {/* right division - container for detection toolbox and action chat section */}
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