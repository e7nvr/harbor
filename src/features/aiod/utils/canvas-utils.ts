import {throttle} from 'lodash';


// Define la región de detección
let detectionRegion = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
};

export const setDetectionRegion = (canvasWidth: number, canvasHeight: number) => {
    detectionRegion = {
        x: 0,
        y: 0,
        width: canvasWidth / 2,
        height: canvasHeight
    };
};

export const renderPredictions = (predictions: any, ctx: any) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Set detection region if not set
    if (detectionRegion.width === 0) {
        setDetectionRegion(ctx.canvas.width, ctx.canvas.height);
    }

    // Draw detection region
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.strokeRect(detectionRegion.x, detectionRegion.y, detectionRegion.width, detectionRegion.height);

    predictions.forEach((prediction) => {
        if (prediction.class !== "person") return; // Ignorar objetos que no sean personas

        const [x, y, width, height] = prediction.bbox;
        const text = "Person " + (prediction.score * 100).toFixed(2) + "%";

        const position = getPersonPosition(x, y, width, height);
        let color;
        switch (position) {
            case "inside":
                color = "#00FF00"; // Verde
                break;
            case "partially":
                color = "#FFFF00"; // Amarillo
                break;
            case "outside":
                color = "#FF0000"; // Rojo
                break;
        }

        // Dibujar el bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        // Dibujar el fondo del texto
        ctx.fillStyle = color;
        const textWidth = ctx.measureText(text).width;
        let font = "16px Arial";
        const textHeight = parseInt(font, 10);
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

        // Dibujar el texto
        ctx.fillStyle = "#000000";
        ctx.fillText(text, x, y);

        if (position !== "inside") {
            playAlarm(); // Alerta cuando la persona no está completamente dentro
        }
    });
}

function getPersonPosition(x: number, y: number, width: number, height: number): "inside" | "partially" | "outside" {
    const personLeft = x;
    const personRight = x + width;
    const personTop = y;
    const personBottom = y + height;

    const regionLeft = detectionRegion.x;
    const regionRight = detectionRegion.x + detectionRegion.width;
    const regionTop = detectionRegion.y;
    const regionBottom = detectionRegion.y + detectionRegion.height;

    if (personLeft >= regionLeft && personRight <= regionRight &&
        personTop >= regionTop && personBottom <= regionBottom) {
        return "inside";
    } else if (personRight < regionLeft || personLeft > regionRight ||
               personBottom < regionTop || personTop > regionBottom) {
        return "outside";
    } else {
        return "partially";
    }
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

