import { useCompletion } from "ai/react";
import { textAtom, initTextAtom } from "../atoms/text";
import { useAtom } from "jotai";
import { useEffect } from "react";

type TranslateFunction = (text: string) => Promise<string | null | undefined>;
async function translateMD(md: string, translateFunction: TranslateFunction, setText: any ) {
  setText('')
  const urlRegex = /\[(.*?)\]\((.*?)\)/g;
  let urls = [] as string[];
  let index = 0;

  // Replace URLs with placeholders
  
  function changeLink(md: string) {
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
  const mdWithPlaceholders = changeLink(md)
  let translatedMdWithPlaceholders = '';

  // Split the text into lines
  const lines = mdWithPlaceholders.split('\n');

  let chunk = '';
  for (let i = 0; i < lines.length; i++) {
    // If adding the next line does not exceed the limit, add it to the chunk
    if (chunk.length + lines[i].length <= 2000) {
      chunk += lines[i] + '\n';
    } else {
      // If it exceeds the limit, translate the current chunk and start a new one
      const translatedChunk = await translateFunction(chunk);
      if (!translatedChunk) {
        return md;
      }
      const text = backLink(translatedChunk)
      setText((t: string) => t + text)
      translatedMdWithPlaceholders += translatedChunk;
      chunk = lines[i] + '\n';
    }
  }
  // Don't forget to translate the last chunk
  const translatedChunk = await translateFunction(chunk);
  if (!translatedChunk) {
    return md;
  }
  const text = backLink(translatedChunk)
  setText((t: string) => t + text)

  return translatedMdWithPlaceholders + text;
}


export default function TranslatePlugin() {
  const {
    completion,
    input,
    stop,
    complete,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: '/api/completion',
  });
  const [iText] = useAtom(initTextAtom)
  const [text, setText] = useAtom(textAtom)
  const translate = async () => {
    // await translateMD(iText, (t) => complete(t), setText)
    const a = '**[Datasheet Grid：一个类似 Airtable 的网格组件](https://react-datasheet-grid.netlify.app/ "react-datasheet-grid.netlify.app")\** — 如果你有一组对象，想让用户对其进行操作，那这个组件很适合你。它不会取代电子表格或完整的数据网格框架，但对于一般用例来说是一个成熟的解决方案，并且具有流畅的动画、虚拟化行和列、键盘导航等功能。'
    setText(a)
  }
  return (
    <div onClick={() => translate()}>TranslatePlugin</div>
  )
}