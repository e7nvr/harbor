import { Toaster } from "@/components/ui/sonner";
import CameraDevicesProvider from "@/providers/CameraDevicesProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                    <CameraDevicesProvider>{children}</CameraDevicesProvider>
                    <Toaster />
            </body>
        </html>
    );
}
