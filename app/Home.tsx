'use client'

import Completion from './components/Demo'
import { EditorWrapper } from './components/EditorWrapper'


export default function Home() {
  return (
    <div className="flex flex-col w-full items-center justify-center flex-1 p-4">
      <EditorWrapper />
      {/* <Completion /> */}
    </div>
  )
}