import { DetectedObject } from "@tensorflow-models/coco-ssd";

export function drawOnCanvas(
  mirrored: boolean,
  predictions: DetectedObject[],
  ctx: CanvasRenderingContext2D
) {
  predictions.forEach((detectedObject: DetectedObject) => {
    const { class: objectClass, bbox, score } = detectedObject;
    const [x, y, width, height] = bbox;

    ctx.beginPath();

    // Estilo para personas
    if (objectClass === "person") {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)"; // Rojo semi-transparente
    } else {
      // Estilo para otros objetos
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(0, 255, 0, 0.2)"; // Verde semi-transparente
    }

    // Dibujar el rectángulo
    if (mirrored) {
      ctx.rect(ctx.canvas.width - x - width, y, width, height);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.fill(); // Rellenar el rectángulo con el color semi-transparente
    ctx.stroke();

    // Dibujar la etiqueta
    ctx.font = "16px Arial";
    const label = `${objectClass} (${Math.round(score * 100)}%)`;
    const textWidth = ctx.measureText(label).width;
    const textHeight = 16;
    const textX = mirrored ? ctx.canvas.width - x - width : x;
    const textY = y > textHeight ? y - textHeight : y + height + textHeight;

    ctx.fillStyle = objectClass === "person" ? "rgba(255, 0, 0, 0.7)" : "rgba(0, 255, 0, 0.7)";
    ctx.fillRect(textX, textY - textHeight, textWidth + 4, textHeight + 4);
    ctx.fillStyle = "white";
    ctx.fillText(label, textX + 2, textY);
  });
}
