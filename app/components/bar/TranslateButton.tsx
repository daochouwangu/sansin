"use client";
import { useCompletion } from "ai/react";
import { sourceAtom, targetAtom } from "../../atoms/text";
import { useAtom } from "jotai";
import { use, useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import useLocalStorage from "./useLocalStorage";
import { useIsClient } from "@uidotdev/usehooks";
const urls = [] as string[];
let index = 0;
function hideLink(md: string) {
  const urlRegex = /\[(.*?)\]\((.*?)\)/g;
  const mdWithPlaceholders = md.replace(urlRegex, (match, text, url) => {
    urls.push(url);
    return `[${text}](url_placeholder_${index++})`;
  });
  return mdWithPlaceholders;
}
function backLink(md: string) {
  // Replace placeholders with original URLs
  const translatedMd = md.replace(
    /url_placeholder_\d+/g,
    (placeholder: string) => {
      const index = Number(placeholder.split("_")[2]);
      return urls[index];
    }
  );
  return translatedMd;
}
type TranslateFunction = (text: string) => Promise<string | null | undefined>;
function splitDocs(md: string) {
  const docs = [] as string[];

  // Split the text into lines
  const lines = md.split("\n");

  let chunk = "";
  for (let i = 0; i < lines.length; i++) {
    // If adding the next line does not exceed the limit, add it to the chunk
    if (chunk.length + lines[i].length <= 2000) {
      chunk += lines[i] + "\n";
    } else {
      // If it exceeds the limit, translate the current chunk and start a new one
      docs.push(chunk);
      chunk = lines[i] + "\n";
    }
  }
  if (chunk) {
    docs.push(chunk);
  }
  return docs;
}

export const TranslateButton = () => {
  const [source, setSource] = useAtom(sourceAtom);
  const [target, setTarget] = useAtom(targetAtom);
  const [show, setShow] = useState(false);
  const [docs, setDocs] = useState([] as string[]);
  const [showAuth, setShowAuth] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useLocalStorage("code", "");

  const { complete } = useCompletion({
    headers: {
      Authorization: code,
    },
    onResponse: (res) => {
      // trigger something when the response starts streaming in
      // e.g. if the user is rate limited, you can show a toast
      if (res.status === 429) {
        setError("您的账号已达上限，请更换 token");
        setShowAuth(true);
      }
      if (res.status === 401) {
        setError("密码错误");
        setShowAuth(true);
      }
    },
  });
  useEffect(() => {
    const docs = splitDocs(source);
    setDocs(docs);
  }, [source]);

  const checkAuth = () => {
    if (!code) {
      setShowAuth(true);
      return;
    }
    setShowAuth(false);
    translate(0);
  };
  const translate = async (i: number) => {
    setShow(true);
    if (i === 0) {
      setTarget("");
      setTarget("");
    }
    if (i >= docs.length) {
      setShow(false);
      return;
    }
    const doc = hideLink(docs[i]);
    const r = await complete(doc);
    if (r) {
      setTarget((v) => v + backLink(r));
      translate(i + 1);
    }
  };
  const onChangeCode = (e: any) => {
    setCode(e.target.value);
  };
  return (
    <>
      <button
        className="bg-blue-500 text-white w-8 h-8 text-bold rounded"
        onClick={() => translate(0)}
      >
        译
      </button>
      {show && (
        <Dialog
          open={show}
          onClose={() => setShow(false)}
          className="relative z-50"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex w-screen items-center justify-center ">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-4">
              <Dialog.Title>翻译中...</Dialog.Title>
              {/* ... */}
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
      {showAuth && (
        <Dialog
          open={showAuth}
          onClose={() => setShowAuth(false)}
          className="relative z-50"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex w-screen items-center justify-center ">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="flex flex-col mx-auto max-w-sm rounded bg-white p-4">
              <div className="w-full">
                请输入密码/或者您自己的 openai token（sk-开头）
              </div>
              <div className="w-full flex flex-row flex-nowrap">
                <input
                  className="border border-black flex-1"
                  value={code}
                  onChange={onChangeCode}
                ></input>
                <button
                  onClick={checkAuth}
                  className="w-16 bg-blue-500 text-white"
                >
                  确认
                </button>
              </div>
              <div>{error && <div className="text-red-500">{error}</div>}</div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </>
  );
};
