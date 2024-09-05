# Historia de Usuario: Editor de Zona de Alarma

## Descripción
Como usuario, quiero poder dibujar y editar una zona de alarma en forma de polígono de cuatro lados en una interfaz gráfica, para definir áreas de interés en un sistema de vigilancia.

## Criterios de Aceptación
1. Puedo dibujar un polígono de cuatro lados haciendo clic en cuatro puntos distintos.
2. Puedo editar los vértices del polígono arrastrándolos con el mouse.
3. Puedo mover el polígono completo arrastrándolo o usando la barra espaciadora.
4. Puedo reiniciar el dibujo para empezar de nuevo.
5. La interfaz proporciona retroalimentación visual clara sobre el modo de edición actual.

## Implementación Técnica

### Arquitectura
- Separación de responsabilidades entre lógica de dominio e interfaz de usuario.
- Uso de hooks personalizados para manejar la lógica de estado e interacciones.
- Implementación de una máquina de estados simple para los modos de edición.

### Estructura de Archivos:

```
src/
└── features/
└── zone-alarm/
├── components/
│ └── ZoneAlarmScreen.tsx
├── domain/
│ ├── types.ts
│ └── polygonUtils.ts
├── hooks/
│ └── usePolygonEditor.ts
└── index.ts
```

- `src/features/zone-alarm/domain/types.ts`: Define los tipos de datos y las constantes utilizadas en el editor de zona de alarma.
- `src/features/zone-alarm/components/ZoneAlarmScreen.tsx`: Componente principal que contiene la lógica del editor de zona de alarma.
- `src/features/zone-alarm/hooks/usePolygonEditor.ts`: Hook personalizado que maneja la lógica de estado y las interacciones del editor de zona de alarma.
- `src/features/zone-alarm/components/ZoneAlarmCanvas.tsx`: Componente que representa el canvas en el que se dibuja el polígono.
- `src/features/zone-alarm/components/ZoneAlarmControls.tsx`: Componente que contiene los controles para los modos de edición.

### Diagrama de Clases

```plantuml
class ZoneAlarmScreen {
    - polygon: Polygon
    - editorState: EditorState
    - setEditorState: (state: EditorState) => void
    - handleCanvasClick: (point: Point) => void
    - handleMouseDown: (point: Point, index?: number) => void
    - handleMouseMove: (point: Point) => void
    - handleMouseUp: () => void
    - resetPolygon: () => void
    - isPolygonComplete: () => boolean
}

class ZoneAlarmCanvas {
    - polygon: Polygon
    - editorState: EditorState
    - setEditorState: (state: EditorState) => void
    - handleMouseDown: (point: Point, index?: number) => void
    - handleMouseMove: (point: Point) => void
    - handleMouseUp: () => void
}

class ZoneAlarmControls {
    - editorState: EditorState
    - setEditorState: (state: EditorState) => void
    - handleReset: () => void
}
```

---



### Componentes Principales
1. `ZoneAlarmScreen`: Componente principal que renderiza la interfaz de usuario.
2. `usePolygonEditor`: Hook personalizado que maneja la lógica del editor de polígonos.
3. `polygonUtils`: Funciones puras para manipulación de polígonos.

### Tecnologías Utilizadas
- React con TypeScript
- SVG para renderizado del polígono
- CSS Modules para estilos

## Análisis y Reflexiones

### Fortalezas
1. Diseño modular y extensible.
2. Separación clara entre lógica de dominio y presentación.
3. Uso efectivo de hooks de React para manejo de estado.
4. Interfaz intuitiva con retroalimentación visual.

### Áreas de Mejora
1. Implementar persistencia de datos.
2. Añadir validaciones más robustas para el polígono.
3. Mejorar la accesibilidad.
4. Implementar pruebas unitarias y de integración.
5. Considerar la internacionalización.
6. Optimizar para responsividad en diferentes dispositivos.

## Próximos Pasos
1. Realizar una revisión de código con el equipo.
2. Implementar suite de pruebas automatizadas.
3. Explorar la integración con un backend para persistencia.
4. Recopilar feedback de usuarios para mejoras en usabilidad.
5. Planificar la siguiente iteración, enfocándose en las áreas de mejora identificadas.

## Conclusión
Esta implementación proporciona una base sólida para la funcionalidad de dibujo de zonas de alarma, alineada con los principios de XP de diseño simple, refactorización continua y desarrollo iterativo. La arquitectura elegida permite una fácil extensión y mantenimiento del código a medida que el proyecto evolucione.
