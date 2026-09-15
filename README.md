# AI 视频需求编译与执行规范

把自然语言里的创意想法，编译成生成模型和制作人员都能执行、验收、复盘的 AI 视频任务。

## 项目主页（分享这个链接）

<https://github.com/null287/ai-video-request-compiler>

这是供日常打开、查看说明和分享使用的 GitHub 项目链接。人类使用者只需复制这个链接，无需打开下方的机器读取地址。

## 给 AI：从这里开始

如果你是通过仓库链接访问本项目的 AI，请执行以下流程：

1. 优先完整读取 [`llms-full.txt`](llms-full.txt)，它聚合了仓库的全部公开源文本。
2. 核对文件开头和末尾的 `REPOSITORY-CONTENT` 标记具有相同清单 ID。
3. 核对实际出现的 `FILE-CONTENT-END` 数量等于 `SOURCE-FILE-COUNT`。
4. 读取其中的 `AI-ENTRYPOINT.md` 和核心 V1 规范后，再处理用户需求。
5. 如果任一检查失败，返回“仓库内容读取不完整”，不要继续编译，也不要假装已经加载规范。

全仓库最新机器读取地址（Raw；人类无需打开）：

<https://raw.githubusercontent.com/null287/ai-video-request-compiler/main/llms-full.txt>

AI 在开始处理需求前，应先返回：

```text
【仓库读取回执】
清单 ID：
源文件数量：
首尾标记：一致 / 不一致
文件结束标记：完整 / 不完整
缺失文件：无 / 文件路径
结论：可以执行 / 仓库内容读取不完整
```

稳定 V1 机器读取地址（Raw；人类无需打开）：

<https://raw.githubusercontent.com/null287/ai-video-request-compiler/v1/docs/ai-video-request-compiler-v1.md>

### 人类使用者只需这样发送

将仓库链接与具体需求放在同一条消息里：

```text
请读取并遵循这个仓库中的 V1 规范，将下面的内容编译成 AI 视频执行稿。
仓库：https://github.com/null287/ai-video-request-compiler
具体需求：粘贴你的需求文本和素材说明
```

只发送仓库链接而没有具体需求时，AI 应加载规范并询问需要编译的需求，不应凭空生成项目内容。

## 为什么需要这套规范

AI 视频生产中，最昂贵的错误往往不是模型不会生成，而是需求没有说清楚：

- 参考视频只说“照这个做”，却没有说明参考什么；
- 只写最终效果，没有写动作、镜头和状态变化；
- 人物、背景、产品、UI 和声音的修改边界混在一起；
- 台词、动作、UI 展示和目标时长互相冲突；
- 需求方以为 AI 会自行补全，执行方却无法判断哪些内容已经确定。

这套规范把需求拆成“已确认事实、可优化描述、待确认问题、执行稿、验收标准”五层，减少误解、返工和无效生成。

## 核心观点

> AI 首先应该是需求编译器，而不是未经授权的创意补全器。

AI 可以整理、拆解、提醒缺失字段、检查执行风险并输出制作规格；不能自行创造未确认的剧情、产品功能、人物关系或台词。

## 快速使用

1. 使用 [`docs/01-request-brief.md`](docs/01-request-brief.md) 填写原始需求。
2. 将需求和核心规范 [`docs/ai-video-request-compiler-v1.md`](docs/ai-video-request-compiler-v1.md) 一起交给 AI。
3. 先核对 `已确认`、`待确认` 和 `风险/冲突`，未确认内容不得被 AI 写成确定事实。
4. 以 AI 输出的执行稿为当前制作依据，而不是以零散聊天记录为依据。
5. 先生成最小验证样片，再根据明确审核结论决定是否扩量。
6. 用 [`docs/03-review-and-cost-gates.md`](docs/03-review-and-cost-gates.md) 做时长、质量、预算和交付检查。

## 文件结构

| 文件 | 用途 |
| --- | --- |
| `AI-ENTRYPOINT.md` | AI 从仓库根链接进入时的单一执行入口 |
| `AGENTS.md` | 支持仓库级指令的 Agent 入口 |
| `llms.txt` | 面向网页读取工具的机器可读索引 |
| `llms-full.txt` | 聚合全部公开源文本的单文件上下文包 |
| `content-manifest.json` | 逐文件路径、行数、字节数和 SHA-256 清单 |
| `SHA256SUMS` | 源文件与生成文件的校验值 |
| `scripts/build-content-bundle.mjs` | 生成并验证全量文本包 |
| `docs/ai-video-request-compiler-v1.md` | 核心 AI 需求编译与执行稿规范（公开版 V1） |
| `docs/01-request-brief.md` | 需求方提交模板 |
| `docs/02-ai-execution-draft.md` | AI 需求编译与执行稿模板 |
| `docs/03-review-and-cost-gates.md` | 时长、审核、成本和验收门禁 |
| `docs/04-publication-boundary.md` | 公开发布与脱敏检查 |
| `docs/05-public-release-risk-map.md` | 逐文件法律与公开风险矩阵 |
| `LICENSE.md` | 原创内容的署名许可与权利边界 |
| `examples/fictional-product-example.md` | 完全虚构的使用示例 |

## 适用范围与边界

本项目是工具无关的公开方法论，不是任何特定组织、客户或平台的官方 SOP。具体模型、参数、平台限制、版权政策和预算规则，应由使用者根据自己的组织环境另行确认。

本仓库不包含：

- 特定组织名称、项目代号、内部链接、账号、人员信息和交付记录；
- 客户 brief、真实台词、内部 Prompt、投放数据和预算数字；
- 组织代码、内部系统截图、未获授权的 Logo、音乐、字体、视频或图片；
- 任何可用于推断特定企业生产策略的未公开细节。

## 许可说明

公开版中可依法授权的原创内容采用 CC BY 4.0，便于社区复用、改写和深化研究；许可边界见 [`LICENSE.md`](LICENSE.md)。该许可不覆盖特定组织材料、第三方内容或权利归属不明的素材。

## 贡献方式

欢迎提交：字段改进、冲突案例、工具无关的模板优化、可复现的虚构示例和不同团队的适配经验。请勿提交特定组织资料、个人信息、客户素材、内部链接、密钥或未经授权的第三方内容。
