// @ts-ignore
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import {toast} from "sonner";

const ffmpeg = createFFmpeg({ log: true });

// Function to convert video to MP4 and download
export const convertToMp4AndDownload = async (blob: any) => {
    try {
        const mp4Blob = await convertWebMtoMP4(blob);
        const url = URL.createObjectURL(mp4Blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.classList.add("hidden");
        a.href = url;
        a.download = 'rec.mp4';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Conversion failed:', error);
        toast('Failed to convert video. Downloading original WebM file.');
        // Fallback to downloading the original WebM file
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.classList.add("hidden");
        a.href = url;
        a.download = 'rec.webm';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Function for WebM to MP4 conversion using FFmpeg.wasm
export const convertWebMtoMP4 = async (webmBlob: any) => {
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    const inputName = 'input.webm';
    const outputName = 'output.mp4';

    ffmpeg.FS('writeFile', inputName, await fetchFile(webmBlob));

    await ffmpeg.run('-i', inputName, '-c:v', 'libx264', outputName);

    const data = ffmpeg.FS('readFile', outputName);
    const mp4Blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Clean up
    ffmpeg.FS('unlink', inputName);
    ffmpeg.FS('unlink', outputName);

    return mp4Blob;
}