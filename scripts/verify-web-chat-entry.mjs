import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const readme = (await fs.readFile(path.join(repositoryRoot, "README.md"), "utf8"))
  .replace(/\r\n?/g, "\n");
const entrypoint = (await fs.readFile(path.join(repositoryRoot, "AI-ENTRYPOINT.md"), "utf8"))
  .replace(/\r\n?/g, "\n");
const llmsIndex = (await fs.readFile(path.join(repositoryRoot, "llms.txt"), "utf8"))
  .replace(/\r\n?/g, "\n");
const agentInstructions = (await fs.readFile(path.join(repositoryRoot, "AGENTS.md"), "utf8"))
  .replace(/\r\n?/g, "\n");
const fictionalExample = (await fs.readFile(
  path.join(repositoryRoot, "examples", "fictional-product-example.md"),
  "utf8",
)).replace(/\r\n?/g, "\n");

const beginMarker = "WEB-CHAT-PROTOCOL-BEGIN:V1";
const endMarker = "WEB-CHAT-PROTOCOL-END:V1";
const begin = readme.indexOf(beginMarker);
const end = readme.indexOf(endMarker);

const errors = [];

if (begin < 0) errors.push(`Missing ${beginMarker}`);
if (end < 0) errors.push(`Missing ${endMarker}`);
if (begin >= 0 && end >= 0 && end <= begin) {
  errors.push("Web-chat protocol markers are out of order");
}

if (begin >= 0 && begin > 4000) {
  errors.push("Web-chat protocol starts too far down the README");
}

if (begin >= 0 && end > begin) {
  const protocol = readme.slice(begin, end + endMarker.length);
  const contractBeginMarker = "OUTPUT-CONTRACT-BEGIN:V1";
  const contractEndMarker = "OUTPUT-CONTRACT-END:V1";
  const contractBegin = protocol.indexOf(contractBeginMarker);
  const contractEnd = protocol.indexOf(contractEndMarker);

  if (contractBegin < 0) errors.push(`Missing ${contractBeginMarker}`);
  if (contractEnd < 0) errors.push(`Missing ${contractEndMarker}`);
  if (contractBegin >= 0 && contractEnd >= 0 && contractEnd <= contractBegin) {
    errors.push("Output-contract markers are out of order");
  }

  const requiredPhrases = [
    "不自行增加未经确认的",
    "已确认",
    "创意提案",
    "待确认",
    "参考素材",
    "无法逐帧读取",
    "不得自行扩写成某个品牌全称",
    "不要自动生成模型专用 Prompt",
    "总时长【T】秒整，共制作【N】组",
    "总剧情/全局要求固定为",
    "**【0–X秒｜本段目的或剧情节点】。",
    "只输出整理后的完整需求制作文本",
    "每个时间段是同一份需求稿中的一个完整执行块",
    "不得把两种职责拆成两份文档",
    "AI生成师负责：",
    "设计师负责（剪辑）：",
    "总剧情/全局要求固定为",
    "最终输出只能是一份合并稿",
    "每一个带起止秒数的时间段都必须",
    "两条责任标签的出现次数必须与时间段数量完全一致",
    "不得把参考素材缺失、语言版本说明、验收说明或待确认事项伪装成时间段",
    "不要先列待确认问题",
    "正文中直接标记必要的【待确认】",
    "在输出前静默完成时长、台词可朗读性、人物和场景连续性",
  ];

  for (const phrase of requiredPhrases) {
    if (!protocol.includes(phrase)) {
      errors.push(`Web-chat protocol is missing required phrase: ${phrase}`);
    }
  }

  const forbiddenDependencies = [
    "完整读取 `llms-full.txt`",
    "读取 AI-ENTRYPOINT.md",
    "再读取用户指定的版本文件",
  ];

  const forbiddenOutputScaffolds = [
    "镜头/画面：写清",
    "人物设定：写清",
    "人物动作：按先后",
    "执行前检查：",
    "先列出最少但必要的待确认问题",
  ];

  for (const phrase of forbiddenDependencies) {
    if (protocol.includes(phrase)) {
      errors.push(`Web-chat protocol is not self-contained: ${phrase}`);
    }
  }


  for (const phrase of forbiddenOutputScaffolds) {
    if (protocol.includes(phrase)) {
      errors.push(`Web-chat protocol still contains checklist-style output scaffold: ${phrase}`);
    }
  }
}

const staleLiveLinks = [
  ["AI-ENTRYPOINT.md", entrypoint],
  ["llms.txt", llmsIndex],
  ["AGENTS.md", agentInstructions],
];

for (const [fileName, content] of staleLiveLinks) {
  if (/raw\.githubusercontent\.com\/null287\/ai-video-request-compiler\/v1\//.test(content)) {
    errors.push(`${fileName} still points ordinary execution to the stale v1 tag`);
  }
}

const exampleTimeSegments = fictionalExample.match(
  /\*\*\d+(?:\.\d+)?[–-]\d+(?:\.\d+)?秒｜/g,
) ?? [];
const exampleGeneratorLabels = fictionalExample.match(/\*\*AI生成师负责：\*\*/g) ?? [];
const exampleDesignerLabels = fictionalExample.match(/\*\*设计师负责（剪辑）：\*\*/g) ?? [];

if (exampleTimeSegments.length === 0) {
  errors.push("Fictional example contains no executable time segments");
}
if (exampleGeneratorLabels.length !== exampleTimeSegments.length) {
  errors.push(
    `Fictional example has ${exampleTimeSegments.length} time segments but ${exampleGeneratorLabels.length} AI-generator responsibility labels`,
  );
}
if (exampleDesignerLabels.length !== exampleTimeSegments.length) {
  errors.push(
    `Fictional example has ${exampleTimeSegments.length} time segments but ${exampleDesignerLabels.length} designer responsibility labels`,
  );
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log("Web-chat entry is self-contained and complete.");
}
