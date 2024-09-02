import {cn} from "@/lib/utils";
import ObjectDetection from "@/features/aio/components/ObjectDetection";

export default function AIODHome()  {
    return (
        <main className={cn(
            "h-full w-full items-center justify-start flex flex-col",
        )}>
            <h2>Thief Detection Alarm</h2>
            <div className={cn("w-full h-full overflow-hidden")}>
                <ObjectDetection/>
            </div>
        </main>
    )
}