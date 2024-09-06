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


------


## 3. Componentes Principales

### 3.1 ZoneAlarmScreen

Este es el componente principal que renderiza la interfaz de usuario del editor de zonas de alarma.

### 3.2 FloatingToolbar

Este componente es una barra flotante que se muestra en la parte superior de la pantalla y contiene los botones para dibujar, editar y mover zonas de alarma.

### 3.3 PolygonEditor

Este componente es el editor de polígonos que se encarga de dibujar y editar los polígonos de las zonas de alarma.

## 4. Servicios

### 4.1 PolygonService

Este servicio se encarga de la lógica de negocio relacionada con los polígonos.

## 5. Tipos y Utilidades

### 5.1 Tipos

Este archivo contiene los tipos de datos utilizados en el módulo.

### 5.2 Utils

Este archivo contiene las funciones utilitarias para el módulo.


----


## 4. Lógica de Negocio

### 4.1 usePolygonEditor

Un hook personalizado que maneja la lógica del editor de polígonos.

### 4.2 polygonUtils

Funciones puras para la manipulación de polígonos.

### 4.3 types

Tipos de datos utilizados en el módulo.

### 4.4 services

Servicios del módulo.


## 5. Servicios

### 5.1 polygonService

Maneja la lógica de guardado de polígonos (simulado por ahora).


## 6. Tipos y Enumeraciones

Definidos en `types.ts`:

- `Point`
- `Polygon`
- `EditorState`
- `ScreenState`

### 6.1 Point

Representa un punto en el plano con coordenadas x e y.

### 6.2 Polygon

Representa un polígono con una lista de puntos.

### 6.3 EditorState

Representa el estado del editor de polígonos.

### 6.4 ScreenState

Representa el estado de la pantalla.


----


## 7. Funcionalidades Clave

- Dibujo de polígonos de 4 lados
- Edición de vértices del polígono
- Movimiento del polígono completo
- Reinicio del dibujo
- Guardado del polígono (simulado)

## 8. Interacciones de Usuario

- Clic para dibujar vértices
- Arrastrar vértices para editar
- Usar la barra espaciadora para mover el polígono completo
- Botones en la barra de herramientas flotante para cambiar modos y realizar acciones

## 9. Estado de la Aplicación

Manejado principalmente a través del hook `usePolygonEditor`, que utiliza `useState` de React para:
- El polígono actual
- El estado del editor (dibujo, edición, movimiento)
- Estado de completitud del polígono

## 10. Mejoras Futuras

1. Implementar persistencia real de datos
2. Añadir validaciones más robustas para el polígono
3. Mejorar la accesibilidad
4. Implementar pruebas unitarias y de integración
5. Considerar la internacionalización
6. Optimizar para responsividad en diferentes dispositivos

## 11. Conclusión

El módulo Zone Alarm proporciona una base sólida y extensible para la funcionalidad de dibujo de zonas de alarma. La arquitectura elegida permite una fácil extensión y mantenimiento del código a medida que el proyecto evolucione.


### Commit Message

```
feat(zone-alarm): Implement polygon drawing and editing functionality

- Add polygon drawing with vertex placement
- Implement vertex editing and polygon movement
- Create floating toolbar for mode switching and actions
- Simulate polygon saving functionality
- Update documentation with module details and future improvements


```
