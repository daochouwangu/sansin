'use client'

import { atom, useAtom, Provider } from 'jotai'
import dynamic from 'next/dynamic'
import { initTextAtom, textAtom } from './atoms/text'

const EditorComp = dynamic(() => import('./components/EditorComponent'), { ssr: false })

export default function Home() {
  return (
    <div className="flex flex-col w-full items-center justify-center flex-1 p-4">
      <EditorComp />
    </div>
  )
}