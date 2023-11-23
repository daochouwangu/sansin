import { BoldItalicUnderlineToggles, ChangeCodeMirrorLanguage, CodeToggle, ConditionalContents, CreateLink, EditorInFocus, InsertCodeBlock, InsertFrontmatter, InsertImage, InsertSandpack, InsertTable, InsertThematicBreak, ListsToggle, Separator, UndoRedo } from '@mdxeditor/editor'
import React from 'react'
import { SwitchMode } from './SwitchMode' 
import TranslatePlugin from './TranslatePlugin'
/**
 * A toolbar component that includes all toolbar components.
 * Notice that some of the buttons will work only if you have the corresponding plugin enabled, so you should use it only for testing purposes.
 * You'll probably want to create your own toolbar component that includes only the buttons that you need.
 */
export const EditorBar: React.FC = () => {
  return (
      <ConditionalContents
        options={[
          { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage/> },
          {
            fallback: () => (
              <div className="flex flex-row flex-nowrap w-full">
                <UndoRedo />
                <Separator />
                <TranslatePlugin />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />

                <Separator />

                <CreateLink />
                <InsertImage />

                <Separator />

                <InsertTable />
                <InsertThematicBreak />

                <Separator />
                <InsertCodeBlock />


                <Separator />
                <InsertFrontmatter />
                <SwitchMode />
              </div>
            )
          }
        ]}
      />
  )
}