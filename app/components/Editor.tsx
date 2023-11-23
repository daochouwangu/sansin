'use client'
import { useIsClient, useThrottle, useWindowScroll } from "@uidotdev/usehooks";
import { DiffEditor, type MonacoDiffEditor, type Monaco } from '@monaco-editor/react';
import { EditorBar } from "./EditorBar";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { sourceAtom, targetAtom } from "../atoms/text";

export const Editor:React.FC = () => {
  const [source, setSource] = useAtom(sourceAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const sourceRef = useRef(source)
  const targetRef = useRef(target)
  useEffect(() => {
    sourceRef.current = source
    targetRef.current = target
  }, [source, target])
  const diffEditorRef = useRef<MonacoDiffEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const _source = useThrottle(source, 200)
  const _target = useThrottle(target, 200)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    console.log(_source, _target, isLoaded)
    if (isMounted) {
      localStorage.setItem('source', _source)
      localStorage.setItem('target', _target)
    }
  }, [_source, _target, isMounted])
  const isClient = useIsClient()
  useEffect(() => {
    if (isClient) {
      const s = localStorage.getItem('source')
      if (s) {
        setSource(s)
      }
      const t = localStorage.getItem('target')
      if (t) {
        setTarget(t)
      }
      setIsLoaded(true)
    }
  }, [isClient])
  const handleEditorDidMount = (editor: MonacoDiffEditor, monaco: Monaco) => {
    diffEditorRef.current = editor;
    setIsMounted(true)
    diffEditorRef.current?.getOriginalEditor().setValue(sourceRef.current)
    diffEditorRef.current?.getModifiedEditor().setValue(targetRef.current)
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    editor.getModel()?.modified.onDidChangeContent((event) => {
      const v = editor.getModifiedEditor().getValue()
      setTarget(v)
    })
    editor.getOriginalEditor().getModel()?.onDidChangeContent((event) => {
      const v = editor.getOriginalEditor().getValue()
      setSource(v)
    })
}


  function showModifiedValue() {
    alert(diffEditorRef.current?.getModifiedEditor().getValue());
  }
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
        original={source}
        modified={target}
      />
    </div>
  )
}