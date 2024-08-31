import {cn} from "@/lib/utils";
import ObjectDetection from "@/features/aiod/components/ObjectDetection";

export default function AIODHome()  {
    return (
        <main className={cn(
            "h-full w-full bg-blue-50 items-center justify-start flex flex-col",
        )}>
            <h2>Thief Detection Alarm</h2>
            <div className={cn("w-full h-full overflow-hidden")}>
                <ObjectDetection/>
            </div>
        </main>
    )
}