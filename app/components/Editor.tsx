"use client";
import { useIsClient, useThrottle, useWindowScroll } from "@uidotdev/usehooks";
import {
  DiffEditor,
  type MonacoDiffEditor,
  type Monaco,
} from "@monaco-editor/react";
import { EditorBar } from "./EditorBar";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { editorAtom } from "../atoms/text";

export const Editor: React.FC = () => {
  const [target, setTarget] = useState("");
  const [_editor, setEditor] = useAtom(editorAtom);
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  const handleEditorDidMount = (editor: MonacoDiffEditor, monaco: Monaco) => {
    setEditor(editor);
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
  };

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
        onMount={handleEditorDidMount}
        original={""}
        modified={target}
      />
    </div>
  );
};
