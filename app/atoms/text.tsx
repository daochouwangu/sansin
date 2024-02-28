import { MonacoDiffEditor } from "@monaco-editor/react";
import { atom } from "jotai";

export const editorAtom = atom<null | MonacoDiffEditor>(null);
