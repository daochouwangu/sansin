import React, { useEffect, useState } from 'react'
import { diffSourcePluginHooks } from '@mdxeditor/editor' 
import { Switch } from '@headlessui/react'

export const SwitchMode: React.FC = () => {
  const [viewMode] = diffSourcePluginHooks.useEmitterValues('viewMode')
  const changeViewMode = diffSourcePluginHooks.usePublisher('viewMode')
  const [enabled, setEnabled] = useState(viewMode === 'diff')

  useEffect(() => {
    if (enabled) {
      changeViewMode('diff')
    } else {
      changeViewMode('rich-text')
    }
  }, [enabled])
  return (
    <div className='flex flex-row items-center h-full p-1'>
      <Switch.Group>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span className="sr-only">Enable notifications</span>
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
        <Switch.Label passive>{enabled ? 'Diff 模式' : ''}</Switch.Label>
      </Switch.Group>
    </div>
  )
}