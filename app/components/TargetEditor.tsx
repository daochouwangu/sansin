import { useAtom } from "jotai"
import { sourceAtom, targetAtom } from "../atoms/text"
import { Editor } from "./Editor"
import { EditorMode, targetModeAtom } from "../atoms/mode"
import { Menu } from "@headlessui/react"
import { ModeSwitcher } from "./bar/ModeSwitcher"

export const TargetEditor = () => {
  const [target, setTarget] = useAtom(targetAtom)
  const [mode, setMode] = useAtom(targetModeAtom)
  const toggleMode = () => {
    setMode(mode === EditorMode.PREVIEW ? EditorMode.SOURCE : EditorMode.PREVIEW)
  }
  return <><div><ModeSwitcher mode={mode} setMode={setMode} /></div><Editor markdown={target} mode={mode} setMarkdown={setTarget}/></>
}