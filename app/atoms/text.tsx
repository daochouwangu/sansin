import { atom } from "jotai"

const a = `
## 🔥 本周热门

**[Building Fast Next.js Apps using TypeScript and AWS Amplify JavaScript V6](https://aws.amazon.com/blogs/mobile/amplify-javascript-v6/ "aws.amazon.com")** —— If you’ve been wondering if you can deploy modern Next.js apps anywhere other than Vercel, AWS Amplify is keen to enter the chat. _Amplify_ is essentially a packaging up of AWS services into a platform upon which you can deploy full-stack apps and its newest JavaScript SDK offers substantial improvements, including Next.js 14 support (including App Router and Server Actions) via what they refer to as a 'Next.js adapter'.

Hanchett and Nanda (AWS)

**[Redux Toolkit 2.0 Release Candidate 0 (and Others)](https://github.com/reduxjs/redux-toolkit/releases/tag/v2.0.0-rc.0 "github.com")** —— Mark Erikson has unveiled a variety of initial release candidates for three projects: Redux Toolkit 2.0, [Redux 5.0](https://github.com/reduxjs/redux/releases/tag/v5.0.0-rc.0), and [React-Redux 9.0.](https://github.com/reduxjs/react-redux/releases/tag/v9.0.0-rc.0) They feature better packaging and smaller bundle sizes, with RTK 2.0 gaining several new features, faster update perf with Immer 10, and better TS types. Final releases are expected in the next couple of weeks.

Redux Team

**[The Valley of Code](https://thevalleyofcode.com/ "thevalleyofcode.com")** —— An ambitious project from this well-regarded author and teacher: a single place you can go to learn quickly how to do pretty much anything in your day-to-day life as a developer. Yes, [there’s a React section.](https://thevalleyofcode.com/react)

Flavio Copes

**[Things You Forgot (or Never Knew) Because of React](https://joshcollinsworth.com/blog/antiquated-react)** —— This was a huge feature article a few months ago, but has had a little update. Worth a look if you missed it first time around.

Josh Collinsworth

**▶ [Server Actions vs tRPC, GraphQL and REST](https://www.youtube.com/watch?v=DUiHClAtU5Y)** —— Jack compares and contrasts a variety of mildly competing options.

Jack Herrington

**[Combining AI with React for a Smarter Frontend](https://thenewstack.io/combining-ai-with-react-for-a-smarter-frontend/)**

Loraine Lawson（The New Stack）

**[Building a Progressive Web App in Remix](https://blog.logrocket.com/building-remix-pwa/)**

Chimezie Innocent

**快讯：**

- The New Stack has a nice feature [on Rachel Nabors and her work on React documentation](https://thenewstack.io/rachel-nabors-on-revamping-reacts-documentation/) over the years.

- The [React Jam](https://reactjam.com/) gamejam has shared [▶️ a 93-second showcase](https://www.youtube.com/watch?v=WxH6IeMh78U) of all this year's submissions.

## 🛠  代码与工具

[![](https://res.cloudinary.com/cpress/image/upload/w_1280,e_sharpen:60,q_auto/w3elpwswqezzhb645zab.jpg)](https://storybook.js.org/blog/storybook-test/)

**[React Scroll Parallax: Parallax Scroll Effect Hooks](https://react-scroll-parallax.damnthat.tv/docs/intro "react-scroll-parallax.damnthat.tv")** —— Add vertical or horizontal scrolling-based effects to elements of your choice. There’s a nifty [visual demo of how it works](https://react-scroll-parallax.damnthat.tv/docs/examples/how-it-works).

J Scott Smith

**[Typist v2.2: Tiptap-Based Rich Text Editor Component](https://typist.doist.dev/?path=/docs/readme--docs "typist.doist.dev")** —— Simple and opinionated. You can try the examples in the sidebar. Well suited for basic rich text situations like writing comments or messages and also has a single-line mode.

Doist
`
export const sourceAtom = atom(a)
export const targetAtom = atom('')
