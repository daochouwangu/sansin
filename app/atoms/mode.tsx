import { atom } from "jotai"

export enum EditorMode {
  SOURCE,
  PREVIEW,
}
export const sourceModeAtom = atom(EditorMode.SOURCE)
export const targetModeAtom = atom(EditorMode.PREVIEW)