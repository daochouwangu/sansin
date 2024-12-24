"use client";
import { useAtom } from "jotai";
import * as marked from "marked";
import * as juice from "juice";
import { editorAtom } from "@/app/atoms/text";
import QRCode from "qrcode";

// 创建一个缓存对象来存储已生成的二维码
const qrcodeCache: { [key: string]: string } = {};

// 提前生成二维码
const generateQRCode = async (url: string): Promise<string> => {
  if (qrcodeCache[url]) {
    return qrcodeCache[url];
  }
  const base64 = await QRCode.toDataURL(url);
  qrcodeCache[url] = base64;
  return base64;
};

const qrcode: marked.TokenizerAndRendererExtension = {
  name: "qrcode",
  level: "inline",
  start(src) {
    return src.match(/\[\[qrcode:/)?.index;
  },
  tokenizer(src, tokens) {
    const rule = /^\[\[qrcode:(.*?)\]\]/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "qrcode",
        raw: match[0],
        text: match[1].trim(),
      };
    }
  },
  renderer(token) {
    // 使用缓存中的二维码
    const base64 = qrcodeCache[token.text] || "";
    return `<section style="margin-top: 12px;padding: 16px 20px;max-width: 100%;box-sizing: border-box;white-space: normal;text-size-adjust: auto;color: rgb(63, 63, 63);font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, &quot;PingFang SC&quot;, Cambria, Cochin, Georgia, Times, &quot;Times New Roman&quot;, serif;letter-spacing: 0.476px;text-align: left;display: flex;align-items: center;background-color: rgb(246, 246, 246);box-shadow: rgb(199, 201, 204) 0px 0px 0px inset;border-radius: 6px;border-color: rgb(62, 62, 62);font-size: 12px;overflow: hidden;overflow-wrap: break-word !important;margin-bottom: 0px;"><section style="margin: 0 !important;padding-right: 12px;max-width: 100%;box-sizing: border-box;flex: 1 1 0%;display: flex;flex-direction: column;justify-content: space-between;overflow-wrap: break-word !important;"><strong style="font-weight: bold !important;font-size: 12px;max-width: 100%;box-sizing: border-box;color: rgb(114, 114, 114);line-height: 1.75em;overflow-wrap: break-word !important;">长按识别二维码查看原文</strong>&nbsp; &nbsp;<mpchecktext contenteditable="false" id="1709012664341_0.3706423394256646"></mpchecktext><p style="font-size: 12px;margin-bottom:0;max-width: 100%;box-sizing: border-box;min-height: 1em;line-height: 1.8;color: rgb(114, 114, 114);word-break: break-all;overflow-wrap: break-word !important;">${token.text}<mpchecktext contenteditable="false" id="1709012664342_0.7239154036614526"></mpchecktext></p></section><section style="display: flex;align-items: center;max-width: 90px;box-sizing: border-box;flex-shrink: 0;font-size: 0px;overflow-wrap: break-word !important;"><img class="rich_pages wxw-img" src="${base64}" style="margin-right: auto;margin-left: auto;box-sizing: border-box;vertical-align: middle;border-style: none;display: block;border-radius: 4px;overflow-wrap: break-word !important;visibility: visible !important;width: 90px !important;"></section></section>`;
  },
};

marked.use({ extensions: [qrcode] });

function getFirstLink(markdown: string) {
  const linkRegex = /\[(.*?)\]\((.*?)(?: ".*")?\)/;
  const match = linkRegex.exec(markdown);
  return match ? match[2] : null;
}

export const CopyToWechatButton = () => {
  const [editor] = useAtom(editorAtom);
  const addQrcode = (text: string) => {
    const ph = text.split("\n");
    const res = [];
    let isOver = false;
    for (let i = 0; i < ph.length; i++) {
      if (ph[i].includes("**版本发布")) {
        res.push(ph[i]);
        isOver = true;
        continue;
      }
      const link = getFirstLink(ph[i]);

      if (link && !isOver) {
        if (link.match(/\.(jpeg|jpg|gif|png|svg|webp)/)) {
          res.push(ph[i]);
        } else {
          res.push(ph[i]);
          res.push(`[[qrcode:${link}]]`);
        }
      } else {
        res.push(ph[i]);
      }
    }
    return res.join("\n");
  };

  const copy = async (e: any) => {
    const source = editor?.getModifiedEditor().getValue();
    if (!source) {
      alert("内容为空");
      return;
    }

    // 在转换 markdown 之前，先生成所有需要的二维码
    const sourceWithQrcode = addQrcode(source);
    const qrcodeMatches = sourceWithQrcode.match(/\[\[qrcode:(.*?)\]\]/g) || [];
    const urls = qrcodeMatches.map((match) => {
      const rule = /\[\[qrcode:(.*?)\]\]/;
      return rule.exec(match)?.[1] || "";
    });

    // 等待所有二维码生成完成
    await Promise.all(urls.map((url) => generateQRCode(url)));

    // 定义渲染器
    const renderer = new marked.Renderer();

    // Override the function that renders links
    renderer.link = function (href, title, text) {
      // Return a span with a special class instead of an a tag
      return `<span style="text-decoration: none; word-wrap: break-word; font-weight: bold; color: rgb(239, 112, 96);">${text}</span>`;
    };
    renderer.listitem = function (text) {
      return `<li><section>${text}</section></li>`;
    };
    // 斜体改为加粗
    renderer.em = function (text) {
      return `<strong>${text}</strong>`;
    };
    renderer.heading = function (text, level, raw) {
      if (level === 2) {
        return `<span class="prefix" style="display: none"></span><span class="content" style="margin-left: -10px;display: inline-block;width: auto;height: 40px;background-color: rgb(33, 33, 34);border-bottom-right-radius: 100px;color: rgb(255, 255, 255);padding-right: 30px;padding-left: 30px;line-height: 40px;font-size: 16px;">${text}</span><span class="suffix"></span>`;
      } else {
        return `<h${level}>${text}</h${level}>`;
      }
    };

    // 转换 markdown
    let _htmlStr = marked.parse(sourceWithQrcode, { renderer });
    _htmlStr = `<div id="nice">${_htmlStr}</div>`;
    const htmlStr = juice.inlineContent(_htmlStr, css);
    const html = new Blob([htmlStr], { type: "text/html" });

    const item = new ClipboardItem({
      [html.type]: html,
      "text/plain": new Blob([htmlStr], { type: "text/plain" }),
    });

    try {
      await navigator.clipboard.write([item]);
      alert("已复制到剪贴板");
    } catch (err) {
      console.error("Failed to copy HTML: ", err);
    }
  };

  return (
    <>
      <button
        className="bg-green-500 w-8 h-8 text-white text-bold rounded"
        onClick={copy}
      >
        微
      </button>
    </>
  );
};

const css = `
/*默认样式，最佳实践*/

/*全局属性*/
#nice {
  font-size: 16px;
  color: black;
  padding: 0 10px;
  line-height: 1.6;
  word-spacing: 0px;
  letter-spacing: 0px;
  word-break: break-word;
  word-wrap: break-word;
  text-align: left;
  font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light,
    "PingFang SC", Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  margin-top: -10px; /*解决开头空隙过大问题*/
}

/*段���*/
#nice p {
  font-size: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  margin: 0;
  line-height: 26px;
  color: black;
}

/*标题*/
#nice h1,
#nice h2,
#nice h3,
#nice h4,
#nice h5,
#nice h6 {
  margin-top: 30px;
  margin-bottom: 15px;
  font-weight: bold;
  color: black;
}
#nice h1 {
  font-size: 24px;
}
#nice h2 {
  font-size: 22px;
}
#nice h3 {
  font-size: 20px;
}
#nice h4 {
  font-size: 18px;
}
#nice h5 {
  font-size: 16px;
}
#nice h6 {
  font-size: 16px;
}

#nice h1 .prefix,
#nice h2 .prefix,
#nice h3 .prefix,
#nice h4 .prefix,
#nice h5 .prefix,
#nice h6 .prefix {
  display: none;
}

#nice h1 .suffix #nice h2 .suffix,
#nice h3 .suffix,
#nice h4 .suffix,
#nice h5 .suffix,
#nice h6 .suffix {
  display: none;
}

/*列表*/
#nice ul,
#nice ol {
  margin-top: 8px;
  margin-bottom: 8px;
  padding-left: 25px;
  color: black;
}
#nice ul {
  list-style-type: disc;
}
#nice ul ul {
  list-style-type: square;
}

#nice ol {
  list-style-type: decimal;
}

#nice li section {
  margin-top: 5px;
  margin-bottom: 5px;
  line-height: 26px;
  text-align: left;
  color: rgb(1, 1, 1); /* 只要是纯黑色微信编辑器就会把color这个属性吞掉。。。*/
  font-weight: 500;
}

/*引用*/
#nice blockquote {
  display: block;
  font-size: 0.9em;
  overflow: auto;
  overflow-scrolling: touch;
  border-left: 3px solid rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.05);
  color: #6a737d;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
}

#nice blockquote p {
  margin: 0px;
  color: black;
  line-height: 26px;
}

#nice .table-of-contents a {
  border: none;
  color: black;
  font-weight: normal;
}

/*链接*/
#nice a {
  text-decoration: none;
  color: #1e6bb8;
  word-wrap: break-word;
  font-weight: bold;
  border-bottom: 1px solid #1e6bb8;
}

/*加粗*/
#nice strong {
  font-weight: bold;
  color: black;
}

/*斜体*/
#nice em {
  font-style: italic;
  color: black;
}

/*加粗斜体*/
#nice em strong {
  font-weight: bold;
  color: black;
}

/*删除线*/
#nice del {
  font-style: italic;
  color: black;
}

/*分隔线*/
#nice hr {
  height: 1px;
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
  border: none;
  border-top: 1px solid black;
}

/*代码块*/
#nice pre {
  margin-top: 10px;
  margin-bottom: 10px;
}
#nice pre code {
  display: -webkit-box;
  font-family: Operator Mono, Consolas, Monaco, Menlo, monospace;
  border-radius: 0px;
  font-size: 12px;
  -webkit-overflow-scrolling: touch;
}
#nice pre code span {
  line-height: 26px;
}

/*行内代码*/
#nice p code,
#nice li code {
  font-size: 14px;
  word-wrap: break-word;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 0 2px;
  color: #1e6bb8;
  background-color: rgba(27, 31, 35, 0.05);
  font-family: Operator Mono, Consolas, Monaco, Menlo, monospace;
  word-break: break-all;
}

/*图片*/
#nice img {
  display: block;
  margin: 0 auto;
  width: auto;
  max-width: 100%;
}

/*图片*/
#nice figure {
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
}

/*图片描述文字*/
#nice figcaption {
  margin-top: 5px;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/*表格*/
#nice table {
  display: table;
  text-align: left;
}
#nice tbody {
  border: 0;
}

#nice table tr {
  border: 0;
  border-top: 1px solid #ccc;
  background-color: white;
}

#nice table tr:nth-child(2n) {
  background-color: #f8f8f8;
}

#nice table tr th,
#nice table tr td {
  font-size: 16px;
  border: 1px solid #ccc;
  padding: 5px 10px;
  text-align: left;
}

#nice table tr th {
  font-weight: bold;
  background-color: #f0f0f0;
}

/* 微信代码块 */
#nice .code-snippet__fix {
  word-wrap: break-word !important;
  font-size: 14px;
  margin: 10px 0;
  display: block;
  color: #333;
  position: relative;
  background-color: rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  display: flex;
  line-height: 20px;
}
#nice .code-snippet__fix pre {
  margin-bottom: 10px;
  margin-top: 0px;
}
#nice .code-snippet__fix .code-snippet__line-index {
  counter-reset: line;
  flex-shrink: 0;
  height: 100%;
  padding: 1em;
  list-style-type: none;
  padding: 16px;
  margin: 0;
}
#nice .code-snippet__fix .code-snippet__line-index li {
  list-style-type: none;
  text-align: right;
  line-height: 26px;
  color: black;
  margin: 0;
}
#nice .code-snippet__fix .code-snippet__line-index li::before {
  min-width: 1.5em;
  text-align: right;
  left: -2.5em;
  counter-increment: line;
  content: counter(line);
  display: inline;
  color: rgba(0, 0, 0, 0.3);
}
#nice .code-snippet__fix pre {
  overflow-x: auto;
  padding: 16px;
  padding-left: 0;
  white-space: normal;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}
#nice .code-snippet__fix code {
  text-align: left;
  font-size: 14px;
  display: block;
  white-space: pre;
  display: flex;
  position: relative;
  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
  padding: 0px;
}

#nice .footnote-word {
  color: #1e6bb8;
  font-weight: bold;
}

#nice .footnote-ref {
  color: #1e6bb8;
  font-weight: bold;
}

#nice .footnote-item {
  display: flex;
}

#nice .footnote-num {
  display: inline;
  width: 10%; /*神奇，50px就不可以*/
  background: none;
  font-size: 80%;
  opacity: 0.6;
  line-height: 26px;
  font-family: ptima-Regular, Optima, PingFangSC-light, PingFangTC-light,
    "PingFang SC", Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

#nice .footnote-item p {
  display: inline;
  font-size: 14px;
  width: 90%;
  padding: 0px;
  margin: 0;
  line-height: 26px;
  color: black;
  word-break: break-all;
  width: calc(100%-50);
}

#nice sub,
sup {
  line-height: 0;
}

#nice .footnotes-sep:before {
  content: "参考资料";
  display: block;
}

/* 解决公式问题 */
#nice .block-equation {
  display: block;
  text-align: center;
  overflow: auto;
  display: block;
  -webkit-overflow-scrolling: touch;
}

#nice .block-equation svg {
  max-width: 300% !important;
  -webkit-overflow-scrolling: touch;
}

#nice .inline-equation {
}

#nice .inline-equation svg {
}

#nice .imageflow-layer1 {
  margin: 1em auto;
  white-space: normal;
  border: 0px none;
  padding: 0px;
  overflow: hidden;
}

#nice .imageflow-layer2 {
  white-space: nowrap;
  width: 100%;
  overflow-x: scroll;
}

#nice .imageflow-layer3 {
  display: inline-block;
  word-wrap: break-word;
  white-space: normal;
  vertical-align: middle;
  width: 100%;
}

#nice .imageflow-img {
  display: inline-block;
}

#nice .nice-suffix-juejin-container {
  margin-top: 20px !important;
}
/*自定义样式，实时生效*/

/* 全局属性
 * 页边距 padding: 30px;
 * 全文字体 font-family: ptima-Regular;
 * 英文换行 word-break: break-all;
 */
#nice {
}

/* 段落，下方未标注标签参数均同此处
 * 上边距 margin-top: 5px;
 * 下边距 margin-bottom: 5px;
 * 行高 line-height: 26px;
 * 词间距 word-spacing: 3px;
 * 字间距 letter-spacing: 3px;
 * 对齐 text-align: left;
 * 颜色 color: #3e3e3e;
 * 字体大小 font-size: 16px;
 * 首行缩进 text-indent: 2em;
 */
#nice p {
  box-sizing: border-box;
  margin-bottom: 16px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans,
    sans-serif;
  font-size: 15px;
  text-align: start;
  white-space: normal;
  text-size-adjust: auto;
  line-height: 1.75em;
}

/* 一级标题 */
#nice h1 {
  margin-top: -0.46em;
  margin-bottom: 0.1em;
  border-bottom: 2px solid rgb(198, 196, 196);
  box-sizing: border-box;
}

/* 一级标题内容 */
#nice h1 .content {
  padding-top: 5px;
  padding-bottom: 5px;
  color: rgb(160, 160, 160);
  font-size: 13px;
  line-height: 2;
  box-sizing: border-box;
}

/* 一级标题修饰 请参考有实例的主题 */
#nice h1:after {
}

/* 二级标题 */
#nice h2 {
  margin: 10px auto;
  height: 40px;
  background-color: rgb(251, 251, 251);
  border-bottom: 1px solid rgb(246, 246, 246);
  overflow: hidden;
  box-sizing: border-box;
}

/* 二级标题内容 */
#nice h2 .content {
  margin-left: -10px;
  display: inline-block;
  width: auto;
  height: 40px;
  background-color: rgb(33, 33, 34);
  border-bottom-right-radius: 100px;
  color: rgb(255, 255, 255);
  padding-right: 30px;
  padding-left: 30px;
  line-height: 40px;
  font-size: 16px;
}

/* 二级标题修饰 请参考有实例的主题 */
#nice h2:after {
}

/* 三级标题 */
#nice h3 {
  margin: 20px auto 5px;
  border-top: 1px solid rgb(221, 221, 221);
  box-sizing: border-box;
}

/* 三级标题内容 */
#nice h3 .content {
  margin-top: -1px;
  padding-top: 6px;
  padding-right: 5px;
  padding-left: 5px;
  font-size: 17px;
  border-top: 2px solid rgb(33, 33, 34);
  display: inline-block;
  line-height: 1.1;
}

/* 三级标题修饰 请参考有实例的主题 */
#nice h3:after {
}

#nice h4 {
  margin: 10px auto -1px;
  border-top: 1px solid rgb(221, 221, 221);
  box-sizing: border-box;
}

#nice h4 .content {
  margin-top: -1px;
  padding-top: 6px;
  padding-right: 5px;
  padding-left: 5px;
  font-size: 16px;
  border-top: 2px solid rgb(33, 33, 34);
  display: inline-block;
  line-height: 1.1;
}

/* 无序列表整体样式
 * list-style-type: square|circle|disc;
 */
#nice ul {
}

/* 有序列表整体样式
 * list-style-type: upper-roman|lower-greek|lower-alpha;
 */
#nice ol {
}

/* 列表内容，不要设置li
 */
#nice li section {
  font-size: 15px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans,
    sans-serif;
}

/* 引用
 * 左边缘颜色 border-left-color: black;
 * 背景色 background: gray;
 */
#nice blockquote {
  border-left-color: rgb(221, 221, 221);
  margin-top: 1.2em;
  margin-bottom: 1.2em;
  padding-right: 1em;
  padding-left: 1em;
  border-left-width: 4px;
  color: rgb(119, 119, 119);
  quotes: none;
}

/* 引用文字 */
#nice blockquote p {
  font-size: 15px;
  font-family: -apple-system-font, BlinkMacSystemFont, "Helvetica Neue",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei",
    Arial, sans-serif;
  color: rgb(119, 119, 119);
  line-height: 1.75em;
}

/* 链接 
 * border-bottom: 1px solid #009688;
 */
#nice a {
  color: rgb(239, 112, 96);
  border-bottom: 1px solid rgb(239, 112, 96);
}

/* 加粗 */
#nice strong {
}

/* 斜体 */
#nice em {
}

/* 加粗斜体 */
#nice em strong {
}

/* 删除线 */
#nice del {
}

/* 分隔线
 * 粗细、样式和颜色
 * border-top: 1px solid #3e3e3e;
 */
#nice hr {
}

/* 图片
 * 宽度 width: 80%;
 * 居中 margin: 0 auto;
 * 居左 margin: 0 0;
 */
#nice img {
}

/* 图片描述文字 */
#nice figcaption {
}

/* 行内代码 */
#nice p code,
#nice li code {
  color: rgb(239, 112, 96);
}

/* 非微信代码块
 * 代码块不换行 display: -webkit-box !important;
 * 代码块换行 display: block;
 */
#nice pre code {
}

/*
 * 表格内的单元格
 * 字体大小 font-size: 16px;
 * 边框 border: 1px solid #ccc;
 * 内边距 padding: 5px 10px;
 */
#nice table tr th,
#nice table tr td {
}

/* 脚注文字 */
#nice .footnote-word {
  color: #ff3502;
}

/* 脚注上标 */
#nice .footnote-ref {
  color: rgb(239, 112, 96);
}

#nice .qrcode-box {
  border-radius: 0.25rem;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  --tw-text-opacity: 1;
  color: rgba(113, 128, 150, var(--tw-text-opacity));
  align-items: center;
  color: rgba(113, 128, 150, 0.6);
  background-color: rgb(246, 246, 246);
  min-height: 122px;
}

#nice .qrcode-box .qrcode-link {
  color: rgba(113, 128, 150, 0.6);
  font-size: 12px;
}

#nice .qrcode-box .qrcode-link-bg {
  flex: 1;
}
#nice .qrcode-box .qrcode-link-bg p,
#nice .qrcode-box .qrcode-link-bg p > strong {
  color: rgba(113, 128, 150, 0.6);
  font-size: 14px;
}

#nice .qrcode-box .qrcode {
  disply: inline-block;
  width: 100px;
  height: 100px;
}

/* "参考资料"四个字 
 * 内容 content: "参考资料";
 */
#nice .footnotes-sep:before {
}

/* 参考资料编号 */
#nice .footnote-num {
}

/* 参考资料文字 */
#nice .footnote-item p {
}

/* 参考资料解释 */
#nice .footnote-item p em {
}

/* 行间公式
 * 最大宽度 max-width: 300% !important;
 */
#nice .block-equation svg {
}

/* 行内公式
 */
#nice .inline-equation svg {
}
`;
