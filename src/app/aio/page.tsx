import {cn} from "@/lib/utils";
import ObjectDetectionScreen from "@/features/aio/components/ObjectDetection";
import React from "react";
import {metadata} from "@/app/layout";

// set the page title
metadata.title = "Panda Peach | Capricornio r1.0";

export default function AIODHome()  {
    return (
        <main className={cn(
            "relative h-full w-full items-center justify-start flex flex-col",
        )}>
            <div className={cn("w-full h-full overflow-hidden")}>
                <ObjectDetectionScreen/>
            </div>
            <div
                className={"absolute bottom-0 right-0 mr-16 mb-0 flex flex-col z-40 w-48 items-center justify-center  bg-amber-50/20 rounded-2xl"}>
                <img src={"/panda/peach/panda3.png"} alt={"panda"}/>
                <h2 className={"relative top-[-2.2rem] bg-gray-50/40 p-0 m-0 text-center w-full text-2xl line-clamp-2 font-black text-gray-900/70 justify-center content-center rounded-full"}>
                    Panda Peach
                </h2>
            </div>
        </main>
    )
}