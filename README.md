# En corto

Mod para Claude Code que resume en una sola línea cada respuesta larga de Claude y la muestra en un recuadro arriba de donde escribes.

Sirve para leer rápido: si no tienes tiempo o energía para leer toda la respuesta, lees el recuadro y sabes de qué trató y si te toca hacer algo.

## Cómo funciona

- Cuando una respuesta pasa de 120 palabras (sin contar bloques de código ni tablas, que ya se leen de un vistazo), el mod se la pasa a Haiku, el modelo más barato de Claude.
- Si la respuesta explica algo, Haiku escribe su idea central en una línea, aunque la respuesta termine con una pregunta. Si solo reporta avance o confirma algo hecho, no se muestra nada.
- El resumen aparece en un recuadro arriba del prompt. Se reemplaza con cada respuesta nueva y desaparece cuando mandas tu siguiente mensaje.
- Las respuestas cortas y las de los subagentes se ignoran.
- El resumen sale en el idioma de la respuesta.

## Instalación

En la terminal, dentro de Claude Code:

```
/plugin install en-corto --marketplace gereyes/en-corto
```

Responde `y` para agregar el marketplace y elige el alcance con Enter. El mod queda activo de inmediato.

Desde la línea de comandos:

```
claude plugin install en-corto --marketplace gereyes/en-corto
```

En la app de escritorio, donde `/plugin` no está disponible: haz clic en **+** junto al cuadro de texto, luego **Plugins**, **Add marketplace** con `gereyes/en-corto` y después **Add plugin**.

## Comando

- `/en-corto`: prende o apaga el mod. La preferencia se guarda entre sesiones.

## Costo

Cada resumen es una llamada pequeña a Haiku (esfuerzo bajo, máximo 120 tokens de salida), solo para las respuestas largas. Se cobra a la misma cuenta que usa tu sesión de Claude Code.

## Requisitos

Claude Code 2.1.287 o más nuevo en la terminal, o 2.1.286 o más nuevo en la pestaña Code de la app de escritorio.
