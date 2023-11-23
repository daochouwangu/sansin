import { atom } from "jotai"
const b = `
---
title: 362
editors:
  - TimLi
description:
---

[![](https://res.cloudinary.com/cpress/image/upload/w_1280,e_sharpen:60,q_auto/lstz0pyrawdx0wnhitao.jpg)](https://react-datasheet-grid.netlify.app/)

## 🔥 本周热门

**[Datasheet Grid: An Airtable-like Grid Component](https://react-datasheet-grid.netlify.app/ "react-datasheet-grid.netlify.app")** — If you’ve got an array of objects and you want a way for users to manipulate them, this is for you. It’s not going to replace a spreadsheet or an extensive data grid framework, but it’s a good, mature solution for modest use cases and features smooth animations, virtualized rows and columns, keyboard navigation, and more.

Nicolas Keller

**[Moving Back to React (from Preact)](https://daily.dev/blog/moving-back-to-react "daily.dev")** — Preact felt like a logical, lightweight choice to this team at one time, but they’ve switched to React for better compatibility with Next.js, among other things. Their page weight is up slightly, but they feel the tradeoff is worth it.

Ante Barić (Daily․Dev)

[![](https://copm.s3.amazonaws.com/96a0fcb7.png)](https://frontendmasters.com/courses/javascript-cpu-vm/?utm_source=email&utm_medium=reactstatus&utm_content=javascriptcpu)

**▶ [Simplifying Server Components](https://portal.gitnation.org/contents/simplifying-server-components "portal.gitnation.org")** — In a talk given at the recent _React Advanced_ conference, Mark boiled down one of the newest, and perhaps most controversial, React features. A good, straightforward explanation of the parts involved and how they fit together.

Mark Dalgleish

**快讯：**

- 👾 The winners of the recent _React Jam_ game development contest [have been revealed.](https://reactjam.com/winners-fall-2023) Can you play the entries? You sure can. A particularly interesting entry is [useChess,](https://use-chess.fall-2023.reactjam.com/) a series of chess-based puzzles.

- [Netlify Blobs](https://www.netlify.com/blog/introducing-netlify-blobs-beta/) (now in beta) is a new general purpose data store built into Netlify's platform.

- Adobe's [React Aria Components](https://react-spectrum.adobe.com/react-aria/index.html) have now [moved from beta to RC.](https://react-spectrum.adobe.com/releases/2023-11-8.html)

[My Journey to 3x Faster Builds: Trimming Barrel File Imports](https://blog.vramana.com/posts/barrel_files_slow_build/ "blog.vramana.com") — _“I maintain a small frontend application (4K LOC) which uses Vite as the compiler. The production build, using npm run build, was taking 26 secs on Github Actions. It seemed awfully slow for such a small application. I decided to investigate why.”_

Ramana Venkata

▶  [Next.js v14: You Missed The Best Part](https://www.youtube.com/watch?v=xoVpFAXBats "www.youtube.com") — _“Can we turn React components into self-contained Lego blocks that talk to backend services? Let’s find out!”_ (15 minutes)

Jack Herrington

[Enforcing Coding Style with the Vercel Style Guide](https://mwskwong.com/blog/enforcing-coding-style-with-vercel-style-guide "mwskwong.com") — Vercel provides [a set of configs](https://github.com/vercel/style-guide) for Prettier, ESLint and TypeScript. Here’s how one developer uses them in his Next.js project.

Matthew Kwong

▶  [Why Signals Are Better Than React Hooks](https://www.youtube.com/watch?v=SO8lBVWF2Y8)
Web Dev Simplified

[React Router v6: A Beginner's Guide](https://www.sitepoint.com/react-router-complete-guide/)
James Hibbard

## 🛠  代码与工具

[![](https://res.cloudinary.com/cpress/image/upload/w_1280,e_sharpen:60,q_auto/drjdanyfnfno52s0xyn0.jpg)](https://lisandro52.github.io/react-winplaza-98/)

[**React Winplaza 98: The Windows 98 Aesthetic for React**](https://lisandro52.github.io/react-winplaza-98/ "lisandro52.github.io")** — Does the fantastic [React95](https://react95.io/) just feel a bit too mid 90s for you? This, based on [98.css](https://jdan.github.io/98.css/), steps forward with an option more reminiscent of the Windows 98/NT 4 era. Does this have any practical use beyond being a nostalgia trip? Who knows, but it makes for a fun screenshot.

Lisandro X

[**Plasmic: Low-Code Visual Page Builder for React**](https://www.plasmic.app/ "www.plasmic.app")** — This tool was commercial for a few years but is now open source. Provides the ability to drag and drop your own components and can integrate with your existing codebase. There are [some demos](https://github.com/plasmicapp/plasmic#see-plasmic-in-action) you can check out. [GitHub repo.](https://github.com/plasmicapp/plasmic)

Plasmic

**[React SyncScroll: Sync Scrolling Across Elements](https://react-sync-scroll.netlify.app/ "react-sync-scroll.netlify.app")** — A way to get synced scroll position across multiple scrollable elements. [GitHub repo.](https://github.com/okonet/react-scroll-sync)

Andrey Okonetchnikov

**[visx v3.5: Airbnb's D3-Based Visualization Primitives for React](https://airbnb.io/visx/ "airbnb.io")** — Unopinionated but React-y way to create visualizations. Bring your own state management, animation library, or CSS-in-JS solution – visx is designed to slot into pretty much any React codebase. [Demos aplenty.](https://airbnb.io/visx/gallery)

Airbnb

**版本发布：**

- [**React Joyride v2.7**](https://github.com/gilbarbara/react-joyride)** \
  ↳ Create guided tours in your apps.

- [**React Native SVG v14.0**](https://github.com/software-mansion/react-native-svg/releases/tag/v14.0.0)** \
  ↳ SVG support for React Native across all main platforms.

- [**React ProseMirror v0.4.0**](https://github.com/nytimes/react-prosemirror)** \
  ↳ Safely integrate [ProseMirror](https://prosemirror.net/) in React.

- [**React Native Testing Library v12.4**](https://github.com/callstack/react-native-testing-library/releases/tag/v12.4.0)** \
  ↳ Now with [built-in Jest matchers.](https://callstack.github.io/react-native-testing-library/docs/jest-matchers)

- [**react-icons v4.12**](https://github.com/react-icons/react-icons)** \
  ↳ Popular icon packs ready to use in React.

- [**react-markdown v9.0.1**](https://github.com/remarkjs/react-markdown)** \
  ↳ Markdown component. ([Demo.](https://remarkjs.github.io/react-markdown/))
`
const a = '[**Datasheet Grid：一个类似 Airtable 的网格组件**](https://react-datasheet-grid.netlify.app/ "react-datasheet-grid.netlify.app")\** — 如果你有一组对象，想让用户对其进行操作，那这个组件很适合你。它不会取代电子表格或完整的数据网格框架，但对于一般用例来说是一个成熟的解决方案，并且具有流畅的动画、虚拟化行和列、键盘导航等功能。'
export const initTextAtom = atom(a)
export const textAtom = atom(a)
