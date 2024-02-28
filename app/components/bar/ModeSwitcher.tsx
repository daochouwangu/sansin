import { EditorMode } from "@/app/atoms/mode";
import { editorAtom } from "@/app/atoms/text";
import { Switch } from "@headlessui/react";
import { useAtom } from "jotai";

export const ModeSwitcher = () => {
  const [editor] = useAtom(editorAtom);
  const toggleMode = () => {
    setMode(
      mode === EditorMode.PREVIEW ? EditorMode.SOURCE : EditorMode.PREVIEW
    );
  };
  return (
    <Switch.Group>
      <Switch.Label className="">预览模式:</Switch.Label>
      <Switch
        checked={mode === EditorMode.PREVIEW}
        onChange={toggleMode}
        className="relative inline-flex h-6 w-11 items-center rounded-full ui-checked:bg-blue-600 ui-not-checked:bg-gray-200"
      >
        {({ checked }) => (
          /* Use the `checked` state to conditionally style the button. */
          <div
            className={`${
              checked ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">预览模式</span>
            <span
              className={`${
                checked ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </div>
        )}
      </Switch>
    </Switch.Group>
  );
};
