"use client";

import React from "react";
import {cn} from "@/lib/utils";
import {ZoneAlarmScreen} from "@/features/zone-alarm";
import {Toaster} from "@/components/ui/sonner";



export default function Page() {
    return (
        <div className={cn("relative h-screen w-full")}>
            <ZoneAlarmScreen/>
            <Toaster />
        </div>
    )
};
