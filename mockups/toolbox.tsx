import {cn} from "@/lib/utils";

const Toolbox = () => {
    return (
        <>
            {/* detection toolbox */}
            <div className={cn("border-primary/5 border-2 shadow-md rounded-md",
                " flex flex-col gap-2 justify-between ",
                "max-w-xs p-4")}>

                {/* top section */}
                <div className={cn("flex flex-col gap-2")}>
                    <h3 className={cn("text-lg font-semibold")}>Detection Toolbox</h3>
                    <div className={cn("flex flex-col gap-2")}>
                        <div>
                            <label className={cn("text-sm")}>Inference Frequency</label>
                            <select className={cn("w-full rounded-md p-2")}>
                                <option value="1">1 FPS</option>
                                <option value="2">2 FPS</option>
                                <option value="3">3 FPS</option>
                            </select>
                        </div>
                        <div>
                            <label className={cn("text-sm")}>Detection Threshold</label>
                            <input type="range" className={cn("w-full")}/>
                        </div>
                    </div>
                </div>

                {/* middle section */}
                <div className={cn("flex flex-col gap-2")}>
                    <h4 className={cn("text-md font-semibold")}>Detection History</h4>
                    <ul className={cn("max-h-40 overflow-y-auto")}>
                        <li className={cn("text-sm")}>10:00:00 PM: inside</li>
                        <li className={cn("text-sm")}>10:00:00 PM: partially</li>
                        <li className={cn("text-sm")}>10:00:00 PM: outside</li>
                    </ul>
                </div>

                {/* bottom section */}
                <div className={cn("flex flex-col gap-2")}>
                    <h4 className={cn("text-md font-semibold")}>Detected Objects</h4>
                    <p className={cn("text-sm")}>3</p>
                </div>
            </div>
        </>
    );
}