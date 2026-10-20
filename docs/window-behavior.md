# Window behavior contract

Status: approved implementation contract; the window manager begins in later phases. P0 does not implement window state, a desktop shell, drag/resize behavior, or routing coordination.

The authoritative decisions are in handbook chapters [5](planning/PROJECT_HANDBOOK.md#5-responsive-environment-model), [6](planning/PROJECT_HANDBOOK.md#6-desktop-and-window-interaction-model), [7](planning/PROJECT_HANDBOOK.md#7-state-lifecycle-and-command-architecture), and [8](planning/PROJECT_HANDBOOK.md#8-routing-history-refresh-and-onboarding). This document gives future code and tests a compact contract.

## Interaction modes

| Mode | Visible apps | Move | Resize | Geometry |
| --- | --- | --- | --- | --- |
| Mobile/narrow tablet | One | No | No | Derived inset |
| Spacious tablet | Multiple | Yes | No | Remembered tablet position; mode-controlled size |
| Desktop | Multiple | Yes | Yes | Remembered desktop position and size |

Choose modes centrally from usable space, orientation, height, and pointer capability. The handbook's numeric thresholds are prototype heuristics. Rotation and virtual-keyboard changes must not promote a short phone into an unusable multi-window layout.

## Invariants

- One instance per application ID. Activating an existing application restores and focuses it.
- Taskbar order follows initial opening order and stays unchanged on focus. Closing removes the entry; reopening appends it.
- Stacking order is separate from taskbar order. Focusing raises a window without moving it.
- One click focuses an inactive window and activates its clicked control.
- No window edge may leave the usable desktop, including after viewport changes or restoration.
- The first new window opens near the center; later ones cascade down/right and wrap within bounds.
- Window dimensions are shared percentage-based rules. Exact size/cascade values need prototype validation.
- Maximized windows fill the usable desktop while retaining the taskbar.
- The title bar remains fixed; content scrolls inside the application.

## Lifecycle

| Action | Result |
| --- | --- |
| Open closed app | Mount a fresh instance, append taskbar entry, initialize geometry, focus |
| Activate existing app | Restore if necessary and focus without resetting application content |
| Minimize | Hide, keep mounted content and taskbar position |
| Switch mobile application | Hide the previous application and display the selected one; preserve both |
| Maximize/restore | Remember and restore normal geometry where the mode permits |
| Close | Immediately unmount and discard transient state; no confirmation |
| Show Desktop | Minimize every application and navigate to `/` |
| Refresh | Reset session, taskbar, geometry, forms, and scroll; preserve preferences/onboarding |

Refresh on an application URL creates a fresh session with that application open. It does not restore the old session.

## Geometry and route coordination

The reducer stores committed, mode-specific geometry in memory. `WindowInteractionLayer` owns temporary drag/resize values and commits the final geometry at interaction end. Desktop and spacious-tablet values never overwrite each other; missing geometry uses cascade defaults. Hidden applications receive a visibility signal so expensive effects can pause.

Routes, OS commands, and reducers stay separate. Meaningful application navigation creates browser history; ordinary focus changes do not add entries. Direct links bypass boot/welcome and open the requested application. Browser Back after Show Desktop restores the previously routed application through the coordinator.

`react-rnd` must pass the mouse, touch, bounds, mode-transition, and performance prototype before integration. Motion follows stable behavior. Neither dependency is part of P0.

## Later verification

Reducer and geometry tests cover every transition and bounds invariant. Component tests cover controls and focus/activation. Playwright covers direct entry, history, switching, resizing, refresh, and preference persistence. Real iPhone and iPad checks verify safe areas, keyboard behavior, rotation, and touch dragging.
