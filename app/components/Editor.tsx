import Markdown from "react-markdown";
import { EditorMode } from "../atoms/mode";
import remarkGfm from 'remark-gfm'
import { useWindowScroll } from "@uidotdev/usehooks";
import { DiffEditor, type MonacoDiffEditor, type Monaco } from '@monaco-editor/react';
import { EditorBar } from "./EditorBar";
import { useRef } from "react";
import { useAtom } from "jotai";
import { sourceAtom, targetAtom } from "../atoms/text";

export const Editor:React.FC = () => {
  const [source, setSource] = useAtom(sourceAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const diffEditorRef = useRef<MonacoDiffEditor | null>(null);

  function handleEditorDidMount(editor: MonacoDiffEditor, monaco: Monaco) {
    diffEditorRef.current = editor;
  }

  function showOriginalValue() {
    alert(diffEditorRef.current?.getOriginalEditor().getValue());
  }

  function showModifiedValue() {
    alert(diffEditorRef.current?.getModifiedEditor().getValue());
  }
  console.log(target)
  return (
    <div className="w-full">
      <EditorBar />
      <DiffEditor 
        height="90vh"
        language="markdown"
        options={{
          originalEditable: true,
          wordWrap: "on",
        }}
        original={source}
        modified={target}
        onMount={handleEditorDidMount}
      />
    </div>
  )
}