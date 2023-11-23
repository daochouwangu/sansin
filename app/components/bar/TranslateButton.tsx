import { useCompletion } from "ai/react";
import { sourceAtom, targetAtom } from "../../atoms/text";
import { useAtom } from "jotai";
import { use, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
const urls = [] as string[];
let index = 0
function hideLink(md: string) {
  const urlRegex = /\[(.*?)\]\((.*?)\)/g;
  const mdWithPlaceholders = md.replace(urlRegex, (match, text, url) => {
    urls.push(url);
    return `[${text}](url_placeholder_${index++})`;
  });
  return mdWithPlaceholders
}
function backLink(md: string) {
  // Replace placeholders with original URLs
  const translatedMd = md.replace(/url_placeholder_\d+/g, (placeholder: string) => {
    const index = Number(placeholder.split('_')[2]);
    return urls[index];
  });
  return translatedMd
}
type TranslateFunction = (text: string) => Promise<string | null | undefined>;
function splitDocs(md: string ) {
  const docs = [] as string[];

  // Split the text into lines
  const lines = md.split('\n');

  let chunk = '';
  for (let i = 0; i < lines.length; i++) {
    // If adding the next line does not exceed the limit, add it to the chunk
    if (chunk.length + lines[i].length <= 2000) {
      chunk += lines[i] + '\n';
    } else {
      // If it exceeds the limit, translate the current chunk and start a new one
      docs.push(chunk);
      chunk = lines[i] + '\n';
    }
  }
  if (chunk) {
    docs.push(chunk);
  }
  return docs
}


export const TranslateButton = () => {
  const [source] = useAtom(sourceAtom)
  const [target, setTarget] = useAtom(targetAtom)
  const [show, setShow] = useState(false)
  const [docs, setDocs] = useState([] as string[])
  const {
    complete,
  } = useCompletion()
  useEffect(() => {
      const docs = splitDocs(source)
      setDocs(docs)
  }, [source])
  const translate = async (i: number) => {
    setShow(true)
    if (i === 0) {
      setTarget('')
      setTarget('')
    }
    if (i >= docs.length) {
      setShow(false)
      return
    }
    const doc = hideLink(docs[i]);
    const r = await complete(doc)
    if (r) {
      setTarget((v) => v + backLink(r))
      translate(i + 1)
    }
  }
  return (
    <>
    <button className="bg-blue-500 text-white text-bold p-2 rounded" onClick={() => translate(0)}>译</button>
    {show &&<Dialog
          static
          open={show}
          onClose={() => setShow(false)}
        >
          <Dialog.Panel>
            <Dialog.Title>翻译中...</Dialog.Title>
          </Dialog.Panel>
        </Dialog>
    }
    </>
  )
}