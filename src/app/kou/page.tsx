"use client";

import {cn} from "@/lib/utils";
import React from "react";
import {KouScreen} from "@/features/kou/components/screen";


export default function Page() {
    return (
        <div className={cn("relative h-screen w-full")}>
            <KouScreen/>
            <div
                className={"absolute bottom-0 right-0 mr-16 mb-0 flex flex-col z-40 w-48 items-center justify-center  bg-amber-50/20 rounded-2xl"}>
                <a href={"/rec"}>
                    <img src={"/panda/panda4.png"} alt={"panda"}/>
                </a>
                <h2 className={"relative top-[-2.2rem] bg-white/90 p-0 m-0 text-center w-full text-2xl line-clamp-2 font-black text-gray-900/70 justify-center content-center rounded-full"}>
                    Panda Peach <span className={"bg-green-500/20 px-2 rounded-full"}>Jupiter</span>
                </h2>
            </div>
        </div>
    )
};
