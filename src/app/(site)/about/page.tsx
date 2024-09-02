"use client";


// src/components/FaqSection.js
import React, { useState } from 'react';

const faqs = [
    {
        question: "¿Cómo funciona Peach Panda?",
        answer: "Peach Panda utiliza tecnología de visión por computadora para monitorear el entorno y detectar caídas o comportamientos inusuales. Si detecta una posible caída o un evento preocupante, envía una alerta a tus dispositivos para que puedas intervenir rápidamente."
    },
    {
        question: "¿Es necesario instalar algún hardware adicional?",
        answer: "Para utilizar Peach Panda, se requiere una cámara compatible que se instalará en la habitación del ser querido. La cámara captura el video y lo analiza mediante el software de Peach Panda."
    },
    {
        question: "¿Cómo se asegura la privacidad de mis seres queridos?",
        answer: "Peach Panda toma muy en serio la privacidad. Los datos se cifran y se almacenan de forma segura, y solo se transmiten alertas o información relevante cuando se detecta una posible situación de emergencia."
    },
    {
        question: "¿Qué tipo de alertas envía Peach Panda?",
        answer: "Peach Panda envía alertas en tiempo real a tu teléfono móvil o dispositivo conectado si detecta una caída, una anomalía en el comportamiento o cualquier otra situación que pueda necesitar tu atención."
    },
    {
        question: "¿Es fácil de instalar y usar?",
        answer: "Sí, Peach Panda está diseñado para ser fácil de instalar. Solo necesitas configurar la cámara y el software siguiendo las instrucciones proporcionadas. Una vez configurado, puedes gestionar y monitorear a tus seres queridos a través de una aplicación intuitiva."
    },
    {
        question: "¿Cuáles son los requisitos técnicos para usar Peach Panda?",
        answer: "Necesitarás una cámara compatible, una conexión a Internet estable y un dispositivo (como un smartphone o tablet) para recibir las alertas y gestionar la aplicación."
    },
    {
        question: "¿Qué sucede si hay un problema con el servicio?",
        answer: "Si experimentas problemas técnicos, puedes contactar con el soporte técnico de Peach Panda para obtener asistencia. También hay recursos en línea y guías para ayudarte a solucionar problemas comunes."
    },
    {
        question: "¿Peach Panda ofrece soporte en diferentes idiomas?",
        answer: "Sí, Peach Panda ofrece soporte en varios idiomas. Verifica la disponibilidad de idiomas en la sección de soporte o en la configuración de la aplicación."
    },
    {
        question: "¿Peach Panda puede integrarse con otros dispositivos o servicios?",
        answer: "Actualmente, Peach Panda se integra principalmente con cámaras específicas y ofrece alertas a través de su propia aplicación. La integración con otros dispositivos o servicios puede estar disponible en futuras actualizaciones."
    },
    {
        question: "¿Cómo puedo obtener más información sobre Peach Panda?",
        answer: "Puedes visitar el sitio web oficial de Peach Panda para obtener más información, leer las preguntas frecuentes, y contactar con el equipo de soporte para consultas específicas."
    }
];

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index: any) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-full mx-auto px-4 py-6">
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg shadow-sm">
                        <button
                            onClick={() => handleToggle(index)}
                            className="w-full px-4 py-2 text-left bg-gray-100 rounded-t-lg hover:bg-gray-200 focus:outline-none"
                        >
                            <h3 className="text-lg font-semibold">{faq.question}</h3>
                        </button>
                        {openIndex === index && (
                            <div className="px-4 py-2 bg-white rounded-b-lg">
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};




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
                        <h2 className="ml-8  absolute mr-0 pr-0 text-[#0e141b]/85 text-xl font-black leading-tight tracking-[-0.045em]">Peach Panda</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <div className="flex items-center gap-9">
                            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="/">Home</a>
                            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="#">About</a>
                            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="#">Features</a>
                            <a className="text-[#0e141b] text-sm font-medium leading-normal" href="#">Pricing</a>
                        </div>
                        <div className="flex gap-2">
                            <a href={"/aio"}>
                            <button
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#1980e6] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em]"
                            >
                                <span className="truncate" >Get started</span>
                            </button>
                            </a>
                        </div>
                    </div>
                </header>
                <div className="px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <div className="@container">
                            <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
                                <div
                                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
                                    style={{backgroundImage: 'url("https://cdn.usegalileo.ai/sdxl10/88b21ce2-6bf8-4fc5-9be1-7bdc85afd8ae.png");'}}
                                ></div>
                                <div
                                    className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
                                    <div className="flex flex-col gap-2 text-left">
                                        <h1
                                            className="text-[#0e141b] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                                        >
                                            AI-based elderly monitoring
                                        </h1>
                                        <h2 className="text-[#0e141b] text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                                            Peach Panda es una solución basada en inteligencia artificial que te ayuda a cuidar de tus seres queridos en edad avanzada.
                                            Utiliza visión por computadora para detectar caídas, te alerta cuando algo podría estar mal y proporciona información para ayudarte
                                            a mantenerlos seguros y saludables. Con Peach Panda, puedes tener la tranquilidad de saber que tus seres queridos están bien cuidados.
                                        </h2>
                                    </div>
                                    <div className="flex-wrap gap-3 flex">
                                        <button
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#1980e6] text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                                        >
                                            <span className="truncate">Get started</span>
                                        </button>
                                        <button
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#e7edf3] text-[#0e141b] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                                        >
                                            <span className="truncate">Learn more</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10 px-4 py-10 @container">
                            <h1
                                className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                            >
                                Preguntas frecuentes sobre Peach Panda
                            </h1>
                        </div>
                        <FaqSection/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;