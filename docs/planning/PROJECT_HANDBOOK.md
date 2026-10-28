# IshpreetOS Project Handbook

> Product, design, engineering, and implementation playbook for IshpreetOS.

| Field | Value |
| --- | --- |
| Owner | Ishpreet Singh |
| Planning baseline | October 16, 2026 |
| Primary release | v1.0 |
| Deferred release | v1.1 |
| Repository | IshpreetOS Next.js application |
| Execution tracker | IshpreetOS Notion board, ordered by Build Order |
| Status | Approved for implementation |

This handbook is the authoritative planning baseline for IshpreetOS. It translates the project-planning conversation into product rules, interaction invariants, design direction, technical architecture, implementation order, and release criteria. It is written for Ishpreet, collaborators, and future AI agents who need to understand the project before changing it.

The designed PDF edition is available at [IshpreetOS Project Handbook](PROJECT_HANDBOOK.pdf).

## How to use this handbook

- Read the Product Vision, Scope, and Non-negotiable Invariants before proposing architecture or UX changes.
- Use the responsive and window-behavior chapters as acceptance criteria, not loose inspiration.
- Use the repository architecture and dependency chapters before adding files or packages.
- Use the Implementation Sequence and Release Gate when selecting the next task.
- Treat items marked **Prototype** or **Validate** as deliberately unresolved. Do not silently convert them into permanent decisions.
- When a future decision changes this baseline, update both the repository documentation and the corresponding Notion task.

> [!IMPORTANT]
> Do not redesign the product from first principles. First identify whether a requested change conflicts with a locked decision, explain the conflict, and ask Ishpreet before changing the governing behavior. Implementation convenience is not sufficient reason to weaken the product model.

### Decision vocabulary

| Label | Meaning |
| --- | --- |
| **Locked** | Approved behavior. Implement it unless Ishpreet explicitly changes the decision. |
| **Prototype** | The direction is approved, but the library or detailed interaction must pass a focused experiment. |
| **Validate** | The principle is approved; exact values require real-device or content testing. |
| **Deferred** | Intentionally excluded from v1. Do not add its packages or scaffolding. |
| **Out of scope** | Not planned. Do not infer it from the operating-system metaphor. |

## Table of contents

1. [Executive brief](#1-executive-brief)
2. [Product principles](#2-product-principles)
3. [Scope and release boundaries](#3-scope-and-release-boundaries)
4. [Information architecture and applications](#4-information-architecture-and-applications)
5. [Responsive environment model](#5-responsive-environment-model)
6. [Desktop and window interaction model](#6-desktop-and-window-interaction-model)
7. [State, lifecycle, and command architecture](#7-state-lifecycle-and-command-architecture)
8. [Routing, history, refresh, and onboarding](#8-routing-history-refresh-and-onboarding)
9. [Visual design system](#9-visual-design-system)
10. [Application specifications](#10-application-specifications)
11. [Content and data architecture](#11-content-and-data-architecture)
12. [External integrations](#12-external-integrations)
13. [Security, privacy, and analytics](#13-security-privacy-and-analytics)
14. [Performance, accessibility baseline, and browser support](#14-performance-accessibility-baseline-and-browser-support)
15. [Technical stack and dependency strategy](#15-technical-stack-and-dependency-strategy)
16. [Repository and module architecture](#16-repository-and-module-architecture)
17. [Testing and quality strategy](#17-testing-and-quality-strategy)
18. [Implementation sequence](#18-implementation-sequence)
19. [Development workflow and ownership](#19-development-workflow-and-ownership)
20. [v1 release gate](#20-v1-release-gate)
21. [Non-negotiable invariants](#21-non-negotiable-invariants)
22. [Prototype and validation register](#22-prototype-and-validation-register)
23. [Instructions for future AI collaborators](#23-instructions-for-future-ai-collaborators)
24. [Appendices](#appendix-a-window-transition-reference)

## 1. Executive brief

IshpreetOS is a portfolio presented as a personal operating system. It should feel recognizably desktop-like without becoming a gimmick or a replica of Windows, macOS, or Linux.

### Product statement

IshpreetOS is a retro-modern web portfolio that lets visitors explore Ishpreet's biography, work experience, projects, settings, watchlist, and recommendation form through an operating-system interaction model. The site should feel deliberate, personal, fast, and technically credible. The OS metaphor is the organizing interface, not an excuse to hide information or make normal web behavior difficult.

### The intended impression

- **Personal:** The operating system, wallpapers, photography, content, and visual voice should clearly belong to Ishpreet.
- **Technical:** Window management, responsive transitions, routing, state, validation, and testing should demonstrate engineering care.
- **Readable:** Portfolio content remains the priority. Retro styling must never make paragraphs harder to consume.
- **Playful but controlled:** The desktop metaphor should invite exploration without excessive animation, sound, or novelty controls.
- **Shareable:** Every meaningful application has a real URL and useful metadata.
- **Fast:** Local content and the desktop appear without waiting for Notion or any other external service.

### Success criteria

- A visitor understands how to explore the site without instructions longer than the welcome message.
- Direct links behave like normal web pages while still opening the correct IshpreetOS application.
- The experience is coherent on an iPhone, iPad, desktop monitor, and resized browser window.
- Application state feels OS-like within a session, while refresh behavior stays predictable and privacy-friendly.
- External integrations enhance the portfolio but can fail without taking down the desktop.
- The repository remains understandable to Ishpreet after time away from the project.

## 2. Product principles

### Inspired, not replicated

The project may reference familiar desktop conventions—cascading windows, taskbar switching, traffic-light controls, layered windows, and a terminal-style welcome—but it must not reproduce another operating system. The name, palette, application structure, wallpapers, interaction details, and written voice should create IshpreetOS as its own product.

### OS behavior with web restraint

- Use OS conventions where they make state and navigation easier to understand.
- Keep browser-native expectations such as real URLs, Back and Forward, safe external links, responsive content, and semantic controls.
- Do not implement desktop features only because real operating systems have them.
- Prefer a small number of deeply finished behaviors over a large number of novelty features.

### One source of truth

- Application definitions live in the application registry.
- Window transitions live in the reducer and command layer.
- Routes and metadata derive from registry data.
- Portfolio content lives in validated Markdown and YAML.
- Persistent preferences live in the preferences system, not window state.
- The Notion board tracks execution; repository documents explain the implementation model.

### Complexity must earn its place

Every dependency, abstraction, animation, and integration must remove meaningful risk or complexity. Experiments that fail are removed fully. Packages are added when their phase begins, not because they may be useful later. There is no reward for keeping unused scaffolding in the repository.

### The visitor controls the experience

- No automatic sound.
- No surprise location request.
- No custom colour picker capable of breaking readability.
- No visitor account or server-side preference profile.
- No forced onboarding for a shared direct link.
- Motion follows the visitor's operating-system preference by default and can be reduced explicitly.

## 3. Scope and release boundaries

### v1.0 committed scope

- Responsive IshpreetOS desktop shell, wallpaper, fixed desktop icon grid, and persistent taskbar.
- Single-instance application model with open, focus, minimize, maximize, restore, close, and stacking behavior where the active mode permits it.
- About, Projects, Experience, and Settings applications.
- First-visit boot sequence and one-time terminal-style welcome.
- Dedicated application routes, browser-history coordination, SEO metadata, sitemap, robots rules, and social previews.
- Validated local Markdown and YAML content.
- Read-only Notion watchlist inside About.
- Protected recommendation form delivered through email, with no submission database.
- Approved appearance preferences, time/date formatting, motion control, privacy information, credits, and welcome replay.
- Anonymous, meaningful analytics and performance monitoring through Vercel.
- Error boundaries, OS-themed recovery, security headers, licence tracking, and cross-device tests.

### v1.1 backlog

- Spotify-only music widget. There is no Last.fm fallback.
- Toronto weather widget powered by Open-Meteo with a one-hour server cache.
- Optional terminal Easter eggs after the basic welcome terminal has proven useful.

No Spotify, weather, or terminal-Easter-egg package, credential, or implementation scaffold belongs in v1. Adapter ideas may be documented, but the code is deferred.

### Explicitly excluded or deferred

- True dark mode. Dark wallpapers and accents are allowed, but application windows remain cream in v1.
- Custom accent colour picker.
- User-uploaded wallpapers.
- Movable desktop icons.
- Multiple instances of the same application.
- Window resizing on touch-first tablet modes.
- Mobile or narrow-tablet window dragging.
- Progressive Web App installation and offline support.
- General contact form. Direct contact remains email and social links; the form is for recommendations only.
- Visitor accounts, cloud-synced settings, or a recommendation database.
- Audio, boot sounds, click sounds, or autoplaying music.
- Sentry and Cloudflare Web Analytics at v1 launch.
- A full advanced accessibility programme during initial development. Baseline semantics, keyboard behavior, focus, contrast, and reduced motion are still required.

## 4. Information architecture and applications

### Core applications

| Application | Route | Purpose | Primary content |
| --- | --- | --- | --- |
| About | `/about` | Personal introduction and visitor connection | Biography, reactive heading, social links, resume, watchlist, recommendation form |
| Projects | `/projects` | Portfolio work | Project cards, status, screenshots, technologies, GitHub, optional live site |
| Experience | `/experience` | Professional history | Timeline entries with role, employer, dates, location, responsibilities, technologies |
| Settings | `/settings` | Local appearance and system preferences | Wallpaper, accent, clock/date, motion, resets, privacy, credits |
| Privacy | `/privacy` | Direct route into Settings privacy content | Analytics, recommendation processing, service providers, no advertising tracking |

### Application instance rule

There is exactly one instance of each application. Activating a desktop icon for an already-open application restores and focuses that existing instance. It never resets the application, opens another copy, or changes its original taskbar position.

### Application registry

- The registry owns the application ID, route, display title, icon key, desktop order, metadata, and whether the app appears on the desktop.
- The component loader map is separate so static metadata does not depend on React implementations.
- The reducer knows application IDs and state only. It does not know routes or component imports.
- Route aliases, including `/privacy`, resolve through registry/navigation configuration.

### No internal content maze

About is one continuous scrolling page. It does not use tabs or carousels. Projects and Experience remain straightforward content applications. Settings may group controls into clear sections, but navigation should not turn into a second miniature operating system inside the window.

## 5. Responsive environment model

### Mode-selection principle

Interaction capability is based on usable desktop space, orientation, viewport height, and pointer capability—not marketing labels for hardware. A large foldable may behave like a tablet; a short coarse-pointer landscape layout remains mobile even if its width is large.

| Mode | Initial heuristic | Visible windows | Move | Resize | Controls |
| --- | --- | ---: | --- | --- | --- |
| Mobile | Under roughly 640px, or short coarse-pointer landscape | One | No | No | Minimize and close |
| Narrow tablet | Roughly 640–899px without enough usable area | One | No | No | Minimize and close |
| Spacious tablet | Roughly 900px and enough usable height, usually touch | Multiple | Yes | No | Minimize, maximize/restore, close |
| Desktop | Roughly 1100px plus fine pointer and sufficient height | Multiple | Yes | Yes | Minimize, maximize/restore, close |

These numeric breakpoints are starting heuristics, not sacred constants. Final thresholds must be tested against usable area, actual window proportions, taskbar height, the iPhone 15 Pro, the iPad Air, foldable emulation, and resized desktop browsers.

### Client initialization

- The server renders the wallpaper, desktop shell, and taskbar structure.
- Windows are not instantiated until the client has measured the environment and chosen a mode.
- The delay should be nearly imperceptible and must not use the artistic boot screen as cover.
- One centralized responsive controller owns mode selection. Components consume the result instead of inventing their own breakpoints.
- Resize, rotation, and virtual-keyboard changes trigger safe recalculation.

### Mobile and narrow tablet

- Only one open application is visible at a time; other open applications stay mounted and appear in the taskbar.
- Selecting another taskbar application hides the current one and displays the selected one.
- The window is a fixed inset surface that fills the usable desktop without covering the taskbar.
- The window is not movable or resizable.
- Rotation recomputes the inset instead of preserving portrait geometry.
- The taskbar may collapse nonessential information while the virtual keyboard is visible.

### Spacious tablet

- Multiple windows may be visible and stacked.
- Windows can be freely dragged within the usable desktop.
- Free resizing is disabled because precision resizing without a cursor is a poor touch experience.
- Focus, minimize, maximize/restore, close, and stacking remain available.

### Desktop

- Multiple windows may be visible, dragged, resized, minimized, maximized, restored, focused, closed, and stacked.
- Maximize fills the usable desktop only. It does not cover the IshpreetOS taskbar, browser chrome, or the visitor's operating-system UI.
- Browser resizing remains smooth and clamps geometry only when required.

## 6. Desktop and window interaction model

### Opening and cascading

- The first window opens near the center of the usable desktop.
- Each newly opened window appears above the previous one, offset approximately 24px down and right.
- The cascade wraps when another offset would leave the usable desktop.
- Applications do not declare different default positions.
- When mode-specific geometry does not exist, the cascade algorithm initializes it.

### Focus and stacking

- Focusing a window brings it to the front without changing its x/y position.
- It may cover other windows completely; that is acceptable.
- Focus changes stacking order only. It never reorders taskbar icons.
- A click on an inactive window both focuses it and activates the clicked control. Visitors do not need a first click only to focus.
- Application and desktop icons use single-click or single-tap activation everywhere.

### Bounds

No part of a window may leave the usable desktop. The title bar, edges, and controls always remain inside the available area. Dragging, resizing, restoring old geometry, orientation changes, and viewport shrinkage all pass through the same bounds rules.

### Geometry by mode

- Desktop stores position and size.
- Spacious tablet stores its own position while using mode-controlled size.
- Mobile and narrow tablet store no window geometry.
- Changing modes selects the target mode's remembered geometry without overwriting another mode's values.
- Geometry is session state only. It is not written to local storage.

### Interaction commit strategy

During live drag or resize, temporary geometry belongs to the interaction layer. The reducer receives the final committed geometry at the end of the interaction. This avoids flooding global state, reduces unnecessary renders, and keeps the reducer's history meaningful.

### Window controls

| Control | Colour | Behavior |
| --- | --- | --- |
| Maximize/restore | Green | Toggle between usable-desktop maximum and remembered normal geometry where the mode permits it |
| Minimize | Yellow | Hide the application while preserving mounted state and taskbar presence |
| Close | Red | Close immediately, remove from taskbar, unmount content, and destroy transient state |

The order is green, yellow, red from left to right on the right side of the title bar. Closing is intentionally immediate. There is no unsaved-form warning; accidental closure is accepted behavior.

### Show Desktop

- The permanent IshpreetOS taskbar button minimizes every open window.
- It does not close applications or reset their state.
- It navigates to the root route.
- Browser Back returns to the previously routed application and restores/focuses it through the routing coordinator.

## 7. State, lifecycle, and command architecture

### State ownership

| State | Owner | Persistence |
| --- | --- | --- |
| Open/minimized/maximized status | Desktop session reducer | Current browser session only |
| Taskbar order | Desktop session reducer | Current browser session only |
| Stacking order | Desktop session reducer | Current browser session only |
| Mode-specific geometry | Desktop session reducer | Current browser session only |
| Live drag/resize geometry | `WindowInteractionLayer` | Only during interaction |
| Application form/scroll/component state | Mounted application component | Until close or refresh |
| Wallpaper, accent, clock/date, motion | Preferences provider | Local storage for that browser |
| Onboarding completion | Preferences/onboarding store | Local storage for that browser |
| Route | Next.js and routing coordinator | Browser history |

### Lifecycle rules

| Event | Application state | Component state | Taskbar |
| --- | --- | --- | --- |
| Open closed app | Open and focused | Newly mounted | Append to right |
| Activate open app | Restore if needed and focus | Preserved | No reorder |
| Minimize | Open and minimized | Mounted and preserved | Remains |
| Mobile switch | Previous hidden; selected visible | Both preserved | No reorder |
| Show Desktop | All open apps minimized | Preserved | No reorder |
| Close | Removed | Unmounted and destroyed | Removed |
| Close then reopen | New open session | Fresh state | Append to right |
| Refresh | All apps closed | Destroyed | Cleared |

### Reducer and commands

- The reducer manages desktop session state only.
- Routing stays outside the reducer.
- Applications call an OS command API rather than dispatching internal action shapes.
- Pure actions, reducer, selectors, cascade, geometry, and bounds functions contain no React code.
- A small development-only logger records commands and resulting state. Production removes it.
- Separate state and action contexts limit unnecessary subscriptions to changing state.

### Mounted but hidden applications

Minimized and mode-hidden applications remain mounted so unfinished form data, scroll positions, and component state survive. They receive a visibility signal so timers, animation, and future Spotify/weather polling can pause while hidden.

## 8. Routing, history, refresh, and onboarding

### Routing model

- The root route represents the bare desktop.
- Application URLs use a registry-driven dynamic route while remaining real, shareable paths.
- A meaningful app opening pushes history.
- A simple focus change uses replace instead of adding history noise.
- The routing coordinator maps route changes into OS commands and meaningful OS navigation into routes.
- The reducer never imports or operates the Next.js router.

### Direct links

A visitor entering `/projects`, `/about`, `/experience`, `/settings`, or `/privacy` goes directly to the desktop with the requested application open. The boot sequence and welcome terminal are bypassed, and onboarding is marked complete. This prioritizes sharing and search intent over theatrical onboarding.

### First root visit

1. Render the desktop shell and complete client environment measurement.
2. Show a brief artistic “Loading IshpreetOS” boot sequence that is not tied to real network loading.
3. Enter the desktop.
4. Open the concise terminal-style welcome window.
5. When the welcome closes, leave the visitor on the normal desktop.
6. Persist onboarding completion locally so normal return visits skip both pieces.

### Replay behavior

Settings includes **Replay Welcome** as an explicit action. Replaying onboarding does not reset appearance settings. **Reset Appearance** does not replay onboarding. These are separate commands because they represent different visitor intent.

### Refresh semantics

- Close every open application.
- Destroy unfinished recommendation-form input and all other transient application state.
- Clear taskbar and window geometry.
- Preserve preferences and onboarding completion.
- On a direct application URL, rebuild a fresh session with that application open.

### 404 and crash recovery

- Unknown routes use a themed IshpreetOS application-not-found presentation while retaining correct HTTP 404 semantics.
- Serious rendering failures use a compact recovery screen rather than a conventional unrelated error page.
- Production error UI never exposes stack traces, tokens, or raw provider responses.

## 9. Visual design system

### Design direction

The visual language is visibly retro and OS-inspired, but the content interiors remain modern and spacious enough for a portfolio. The browser should feel like Ishpreet's operating system, not like a reskinned copy of a historic desktop.

### Colour system

| Role | Decision |
| --- | --- |
| Application surface | Warm off-white cream; never pure white |
| Body text | Pure black for strong readability |
| Default accent | XP-inspired blue |
| Approved accents | Blue, green, purple, orange, and pink |
| Destructive/control red | Reserved for close, errors, and fixed status semantics |
| Alternative warm signal | Pink may replace red when a decorative accent is needed |
| Inactive treatment | Subtle gray veil, softened border, and muted shadow |
| Active treatment | Accent border, stronger shadow, and no gray veil |

Exact colour values require prototype testing for contrast across wallpapers. Visitors choose only from pre-approved accents so the site cannot be configured into an unreadable state.

### Typography

- Desktop and OS chrome use an easy-to-read pixel-style font.
- Application headings may use the pixel font selectively.
- Application body content uses a Times-like open-source serif, self-hosted through `next/font/local`.
- Terminal content uses an authentic terminal-style monospace font.
- Long paragraphs never receive reactive distortion or pixel typography.
- All font files are self-hosted for consistent rendering and fewer external requests.

### Window appearance

- Rounded retro-modern shape inspired by compact macOS-style windows.
- The cream title bar continues into the cream application surface instead of becoming a solid blue strip.
- An accent border communicates customization and active state.
- The application icon and pixel title appear on the left; controls appear on the right.
- The title bar remains fixed while the application content region scrolls.

### Icons

- Desktop application icons come from one cohesive classic pixel-art computer icon family.
- Do not mix multiple pixel-art families.
- Lucide remains available for small internal controls where a pixel icon would reduce clarity.
- Every icon and pack must be publicly licensed for the intended use and listed in credits.

### Wallpapers and imagery

- Use nostalgic landscapes, abstract XP-style imagery, and selected personal photography.
- Do not use minimalist pattern wallpapers.
- No visitor wallpaper upload in v1.
- Store all selectable wallpapers together, regardless of whether they are third-party art or personal photography.
- Strip EXIF and location metadata from personal photographs.
- Record focal-point metadata so responsive cropping preserves the subject.

### Density

The desktop should feel like a real computer without becoming crowded. Application interiors use medium density: enough whitespace for a modern portfolio, enough visible structure to preserve the OS illusion, and no oversized marketing-site spacing that wastes the window.

### Motion

- Motion is restrained and functional, never bouncy or toy-like.
- CSS handles hover, focus, colour, shadow, tooltip, and wallpaper fades.
- Motion may be added only after window interaction is stable, for open, close, minimize, restore, and maximize transitions.
- Live dragging and resizing do not use the animation library.
- Wallpaper changes crossfade instead of flashing.
- **System** is the default motion setting; visitors may explicitly choose **Standard** or **Reduced**.

## 10. Application specifications

### About

- One continuous scrolling document with no tabs or carousel.
- A reactive heading or short phrase may move around the pointer; paragraphs remain stable.
- Biography content comes from validated Markdown and uses the serif body font.
- Social links, email, and resume are explicit actions.
- The watchlist appears as a simple list: title, media type, and status only.
- The recommendation form follows the watchlist in the natural document flow.
- No general-purpose contact form is added.
- Minimizing preserves scroll and unfinished input; closing destroys both immediately.

### Projects

- Each project comes from its own Markdown file.
- Cards include name, description, status, completion date where applicable, technologies, and a screenshot.
- The entire card is not clickable.
- Use explicit **GitHub** and optional **Live Site** buttons.
- Completed and in-progress states use approved treatments and must not rely only on colour.
- Technology tags are a prototype detail; simplify them if they make cards noisy.

### Experience

- Each position comes from its own Markdown file.
- Entries include company, role, location, start/end dates, responsibilities, and technologies.
- Spacious layouts use a vertical timeline showing when each position began and ended.
- Mobile uses a straightforward stacked presentation.
- The timeline should communicate chronology without becoming a decorative infographic.

### Settings

- Wallpaper preset selection.
- Approved accent selection.
- 12-hour or 24-hour clock.
- Automatic, month-first, or day-first date format.
- System, Standard, or Reduced motion.
- Reset Appearance and Replay Welcome as separate actions.
- Privacy explanation and asset credits.
- No true dark mode, custom colour picker, font picker, or uploaded wallpaper.

### Taskbar date and time

- Use the visitor's local time; this requires no location permission or cookies.
- Do not display seconds.
- Date formatting follows the stored preference.
- When space is constrained, abbreviate or hide the date before harming application switching.

## 11. Content and data architecture

### Content-source layout

```text
content/
|-- profile.md
|-- site.yaml
|-- credits.yaml
|-- experience/
|   |-- position-one.md
|   `-- position-two.md
`-- projects/
    |-- ishpreetos.md
    `-- another-project.md
```

### Content ownership

| Source | Owns |
| --- | --- |
| `site.yaml` | Site title, description, public location, email, social links, resume URL, and default SEO fields |
| `profile.md` | Biography heading, short introduction, and long-form personal content |
| `experience/*.md` | One validated professional position per file |
| `projects/*.md` | One validated project per file |
| `credits.yaml` | Asset name, creator, source, licence, usage, and required attribution |
| Notion data source | Watchlist title, media type, and status only |

### Validation

- Zod is the single validation system for content, environment variables, forms, settings loaded from storage, and external API payloads.
- Types are inferred from schemas instead of repeated manually.
- Invalid local content fails loudly during development and build.
- Malformed external data becomes a controlled unavailable result instead of crashing the desktop.
- Markdown uses `gray-matter`, `react-markdown`, and `remark-gfm`, with no raw HTML or MDX.

### Loading strategy

- All small local content loads and validates on the server when the desktop is prepared.
- Typed serializable view data is passed into application renderers.
- Local content does not require a browser fetch for each application opening.
- Application UI code may still load separately.
- External integrations remain lazy and cannot block desktop display.

## 12. External integrations

### Integration boundaries

Server integrations are organized by capability, not provider. The rest of IshpreetOS asks for a watchlist or sends a recommendation; it does not depend directly on Notion, Resend, Turnstile, or Upstash APIs. Provider-specific adapters remain replaceable.

### Notion watchlist — v1

- Use a read-only internal integration shared only with the watchlist data source.
- Keep the token server-only.
- Map provider responses into a local `WatchItem` schema.
- Show title, media type, and planned/in-progress/completed status only.
- Do not include a poster, artwork, rating, synopsis, or external information link.
- Cache for six hours.
- Keep freshness invisible unless the integration is unavailable.
- Use cached data when possible; otherwise show a compact, retryable unavailable state.

### Recommendation email — v1

| Field | Requirement |
| --- | --- |
| Name | Optional |
| Email | Optional |
| Media type | Required: movie, television show, or book |
| Media name | Required |

- Use a Next.js Server Action and typed action result.
- Validate with Zod on the server.
- Protect with a honeypot, realistic minimum completion time, Turnstile verification, and Upstash rate limiting.
- Deliver through Resend to a server-configured personal inbox.
- Do not create a submission database or automatic confirmation email.
- Local development logs a sanitized preview. Previews use test keys and test recipients; only production reaches the real inbox.
- Never place form contents, email addresses, or names in analytics or routine logs.

### Spotify — v1.1

- Spotify only; do not revive the Last.fm fallback.
- Use a server-side authorization-code flow for private user data.
- Keep credentials and refresh tokens server-only.
- Plan for periodic manual reauthorization.
- Poll only while visible and use a short shared server cache.
- Revisit the interface and design before implementation because it is intentionally deferred.

### Weather — v1.1

- Use Open-Meteo through standard server-side `fetch`.
- Use fixed Toronto coordinates.
- Never request visitor geolocation.
- Cache for one hour.
- Use locally controlled weather icons.
- A provider failure affects the widget only.

### Caching

| Resource | Server cache | Client behavior |
| --- | --- | --- |
| Notion watchlist | 6 hours | No recurring client polling |
| Toronto weather | 1 hour | Check when the relevant widget opens and occasionally while visible |
| Spotify playback | Approximately 15–30 seconds | Poll the IshpreetOS route every 30–60 seconds only while visible |
| Spotify recent history | Several minutes | Refresh on open or focus |

Next.js server caching plus small purpose-built hooks is sufficient. Do not add SWR or TanStack Query unless later requirements introduce many live resources, mutations, optimistic updates, authentication, or offline behavior.

## 13. Security, privacy, and analytics

### Privacy position

- No visitor account.
- No advertising or cross-site tracking.
- No cookie-based settings; local storage is sufficient.
- No recommendation-submission database.
- No location request for time or weather.
- The Settings privacy section explains analytics, optional submitted contact data, service providers, and processing behavior in plain language.

### Analytics

- Use Vercel Web Analytics for anonymous page views and approved custom events.
- Use Vercel Speed Insights for Core Web Vitals.
- Track meaningful events only: application opens, external project links, and submission success/failure categories where no personal data is attached.
- Do not track raw form data, email addresses, names, window geometry, pointer paths, or every focus change.
- Do not add Cloudflare Web Analytics at launch because it duplicates Vercel and does not provide the required custom-event model.
- Do not add Sentry until production diagnosis demonstrates a need.

### Cloudflare usage

Cloudflare Turnstile is approved for the recommendation form and works independently of Cloudflare proxying. The full Cloudflare reverse proxy/CDN should not be placed in front of Vercel because it adds overlapping caching, reduces platform traffic visibility, and complicates reliability. Cloudflare DNS can be evaluated separately during deployment if the domain already uses it.

### Security controls

- Zod validation at every untrusted boundary.
- Server-only modules for credentials and provider clients.
- Turnstile token verification on the server.
- Upstash rate limiting for the recommendation action.
- Honeypot and completion-time checks as additional bot signals.
- Strict Content Security Policy with explicit provider allowances.
- HSTS, `nosniff`, Referrer Policy, and a restrained Permissions Policy.
- `noopener` and appropriate `noreferrer` behavior for external tabs.
- No raw HTML in Markdown.

## 14. Performance, accessibility baseline, and browser support

### Performance principles

- Render the desktop before slow external integrations.
- Avoid layout shifts as applications or integrations load.
- Use responsive images and optimize personal photography.
- Keep drag and resize updates local to the interaction layer.
- Pause hidden-application effects and future widget polling.
- Use code splitting for application UI where it provides measurable value.
- Remove visual elements or dependencies that cannot meet the performance target.
- Audit the production bundle and unused dependencies before release.

### Accessibility baseline

A comprehensive accessibility programme is deferred, but basic quality is not optional. Every interactive element uses a semantic button or link, visible focus, sufficient contrast, understandable labels or tooltips, and keyboard-reachable controls. Reduced motion is supported from the beginning. Status never relies on colour alone.

### Browser support

- Current Chrome and Edge on desktop.
- Current Firefox on desktop.
- Current Safari on iPhone and iPad.
- Current mainstream Android Chromium through emulation and a real-device smoke test when available.
- Internet Explorer and obsolete browsers are not supported.

### Physical test inventory

- Windows PC with two 27-inch 1440p displays at 165Hz and 144Hz.
- iPhone 15 Pro for real mobile Safari, safe areas, landscape, and virtual-keyboard behavior.
- iPad Air fifth generation with M1 for real touch and tablet layouts.
- Playwright emulation for Android, folding-phone dimensions, and lower-resolution laptops.

## 15. Technical stack and dependency strategy

### Existing foundation

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI runtime | React 19 |
| Language | TypeScript in strict mode |
| Styling | Tailwind CSS 4, CSS variables, narrow CSS Modules |
| Primitives | shadcn/Base UI |
| Internal icons | Lucide |
| Unit/component tests | Vitest and Testing Library |
| End-to-end tests | Playwright |
| Hosting | Vercel |
| Package manager | pnpm |

### Approved additions

| Dependency | When | Purpose |
| --- | --- | --- |
| `zod` | Foundation | Runtime schemas and inferred types |
| `gray-matter` | Content foundation | Markdown frontmatter |
| `react-markdown` | Content foundation | Safe Markdown rendering |
| `remark-gfm` | Content foundation | Tables and task lists |
| `yaml` | Content foundation | `site.yaml` and `credits.yaml` |
| `react-rnd` | Only after prototype passes | Desktop drag/resize base behind `WindowInteractionLayer` |
| Motion | After stable window behavior | Window lifecycle and layout transitions |
| Resend | Integration phase | Recommendation email delivery |
| Upstash rate limit/Redis | Integration phase | Shared serverless rate limiting |
| Provider-specific Notion support | Integration phase | Read-only watchlist adapter; prefer a minimal surface |

### Dependency rules

- Add packages just in time for the phase that uses them.
- Wrap replaceable third-party libraries behind project-owned modules.
- Prefer platform APIs and standard `fetch` when a provider SDK offers little value.
- Remove a failed experiment fully, including its package, configuration, types, and dead adapter code.
- Do not retain libraries for hypothetical future work.
- Do not add Redux, Zustand, SWR, TanStack Query, a CSS-in-JS runtime, or a global animation framework without a newly demonstrated need.

### `react-rnd` prototype gate

- Mouse drag and resize.
- Touch drag on iPad.
- Strict bounds and taskbar exclusion.
- Controlled temporary geometry with final commit.
- Maximize/restore and responsive-mode transitions.
- Multiple overlapping windows at an acceptable frame rate.

## 16. Repository and module architecture

```text
IshpreetOS/
|-- content/
|   |-- profile.md
|   |-- site.yaml
|   |-- credits.yaml
|   |-- experience/
|   `-- projects/
|-- docs/
|   |-- README.md
|   |-- planning/
|   |   |-- PROJECT_HANDBOOK.md
|   |   |-- PROJECT_HANDBOOK.pdf
|   |   `-- rough-design-reference.pdf
|   |-- architecture.md
|   |-- window-behavior.md
|   |-- content-model.md
|   `-- testing.md
|-- public/
|   |-- icons/
|   |-- wallpapers/
|   `-- images/
|       |-- profile/
|       `-- projects/
|-- src/
|   |-- app/
|   |   |-- (desktop)/
|   |   |   |-- layout.tsx
|   |   |   |-- page.tsx
|   |   |   `-- [appId]/page.tsx
|   |   |-- api/
|   |   |-- global-error.tsx
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- not-found.tsx
|   |-- apps/
|   |   |-- about/
|   |   |-- projects/
|   |   |-- experience/
|   |   `-- settings/
|   |-- os/
|   |   |-- app-registry/
|   |   |-- desktop/
|   |   |-- onboarding/
|   |   |-- preferences/
|   |   |-- responsive/
|   |   |-- routing/
|   |   |-- taskbar/
|   |   `-- window-manager/
|   |-- server/
|   |   |-- actions/
|   |   |-- content/
|   |   |-- env/
|   |   `-- integrations/
|   |       |-- recommendations/
|   |       `-- watchlist/
|   |-- components/
|   |   |-- shared/
|   |   `-- ui/
|   |-- assets/fonts/
|   |-- hooks/
|   |-- lib/
|   |-- styles/
|   `-- test/
`-- e2e/
```

### Module responsibilities

- `src/os` contains operating-system mechanics and presentation.
- `src/apps` contains portfolio applications running inside the OS.
- `src/server` contains secret-bearing integrations, environment validation, server actions, and content loaders.
- `src/components/ui` contains foundational primitives only.
- `src/components/shared` contains genuinely cross-application presentation components.
- Feature-specific components stay beside their owner.
- `src/lib` remains small and generic; it is not a dumping ground.

### Provider composition

```text
IshpreetOSProviders
|-- PreferencesProvider
|-- ResponsiveModeProvider
|-- DesktopSessionProvider
`-- RoutingCoordinator
```

The wrapper is convenient, but the providers remain independent. A clock-format change must not run the window reducer; a focus change must not rewrite preferences.

### Import rules

- Keep the existing `@/*` path alias.
- Use named exports for normal modules; use default exports only where Next.js requires them.
- Avoid giant barrel files. A small `index.ts` is allowed only as an intentional public module boundary.
- Applications may call the OS command API but may not import reducer internals.
- Client code may not import from `@/server`.
- Applications may not import directly from one another; promote truly shared code deliberately.

### Styling ownership

- `tokens.css` owns reusable design values.
- `base.css` owns document-level defaults.
- `typography.css` owns font roles and readable defaults.
- `motion.css` owns shared motion variables and reduced-motion rules.
- `globals.css` imports the system and Tailwind.
- Tailwind handles normal component layout; narrowly scoped CSS Modules handle complex geometry or effects.
- Do not introduce CSS-in-JS or repeated arbitrary hex values in applications.

## 17. Testing and quality strategy

### Test placement

- Unit and component tests live beside the module they verify.
- Shared factories, fixtures, and setup stay in `src/test`.
- Full browser journeys stay in the root `e2e` directory.
- Every phase includes its tests; a later testing phase does not excuse missing earlier coverage.

### Unit-test priorities

- Reducer branches and invalid transitions.
- Taskbar and stacking invariants.
- Cascade, wrapping, clamping, and mode-specific geometry.
- Responsive-mode selection.
- Registry and route lookup.
- Content, environment, form, settings, and provider schemas.
- Integration mapping and failure results.

### Component-test priorities

- Window controls and focus-and-activate behavior.
- Taskbar switching and Show Desktop.
- Settings persistence and reset separation.
- Project link variants and status semantics.
- Recommendation-form states.
- Watchlist success, empty, and unavailable states.

### Playwright journeys

- Fresh root visit with boot and welcome.
- Returning root visit without boot.
- Direct route that bypasses onboarding.
- Open, focus, minimize, restore, maximize, close, and reopen.
- Home/Show Desktop plus browser Back.
- Mobile one-visible-application switching.
- Tablet touch dragging.
- Desktop resizing and bounds.
- Refresh wipes the session but preserves settings.
- Protected recommendation success and failure paths with mocked providers.

### Coverage philosophy

Do not chase an arbitrary whole-project percentage. Require complete branch coverage for reducer and geometry utilities because they define core invariants. Judge UI coverage through critical scenarios and regression value.

### Universal phase gate

- The phase objective is demonstrably complete.
- Relevant automated tests pass.
- Lint, type checking, and production build pass.
- Required manual device checks pass.
- Documentation reflects the implemented behavior.
- No unused dependency or abandoned experiment remains.
- No unresolved critical or high-severity defect is carried into the next phase.

## 18. Implementation sequence

| Phase | Name | Outcome |
| ---: | --- | --- |
| 0 | Guardrails | Repository architecture, documentation, CI, environment validation, starter cleanup, and initial content dependencies |
| 1 | Contracts | Application registry, loader map, Zod schemas, Markdown/YAML loaders, environment contracts, and representative fixtures |
| 2 | OS Core | Pure reducer, commands, selectors, taskbar/stack rules, geometry, cascade, bounds, and mode transitions |
| 3 | Desktop Shell | Client measurement, responsive controller, providers, persistence, fonts/tokens, wallpaper, icon grid, taskbar, and placeholder windows |
| 4 | Routing and Onboarding | Dynamic application route, metadata, history coordination, direct links, Home behavior, boot, welcome, and 404 recovery |
| 5 | Window Interaction | `react-rnd` spike, `WindowInteractionLayer`, desktop drag/resize, tablet touch drag, bounds, and real-device validation |
| 6 | Visual System | Final window treatments, typography, accents, focus veil, wallpaper selection, Motion, and reduced-motion behavior |
| 7 | Applications | About first, then Projects, Experience, and Settings/Privacy; external integration areas remain placeholders |
| 8 | Integrations | Notion watchlist plus protected Turnstile/Upstash/Resend recommendation delivery |
| 9 | Shipping Surface | SEO, social previews, analytics, recovery, licences, privacy, CSP, and security headers |
| 10 | Release | Cross-device QA, browser matrix, performance, bundle audit, dependency cleanup, production deployment, and smoke test |

### Application order

About may be the first fully designed application because it is the area Ishpreet is most excited to build. That choice does not pull its integrations forward: Notion and recommendation delivery remain Phase 8. Projects and Experience follow. Settings functionality is introduced as needed for foundation testing and completed during the application phase.

### Content parallel track

- Biography and social links.
- Experience entries.
- Project descriptions and screenshots.
- Wallpaper and personal-photography selection.
- Icon-family and font evaluation.
- Asset-licence bookkeeping.

Structural placeholders are allowed through the foundation and OS phases. No placeholder may survive the completion gate of its application or the final release.

### Timeline policy

There is no fixed launch date. A realistic timeline will be estimated only after the responsive shell and `react-rnd` prototype are complete because they represent the main technical uncertainty. Quality and phase confidence take priority over forcing a one-month schedule.

## 19. Development workflow and ownership

### Learning-first ownership

| Owner | Primary work |
| --- | --- |
| Ishpreet leads | Portfolio content, application interiors, project cards, experience timeline, settings controls, visual styling, straightforward component tests, and later Zod schemas with guidance |
| Build together | Registry, content loaders, reducer, actions, responsive controller, preferences, routing behavior, lifecycle, and Playwright journeys |
| AI drafts implementation under Ishpreet's direction and review | Geometry edge cases, `WindowInteractionLayer`, route synchronization, server-only integration boundaries, protected email flow, CI, and production hardening |

This table describes planned implementation assistance. Ishpreet writes code, directs delegated work, reviews and verifies AI-generated changes, and retains technical decisions and merge approval. The division of coding work can change as the project develops.

### Branch workflow

- Use short-lived feature branches with one coherent purpose.
- Include tests and documentation in the same branch as the behavior.
- Use pull requests and Vercel previews even as a solo developer.
- Merge a dependency phase before beginning work that deeply relies on it.
- Do not use a month-long development branch.
- Do not mark a Notion task **In Progress** until implementation actually begins.
- Do not mark a task **Done** until its acceptance criteria and phase gate pass.

### Planning and execution sources

- This handbook records the approved product and implementation baseline.
- Repository documentation evolves with implemented architecture.
- The Notion board records status, phase, build order, priority, release, type, acceptance criteria, and dependencies.
- Code and tests are the final evidence of implemented behavior.

## 20. v1 release gate

- [ ] All four core applications are complete with final content.
- [ ] Routing, direct links, browser history, and refresh behavior are complete.
- [ ] Mobile, narrow-tablet, spacious-tablet, and desktop window behavior is verified.
- [ ] Boot, welcome, direct-entry bypass, replay, and onboarding persistence are verified.
- [ ] Settings persistence, privacy, and reset separation are complete.
- [ ] Local-content schemas and build-time validation pass.
- [ ] The Notion watchlist succeeds and fails gracefully.
- [ ] The recommendation form is protected and sends only from production to the real inbox.
- [ ] Metadata, canonical URLs, sitemap, robots rules, and Open Graph images are complete.
- [ ] Credits and asset licensing are complete.
- [ ] Approved anonymous analytics and Speed Insights are operating.
- [ ] Security headers and Content Security Policy are verified in production.
- [ ] Critical unit, component, and Playwright tests pass.
- [ ] Supported browsers and physical devices pass manual smoke tests.
- [ ] Performance targets are met and no external provider blocks desktop loading.
- [ ] No known critical or high-severity defect remains.
- [ ] No v1.1 package, unfinished placeholder, or abandoned dependency ships.

> [!NOTE]
> A page that looks finished is not automatically finished. A phase or feature is complete only when its tests, documentation, failure behavior, and relevant device checks are also complete.

## 21. Non-negotiable invariants

1. One application instance per `AppId`.
2. Opening an existing application restores and focuses it; it never creates a second instance.
3. Taskbar order is initial-open order and does not change on focus.
4. Closing removes the application; reopening appends it.
5. Stacking order is independent from taskbar order.
6. No window edge may leave the usable desktop.
7. Mobile and narrow tablet show one fixed, non-movable, non-resizable window.
8. Spacious tablet supports multiple draggable windows without resizing.
9. Desktop supports multiple draggable and resizable windows.
10. Maximize fills the usable IshpreetOS desktop and keeps the taskbar visible.
11. Minimized and hidden applications stay mounted; closed applications unmount.
12. Window geometry is session-only and mode-specific.
13. Preferences persist locally per browser and never change the site for other visitors.
14. Refresh resets the desktop session but preserves preferences and onboarding.
15. Direct application routes bypass boot and welcome.
16. Focus does not add browser-history noise.
17. External services cannot block or crash the desktop.
18. Raw HTML is disabled in Markdown.
19. Application body text is pure black on cream.
20. No automatic sound.
21. No visitor location request.
22. No personal form content in analytics or logs.
23. No v1.1 dependencies in v1.

## 22. Prototype and validation register

| Item | Approved direction | What remains to validate |
| --- | --- | --- |
| Responsive thresholds | Four capability-based modes | Exact width/height and pointer thresholds on target devices |
| Default window size | Shared percentage-based geometry | Exact proportions and cascade offsets in prototypes |
| `react-rnd` | Preferred interaction base behind wrapper | Touch, bounds, mode transitions, performance, and controlled-state behavior |
| Motion | Add after stable behavior | Exact duration/easing and whether every planned transition earns its cost |
| Serif font | Open-source Times-like local font | Exact family after visual and readability comparison |
| Pixel font | Readable local pixel-style font | Exact family and small-size legibility |
| Icon pack | One coherent publicly licensed pixel family | Exact pack and coverage for all applications |
| Accent values | Blue, green, purple, orange, and pink | Exact tokens and contrast across wallpapers |
| Technology tags | Allowed if visually useful | Density and wrapping inside resized project windows |
| Reactive About heading | Heading or short phrase only | Performance, pointer behavior, and reduced-motion alternative |
| Spotify design | Server adapter in v1.1 | Revisit interface and data presentation when implementation starts |

## 23. Instructions for future AI collaborators

### Before changing code

1. Read this handbook and the repository architecture documents.
2. Inspect the current Notion task and its acceptance criteria.
3. Inspect the repository instead of assuming the starter structure still applies.
4. Identify the current responsive-mode, lifecycle, routing, and persistence implications of the change.
5. Check whether the requested work belongs to v1 or v1.1.
6. Check the dependency policy before installing a package.

### While implementing

- Preserve separation among routes, OS domain, React providers, application components, server integrations, and local content.
- Keep core state transitions and geometry pure and testable.
- Use project-owned wrappers for replaceable third-party behavior.
- Add tests with the behavior, not afterward.
- Do not silently broaden scope because an API or component makes an extra feature easy.
- Do not write secrets, private email addresses, or provider tokens into source, tests, analytics, or documentation.
- Keep placeholders explicit and remove them before the relevant completion gate.

### When a decision appears inconsistent

- Prefer the newest explicit decision over old Notion wording or starter code.
- Preserve the user's intent, not accidental phrasing or typos.
- Explain the concrete conflict and its user or technical impact.
- Recommend a resolution and ask Ishpreet when changing the product model would be required.
- Do not treat implementation difficulty as authorization to remove a feature.

### When finishing a task

- Run the task's automated and manual checks.
- Update repository documentation for material architecture behavior.
- Update the Notion status only when the documented acceptance criteria pass.
- Report remaining risks, deferred work, and any dependency added or removed.
- Do not declare a phase complete while critical defects, missing tests, or missing documentation remain.

## Appendix A. Window transition reference

| Current state | Command | Result |
| --- | --- | --- |
| Closed | Open | Create one instance, append taskbar, initialize target-mode geometry, focus |
| Open and visible | Activate desktop icon | Focus existing instance; no reset or duplicate |
| Open and behind | Click window/control | Raise and activate the clicked control in one action |
| Open and visible | Minimize | Hide, preserve component, retain taskbar position |
| Minimized | Activate taskbar | Restore and focus |
| Normal | Maximize | Remember normal geometry and fill usable desktop |
| Maximized | Restore | Return to valid remembered normal geometry |
| Any open | Close | Unmount, remove from orders, destroy transient state |
| Any mix | Show Desktop | Minimize every open application and route to root |
| Mobile visible A | Activate open B | Hide A, show/focus B, preserve both |
| Any | Viewport mode change | Select/recalculate target-mode geometry without overwriting other modes |
| Any | Refresh | Clear session; rebuild from current route; preserve preferences/onboarding |

## Appendix B. Notion build order

| Order | Phase | Task |
| ---: | ---: | --- |
| 1 | 0 | Foundation: repository architecture, documentation, and CI |
| 2 | 1 | Foundation: application registry and content contracts |
| 3 | 1 | Content: final portfolio copy and licensed assets |
| 4 | 2 | Core: window-state reducer and session rules |
| 5 | 2 | Core: geometry, cascade, bounds, and mode transitions |
| 6 | 3 | Shell: responsive modes and client initialization |
| 7 | 3 | Shell: providers, preferences, and persistence |
| 8 | 3 | Shell: desktop, icon grid, and taskbar |
| 9 | 4 | Routing: application routes, browser history, and direct-link entry |
| 10 | 4 | Onboarding: first-visit boot sequence |
| 11 | 4 | Onboarding: welcome terminal window |
| 12 | 5 | Windows: `WindowFrame` and interaction adapter |
| 13 | 5 | Test: window manager and responsive interactions |
| 14 | 6 | Design: visual system and motion |
| 15 | 7 | App: About |
| 16 | 7 | App: Projects |
| 17 | 7 | App: Experience |
| 18 | 7 | App: Settings and Privacy |
| 19 | 8 | Integration: Notion watchlist |
| 20 | 8 | Integration: protected recommendation submission |
| 21 | 9 | Shipping: SEO, recovery, sharing, and analytics |
| 22 | 9 | Shipping: licensing, privacy, and security headers |
| 23 | 10 | Release: cross-device QA and production deployment |
| 101 | v1.1 | Spotify music widget |
| 102 | v1.1 | Toronto weather widget |
| 103 | v1.1 | Terminal Easter eggs |

## Appendix C. Technical reference links

- [Next.js forms and Server Actions](https://nextjs.org/docs/app/guides/forms)
- [Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Next.js server fetch caching](https://nextjs.org/docs/app/api-reference/functions/fetch)
- [`react-rnd`](https://github.com/bokuweb/react-rnd)
- [Motion for React](https://motion.dev/docs/react)
- [Zod](https://zod.dev/)
- [Notion integrations](https://www.notion.com/help/create-integrations-with-the-notion-api)
- [Resend with Next.js](https://resend.com/nextjs)
- [Upstash rate limiting](https://upstash.com/docs/redis/sdks/ratelimit-ts/overview)
- [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/get-started/)
- [Spotify authorization](https://developer.spotify.com/documentation/web-api/concepts/authorization)
- [Open-Meteo](https://open-meteo.com/)
- [Vercel Web Analytics](https://vercel.com/docs/analytics)
- [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- [Vercel guidance on Cloudflare proxying](https://vercel.com/kb/guide/cloudflare-with-vercel)

## Appendix D. Glossary

| Term | Definition |
| --- | --- |
| Usable desktop | Viewport area remaining after reserving the IshpreetOS taskbar and any required safe areas |
| `AppId` | Stable registry identifier for one application type |
| Desktop session | Transient open-window, taskbar, stack, and geometry state that resets on refresh |
| Preference | Per-browser local setting that survives refresh and return visits |
| Geometry | A window's position and, where applicable, size within a specific responsive mode |
| Focus | The application that receives interaction and appears at the top of the stack |
| Meaningful opening | A route-worthy application navigation, unlike a simple z-order focus change |
| Direct entry | A first page load on an application route instead of the root desktop |
| Capability-first integration | Internal service interface organized around a need such as watchlist or recommendations, not around a vendor |
| Phase gate | Tests, documentation, manual checks, and defect threshold required before dependent work begins |

---

Build IshpreetOS carefully enough that its complexity feels intentional to visitors and understandable to its owner. The operating-system illusion should come from consistent rules, not visual imitation alone.
