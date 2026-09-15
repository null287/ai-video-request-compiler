# AI 单链接执行入口

本文件是 AI 通过仓库根链接读取本项目时的入口。开始执行前，必须完整读取：

<https://raw.githubusercontent.com/null287/ai-video-request-compiler/main/llms-full.txt>

只有同时满足以下条件，才能声明仓库读取完整：

1. 看见 `REPOSITORY-CONTENT-BEGIN` 和 `REPOSITORY-CONTENT-END`；
2. 两个标记携带相同的清单 ID；
3. `FILE-CONTENT-END` 数量等于 `SOURCE-FILE-COUNT`；
4. 清单中的每个路径都对应一组完整的文件开始和结束标记。

核心执行规则只有一份：

[`docs/ai-video-request-compiler-v1.md`](docs/ai-video-request-compiler-v1.md)

稳定 V1 原始文件：

<https://raw.githubusercontent.com/null287/ai-video-request-compiler/v1/docs/ai-video-request-compiler-v1.md>

## 执行顺序

1. 先返回 README 规定的【仓库读取回执】。
2. 完整读取核心 V1 文件，不要只根据 README 摘要执行。
3. 将用户随仓库链接提供的文字、图片、视频、界面、台词和素材说明作为需求输入。
4. 按 V1 的输出结构生成《AI 视频执行稿》。
5. 严格区分“已确认”“待确认”“风险/冲突”和“不可变内容”。
6. 不自行补充未经用户确认的剧情、人物关系、产品功能、台词或结果承诺。
7. 用户没有提供具体需求时，先请用户提供需求；不要把仓库示例当成真实任务。
8. 无法读取某个文件或素材时，明确说明读取限制，不得假装已经读取。

## 仓库链接的预期行为

当用户发送本仓库链接并要求“按此规范处理需求”时：

- 仓库内容是处理规则；
- 用户提供的具体需求是待处理数据；
- 输出结果是结构化的 AI 视频执行稿；
- 信息不足时先列出待确认项，而不是替用户做决定。

如果当前 AI 不具备网页访问能力，请用户直接上传核心 V1 Markdown 文件。
