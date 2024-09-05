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


