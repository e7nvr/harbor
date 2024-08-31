import {throttle} from 'lodash';


// Define la región de detección
const detectionRegion = {
  x: 100,
  y: 100,
  width: 400,
  height: 300
};

export const renderPredictions = (predictions: any, ctx: any) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    // Dibuja la región de detección
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.strokeRect(detectionRegion.x, detectionRegion.y, detectionRegion.width, detectionRegion.height);

    predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;
        const text = prediction.class + " " + (prediction.score * 100).toFixed(2) + "%";
        const isPerson = prediction.class === "person";

        // Draw the bounding box.
        ctx.strokeStyle = isPerson ? "#00FFFF" : "#FF0000";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        // fill the bounding box
        ctx.fillStyle = isPerson ? "#00FFFF" : "#FF0000";
        ctx.fillText(text, x, y);

        // Draw the label background.
        ctx.fillStyle = isPerson ? "#00FFFF" : "#FF0000";
        const textWidth = ctx.measureText(text).width;
        const textHeight = parseInt(font, 10);
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(text, x, y);

        if (isPerson && isInDetectionRegion(x, y, width, height)) {
            // Play the alarm sound only if person is in the detection region
            playAlarm();
        }
    });
}

function isInDetectionRegion(x: number, y: number, width: number, height: number): boolean {
    return (
        x < detectionRegion.x + detectionRegion.width &&
        x + width > detectionRegion.x &&
        y < detectionRegion.y + detectionRegion.height &&
        y + height > detectionRegion.y
    );
}


let isAlarmPlaying = false;

const playAlarm = throttle(() => {
    if (!isAlarmPlaying) {
        isAlarmPlaying = true;
        const audio = new Audio("/sounds/sonic.mp3");
        audio.play();
        audio.onended = () => {
            isAlarmPlaying = false;
        };
    }
}, 2000);



function renderPredictions0(detectedObjects: DetectedObject[], context: any) {
    detectedObjects.forEach((prediction) => {
        const [x, y, width, height] = prediction.bbox;
        const text = prediction.class + " " + (prediction.score * 100).toFixed(2) + "%";

        context.strokeStyle = "#00FFFF";
        context.font = "18px Arial";
        context.fillStyle = "#00FFFF";
        context.beginPath();
        context.fillText(text, x, y);
        context.rect(x, y, width, height);
        context.stroke();
    });
}

