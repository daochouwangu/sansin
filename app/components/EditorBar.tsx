"use client";
import { TranslateButton } from "./bar/TranslateButton";
import { CopyToWechatButton } from "./bar/CopyToWechatButton";
export const EditorBar = () => {
  return (
    <div className="flex flex-row gap-1 h-8">
      <TranslateButton />
      <CopyToWechatButton />
    </div>
  );
};
