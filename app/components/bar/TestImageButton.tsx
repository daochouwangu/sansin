"use client";
import QRCode from "qrcode";

export const TestImageButton = () => {
  const testFormats = async () => {
    // 生成一个测试用的二维码
    const url = "https://example.com";

    // 测试 Base64
    const base64 = await QRCode.toDataURL(url);

    // 创建一个包含不同格式图片的HTML
    const htmlStr = `
      <div>
        <p>Base64 测试:</p>
        <img src="${base64}" style="width:100px;height:100px;">
      </div>
    `;

    // 复制到剪贴板
    const html = new Blob([htmlStr], { type: "text/html" });
    const item = new ClipboardItem({
      [html.type]: html,
      "text/plain": new Blob([htmlStr], { type: "text/plain" }),
    });

    try {
      await navigator.clipboard.write([item]);
      alert("已复制到剪贴板,请在公众号编辑器中粘贴测试");
    } catch (err) {
      console.error("复制失败: ", err);
    }
  };

  return (
    <button
      className="bg-blue-500 w-20 h-8 text-white text-bold rounded"
      onClick={testFormats}
    >
      测试图片
    </button>
  );
};
