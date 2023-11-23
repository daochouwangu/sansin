import Markdown from "react-markdown";
import { EditorMode } from "../atoms/mode";
import remarkGfm from 'remark-gfm'
import { useWindowScroll } from "@uidotdev/usehooks";

export interface EditorProps {
  mode: EditorMode;
  markdown: string;
  setMarkdown: (e: any) => void;
}
export const Editor:React.FC<EditorProps> = ({ mode, markdown, setMarkdown }) => {
  const [{ x, y }, scrollTo] = useWindowScroll();
  const renderMarkdown = (markdown: string) => {
    return <Markdown className="h-full overflow-scroll" remarkPlugins={[remarkGfm]}>
      { markdown }
    </Markdown>
  }
  const onInput = (e: any) => {
    setMarkdown(e.target.value)
  }
  const renderEditor = (markdown: string) => {
    return <textarea className="p-2 resize w-full h-full " value={markdown} onInput={onInput}/>
  }
  return (
    mode === EditorMode.PREVIEW ? renderMarkdown(markdown) : renderEditor(markdown)
  )
}