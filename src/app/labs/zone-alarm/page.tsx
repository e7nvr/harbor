"use client";

import React from "react";
import {cn} from "@/lib/utils";
import {ZoneAlarmScreen} from "@/features/zone-alarm";



export default function Page() {
    return (
        <div className={cn("relative h-screen w-full")}>
            <ZoneAlarmScreen/>
        </div>
    )
};
