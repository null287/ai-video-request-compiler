import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const readme = (await fs.readFile(path.join(repositoryRoot, "README.md"), "utf8"))
  .replace(/\r\n?/g, "\n");

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
  const requiredPhrases = [
    "不自行增加未经确认的",
    "已确认",
    "创意提案",
    "待确认",
    "参考素材",
    "无法逐帧读取",
    "不得自行扩写成某个品牌全称",
    "不要自动生成模型专用 Prompt",
    "视频执行时间轴",
    "时长可执行检查",
    "生成前风险",
    "最终验收标准",
    "当前状态",
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

  for (const phrase of forbiddenDependencies) {
    if (protocol.includes(phrase)) {
      errors.push(`Web-chat protocol is not self-contained: ${phrase}`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
} else {
  console.log("Web-chat entry is self-contained and complete.");
}
