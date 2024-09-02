"use client";

import {Toaster} from "@/components/ui/sonner";
import {KouScreen} from "@/features/kou/components/screen";
import {cn} from "@/lib/utils";


export default function KouHome() {
    return (
        <div className={cn("h-screen w-full")}>
            <KouScreen />
        </div>
    )
};
