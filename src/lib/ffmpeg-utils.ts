import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function loadFFmpeg(): Promise<void> {
    if (ffmpeg) return;

    ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    ffmpeg.on('log', ({ message }) => {
        console.log(message);
    });
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
}

export async function convertToMp4(webmBlob: Blob): Promise<Blob> {
    if (!ffmpeg) throw new Error('FFmpeg not loaded');

    const inputFileName = 'input.webm';
    const outputFileName = 'output.mp4';

    await ffmpeg.writeFile(inputFileName, await fetchFile(webmBlob));

    await ffmpeg.exec([
        '-i', inputFileName,
        '-vf', 'scale=640:480',
        '-r', '15',
        '-crf', '28',
        '-preset', 'veryfast',
        outputFileName
    ]);

    const data = await ffmpeg.readFile(outputFileName);
    // @ts-ignore
    return new Blob([data.buffer], { type: 'video/mp4' });
}