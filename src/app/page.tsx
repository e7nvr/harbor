import Image from "next/image";
import React from "react";

export default function Home() {
    return (
        <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
             style={{ fontFamily: 'Epilogue, "Noto Sans", sans-serif;'}}>
            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] px-10 py-3">
                    <div className="flex items-center gap-4 text-[#0e141b]">
                        <div className="size-4">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h2 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">CuidAR Plus</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <div className="flex items-center gap-9">
                            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="#">Inicio</a>
                            <a className="text-[#0e141b] bg-orange-200/50 p-2 rounded-full  text-sm font-semibold leading-normal" href="/about">Sobre Nosotros</a>
                            <a className="text-[#0e141b] mutted text-sm font-medium leading-normal" href="#">Características</a>
                            <a className="text-[#0e141b] mutted text-sm font-medium leading-normal" href="#">Precios</a>
                            <a className="text-[#0e141b] mutted text-sm font-medium leading-normal" href="#">Contacto</a>
                        </div>
                        <a href={"/aio"}>
                        <button
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1980e6] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
                        >
                            <span className="truncate">Probar ahora</span>
                        </button> </a>
                    </div>
                </header>
                <div className="px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <div className="@container">
                            <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
                                    style={{backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/c8b856de-edd1-45d8-9598-5b573527aa39.png");'}}
                                ></div>
                                <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                                    <div className="flex flex-col gap-2 text-left">
                                        <h1
                                            className="text-[#0e141b] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                                        >
                                            Sistema de videovigilancia inteligente para geriátricos
                                        </h1>
                                        <h2 className="text-[#0e141b] text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                                            Prevení accidentes y respondé a emergencias con IA
                                        </h2>
                                    </div>
                                    <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                                        <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                                            <div
                                                className="text-[#4e7397] flex border-none bg-[#e7edf3] items-center justify-center pl-4 rounded-l-xl border-r-0"
                                                data-icon="MagnifyingGlass"
                                                data-size="20px"
                                                data-weight="regular"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <input
                                                placeholder="Ingresá tu email"
                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0e141b] focus:outline-0 focus:ring-0 border-none bg-[#e7edf3] focus:border-none h-full placeholder:text-[#4e7397] px-4 rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                                                value=""
                                            />
                                            <div className="flex items-center justify-center rounded-r-xl border-l-0 border-none bg-[#e7edf3] pr-2">
                                                <button
                                                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1980e6] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                                                >
                                                    <span className="truncate">Empezar</span>
                                                </button>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-10 px-4 py-10 @container">
                            <div className="flex flex-col gap-4">
                                <h1
                                    className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                                >
                                    Características de Seguridad y Cuidado
                                </h1>
                                <p className="text-[#0e141b] text-base font-normal leading-normal max-w-[720px]">
                                    Nuestro sistema de videovigilancia con IA ofrece características avanzadas de seguridad para geriátricos y centros de día en Argentina
                                </p>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                                <div
                                    className="flex flex-1 gap-3 rounded-lg border border-[#d0dbe7] bg-slate-50 p-4 flex-col">
                                    <div className="text-[#0e141b]" data-icon="MagnifyingGlass" data-size="24px"
                                         data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                             fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-[#0e141b] text-base font-bold leading-tight">Detección de
                                            caídas</h2>
                                        <p className="text-[#4e7397] text-sm font-normal leading-normal">Detección
                                            automática de caídas con monitoreo las 24 horas</p>
                                    </div>
                                </div>
                                <div
                                    className="flex flex-1 gap-3 rounded-lg border border-[#d0dbe7] bg-slate-50 p-4 flex-col">
                                    <div className="text-[#0e141b]" data-icon="MapPin" data-size="24px"
                                         data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                             fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-[#0e141b] text-base font-bold leading-tight">Control de
                                            deambulación</h2>
                                        <p className="text-[#4e7397] text-sm font-normal leading-normal">Alertas cuando
                                            los residentes salen de áreas designadas</p>
                                    </div>
                                </div>
                                <div
                                    className="flex flex-1 gap-3 rounded-lg border border-[#d0dbe7] bg-slate-50 p-4 flex-col">
                                    <div className="text-[#0e141b]" data-icon="Bell" data-size="24px"
                                         data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                             fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-[#0e141b] text-base font-bold leading-tight">Recordatorios
                                            de medicación</h2>
                                        <p className="text-[#4e7397] text-sm font-normal leading-normal">Recordatorios
                                            de medicación en tiempo real y seguimiento</p>
                                    </div>
                                </div>
                                <div
                                    className="flex flex-1 gap-3 rounded-lg border border-[#d0dbe7] bg-slate-50 p-4 flex-col">
                                    <div className="text-[#0e141b]" data-icon="Phone" data-size="24px"
                                         data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                             fill="currentColor" viewBox="0 0 256 256">
                                            <path
                                                d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"
                                            ></path>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-[#0e141b] text-base font-bold leading-tight">Sistema de
                                            llamada de emergencia</h2>
                                        <p className="text-[#4e7397] text-sm font-normal leading-normal">Llamada de
                                            emergencia con un toque para asistencia inmediata</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                            <div className="flex flex-col gap-3 pb-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("/landing/care1.png");'}}
                                ></div>
                                <div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">
                                       Detección de caídas AI
                                    </p>
                                    <p className="text-[#4e7397] text-sm font-normal leading-normal">
                                        Detecte caídas automáticamente y alerte a los cuidadores en tiempo real
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pb-3">
                                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("/landing/care2.png");'}}
                                ></div>
                                <div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">
                                        Detección de Caidas AI
                                    </p>
                                    <p className="text-[#4e7397] text-sm font-normal leading-normal">
                                        Reciba alertas cuando los residentes salen de áreas designadas
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pb-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("/landing/solution2.png");'}}
                                ></div>
                                <div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">
                                       Recordatorios de medicación
                                    </p>
                                    <p className="text-[#4e7397] text-sm font-normal leading-normal">
                                        Proporcionar recordatorios de medicación en tiempo real y seguimiento
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 pb-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("/landing/solution1.png");'}}
                                ></div>
                                <div>
                                    <p className="text-[#0e141b] text-base font-medium leading-normal">Sistema de llamada de emergencia por WhatsApp</p>
                                    <p className="text-[#4e7397] text-sm font-normal leading-normal">Habilitar llamada de emergencia con un toque para asistencia inmediata</p>
                                </div>
                            </div>
                        </div>
                        <div className="@container">
                            <div
                                className="flex flex-col justify-end gap-6 px-4 py-10 @[480px]:gap-8 @[480px]:px-10 @[480px]:py-20">
                                <div className="flex flex-col gap-2 text-center">
                                    <h1
                                        className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                                    >
                                        Experimenta la próxima generación de seguridad en el cuidado de ancianos
                                    </h1>
                                </div>
                                <div className="flex flex-1 justify-center">
                                    <div className="flex justify-center">
                                        <button
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1980e6] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] grow"
                                        >
                                            <span className="truncate">Empezar ahora</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-[#0e141b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">

                            Confianza de las principales instalaciones de cuidado de ancianos en <span className={"bg-gray-200 px-2 rounded-md"}>Argentina</span>
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                            <div className="flex flex-col gap-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/7583f9b9-7420-4c90-8c99-387cb2930bad.png");'}}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/240a4e5c-9957-437f-b1b8-59bdac5a3c50.png");'}}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/f191bfb8-5a22-458e-86a5-e797f692d54a.png");'}}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/77b1c8a0-4710-4d8c-a04a-3105cbdd8b37.png");'}}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/547dc0dc-da63-4728-931f-2e9acba69e89.png");'}}
                                ></div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                                    style={{backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/987eb818-70e1-41a7-b935-6e49e8269ada.png");'}}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
