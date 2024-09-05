"use client";


// src/components/FaqSection.js
import React, {useState} from 'react';


const Page = () => {
    return (
        <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
             style={{fontFamily: 'Epilogue, "Noto Sans", sans-serif;'}}>
            <div className="layout-container flex h-full grow flex-col">

                <header
                    className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] px-10 py-3">
                    <div className="relative flex items-center gap-4 text-[#0e141b]">
                        <div className="absolute  size-8 mr-0 pr-0">
                            <img className={"object-contain"} src="/panda/panda.png"/>
                            <svg className="hidden" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                                      fill="currentColor"></path>
                            </svg>
                        </div>
                        <h2 className="ml-8  absolute mr-0 pr-0 text-[#0e141b]/85 text-xl font-black leading-tight tracking-[-0.045em]">Peach
                            Panda</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <div className="flex items-center gap-9">
                            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="/">Inicio</a>
                            <a className="text-[#0e141b] bg-orange-200/50 p-2 rounded-full  text-sm font-semibold leading-normal"
                               href="/about">Sobre Nosotros</a>
                            <a className="text-[#0e141b] mutted text-sm font-medium leading-normal"
                               href="#">Características</a>
                            <a className="text-[#0e141b] mutted text-sm font-medium leading-normal" href="#">Precios</a>
                            <a className="text-[#0e141b] mutted text-sm font-medium leading-normal"
                               href="#">Contacto</a>
                        </div>
                        <div className="flex gap-2">
                            <a href={"/kou"}>
                                <button
                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1980e6] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
                                >
                                    <span className="truncate">Probar ahora</span>
                                </button>
                            </a>
                        </div>
                    </div>
                </header>

                <div className="px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <div className="@container">
                            <div className="@[480px]:p-4">
                                <div
                                    className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                                    style={{backgroundImage: ' linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),    url("/cover/cover1.png");'}}
                                >
                                    <div className="flex flex-col gap-2 text-left">
                                        <h1
                                            className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                                        >
                                            Intelligent safety monitoring for eldercare
                                        </h1>
                                        <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                                            Peach Panda is designed to keep seniors safe, while preserving their
                                            privacy. Our AI-powered features let you know if something isnt right,
                                            without needing
                                            to watch every moment.
                                        </h2>
                                    </div>
                                    <button
                                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1980e6] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                                    >
                                        <span className="truncate">Learn more</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10 px-4 py-10 @container">
                            <div className="flex flex-col gap-4">
                                <h1
                                    className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                                >
                                    AI safety monitoring
                                </h1>
                                <p className="text-[#0e141b] text-base font-normal leading-normal max-w-[720px]">
                                    Our AI analyzes camera feeds in real time, looking for signs of distress, falls, or
                                    other safety risks.
                                </p>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{backgroundImage: ' linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),    url("/cover/cover2.png");'}}
                                    ></div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">Real-time
                                        alerts</p>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{backgroundImage: ' linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),    url("/cover/cover3.png");'}}
                                    ></div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">Fall
                                        detection</p>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{backgroundImage: ' linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),    url("/cover/cover2.png");'}}
                                    ></div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">Privacy mode</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                            <div className="flex flex-col gap-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                    style={{backgroundImage: ' linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),    url("/cover/cover3.png");'}}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                    style={{backgroundImage: ' linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),    url("/cover/cover2.png");'}}
                                ></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10 px-4 py-10 @container">
                            <div className="flex flex-col gap-4">
                                <h1
                                    className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                                >
                                    How it works
                                </h1>
                                <p className="text-[#0e141b] text-base font-normal leading-normal max-w-[720px]">
                                    Peach Pandas AI analyzes video streams from existing IP cameras and can be
                                    integrated into your existing monitoring solutions.
                                </p>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{backgroundImage: ' linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),    url("/cover/cover2.png");'}}
                                    ></div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">1. Intelligent
                                        safety monitoring</p>
                                </div>
                                <div className="flex flex-col gap-3 pb-3">
                                    <div
                                        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                        style={{backgroundImage: ' linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%),    url("/cover/cover3.png");'}}
                                    ></div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">2. Real-time
                                        alerts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;