import { atom } from "jotai"

interface Block {
  id: string
  source: string
  target: string
  description: string
}

export const blocksAtom = atom([] as Block[])