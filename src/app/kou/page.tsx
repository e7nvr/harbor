"use client";

import {cn} from "@/lib/utils";
import React from "react";
import {KouScreen} from "@/features/kou/components/screen";


export default function Page() {
    return (
        <div className={cn("relative h-screen w-full")}>
            <KouScreen/>
        </div>
    )
};
