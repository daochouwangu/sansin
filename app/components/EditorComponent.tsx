'use client'

import { MDXEditor, KitchenSinkToolbar, MDXEditorMethods, diffSourcePlugin, headingsPlugin, toolbarPlugin, UndoRedo, ToMarkdownOptions } from "@mdxeditor/editor"
import { useAtom } from "jotai"
import React, {FC, useEffect} from 'react'
import { initTextAtom, textAtom } from '../atoms/text'
import { ALL_PLUGINS } from "./EditorPlugins"
import '@mdxeditor/editor/style.css'
interface EditorProps {
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>
}
const toMarkdownOption = {
  bullet: '-',
  strong: '*',
  em: '_',
} as ToMarkdownOptions

declare global {
  interface Window {
    logMd: (markdown: string) => void;
  }
}

const Editor: FC<EditorProps> = () => {
  const [markdown] = useAtom(textAtom)
  const [initial] = useAtom(initTextAtom)
  const editorRef = React.useRef<MDXEditorMethods | null>(null)
  // useEffect(() => {
  //   editorRef.current?.setMarkdown(markdown)
  // }, [markdown])

  const PLUGINS = [
    ...ALL_PLUGINS,
    diffSourcePlugin({ viewMode: 'diff', diffMarkdown: initial }),
  ]
  return <MDXEditor toMarkdownOptions={toMarkdownOption} className="w-full h-screen" ref={editorRef} markdown={markdown} plugins={PLUGINS} />
}

export default Editor