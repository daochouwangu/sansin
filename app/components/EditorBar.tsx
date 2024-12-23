"use client";
import { TranslateButton } from "./bar/TranslateButton";
import { CopyToWechatButton } from "./bar/CopyToWechatButton";
import { TestImageButton } from "./bar/TestImageButton";

export const EditorBar = () => {
  return (
    <div className="flex gap-2 p-2">
      <TranslateButton />
      <CopyToWechatButton />
      <TestImageButton />
    </div>
  );
};
