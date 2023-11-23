import { useAtom } from "jotai"
import { blocksAtom } from "../atoms/blocks"
import SourceEditorBar from "./SourceEditorBar"
import TargetEditorBar from "./TargetEditorBar"
import { SourceEditor } from "./SourceEditor"
import { TargetEditor } from "./TargetEditor"

export const EditorWrapper:React.FC = () =>  {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  console.log(blocks)
  return (
    <div className="flex flex-row w-full gap-1 flex-nowrap h-screen p-2">
      <div className="flex-1 h-full"><SourceEditor /></div>
      <div className="flex-1 h-full" ><TargetEditor /></div>
    </div>
  )
}