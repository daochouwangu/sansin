import { useAtom } from "jotai"
import { sourceAtom } from "../atoms/text"
import { Editor } from "./Editor"
import { sourceModeAtom } from "../atoms/mode"
import { TranslateButton } from "./bar/TranslateButton"
import { ModeSwitcher } from "./bar/ModeSwitcher"

export const SourceEditor = () => {
  const [source, setSource] = useAtom(sourceAtom)
  const [mode, setMode] = useAtom(sourceModeAtom)

  return <div className="w-full h-full flex-row ">
    <div><TranslateButton /><ModeSwitcher mode={mode} setMode={setMode}/></div>
  <Editor markdown={source} mode={mode} setMarkdown={setSource} />
  </div>
}