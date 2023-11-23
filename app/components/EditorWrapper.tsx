import { useAtom } from "jotai"
import { blocksAtom } from "../atoms/blocks"
import { Editor } from "./Editor"

export const EditorWrapper:React.FC = () =>  {
  return (
    <div className="flex flex-row w-full gap-1 flex-nowrap h-screen p-2">
      <Editor />
    </div>
  )
}