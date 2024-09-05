# Memoria Técnica: Módulo Zone Alarm

## 1. Descripción General

El módulo Zone Alarm es una funcionalidad que permite a los usuarios dibujar y editar zonas de alarma en forma de polígonos en una interfaz gráfica. Este módulo es parte de un sistema de vigilancia más amplio.

## 2. Estructura del Módulo

El módulo está organizado de la siguiente manera:

```
    src/features/zone-alarm/
    ├── components/
    │   ├── ZoneAlarmScreen.tsx
    │   ├── editor/
    │   │   ├── FloatingToolbar.tsx
    │   ├── services/
    │   │   ├── polygonService.ts
    │   ├── domain/
    │   │   ├── types.ts
    │   │   ├── utils.ts
    │   ├── hooks/
    │   │   ├── usePolygonEditor.ts
    │   ├── docs/
```

```
    src/
    └── features/
    └── zone-alarm/
    ├── components/
    │ ├── ZoneAlarmScreen.tsx
    │ └── editor/
    │ └── FloatingToolbar.tsx
    ├── domain/
    │ ├── types.ts
    │ └── polygonUtils.ts
    ├── hooks/
    │ └── usePolygonEditor.ts
    ├── services/
    │ └── polygonService.ts
    └── index.ts
```



## 3. Diagrama de Clases

El diagrama de clases del módulo se muestra a continuación:

```plantuml
class ZoneAlarmScreen {
  - polygon: Polygon
  - editorState: EditorState
  - screenState: ScreenState
  - showToolbar: boolean
  + handleCanvasClick(point: Point): void
  + handleMouseMove(point: Point): void
  + handleMouseUp(): void
  + handleMouseLeave(): void
  + handleStateChange(newState: ScreenState): void
  + handleCloseToolbar(): void
}

class PolygonEditor {
  - polygon: Polygon
  - editorState: EditorState
  - draggedVertex: number | null
  - lastMousePosition: Point | null
  - isSpacePressed: boolean
  - isPolygonComplete: boolean
  + handleCanvasClick(point: Point): void
  + handleMouseMove(point: Point): void
  + handleMouseUp(): void
    

```

## 4. Diagrama de Flujo

El diagrama de flujo del módulo se muestra a continuación:

```plantuml

```