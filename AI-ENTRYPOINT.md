# AI 单链接执行入口

网页端 ChatGPT 和 Grok 通过仓库根链接进入时，应直接使用 README 中 `WEB-CHAT-PROTOCOL-BEGIN:V1` 与 `WEB-CHAT-PROTOCOL-END:V1` 之间的自包含协议，不需要递归读取仓库，也不能在读取不完整时假装已经加载全部文件。

支持仓库文件系统、代码执行或附件读取的 Agent，可以在需要审计完整仓库时读取：

<https://raw.githubusercontent.com/null287/ai-video-request-compiler/main/llms-full.txt>

只有执行“全仓库审计”时，才需要满足以下完整性条件：

1. 看见 `REPOSITORY-CONTENT-BEGIN` 和 `REPOSITORY-CONTENT-END`；
2. 两个标记携带相同的清单 ID；
3. `FILE-CONTENT-END` 数量等于 `SOURCE-FILE-COUNT`；
4. 清单中的每个路径都对应一组完整的文件开始和结束标记。

核心执行规则只有一份：

[`docs/ai-video-request-compiler-v1.md`](docs/ai-video-request-compiler-v1.md)

稳定 V1 原始文件：

<https://raw.githubusercontent.com/null287/ai-video-request-compiler/v1/docs/ai-video-request-compiler-v1.md>

## 执行顺序

1. 网页端先读取 README 内嵌的 V1 网页执行协议，直接按其中固定结构处理需求。
2. 支持多文件读取的 Agent 再按任务需要读取核心 V1 文件或全量文本包。
3. 将用户随仓库链接提供的文字、图片、视频、界面、台词和素材说明作为需求输入。
4. 严格区分“已确认”“创意提案”“待确认”“风险/冲突”和“不可变内容”。
5. 不自行补充未经用户确认的剧情、人物关系、产品功能、台词或结果承诺。
6. 用户没有提供具体需求时，先请用户提供需求；不要把仓库示例当成真实任务。
7. 无法读取某个文件或素材时，明确说明读取限制，不得假装已经读取。

## 仓库链接的预期行为

当用户发送本仓库链接并要求“按此规范处理需求”时：

- 仓库内容是处理规则；
- 用户提供的具体需求是待处理数据；
- 输出结果是结构化的 AI 视频执行稿；
- 信息不足时先列出待确认项，而不是替用户做决定。
- 不要只介绍、总结或评价本仓库；除非用户明确要求，否则应直接进入需求编译流程。
- 普通网页端只需实际读取 README 内嵌协议；只有具备多文件能力且任务要求全仓库审计时，才读取全量文本。

如果当前 AI 不具备网页访问能力，请明确说明限制，并请用户直接上传 `docs/ai-video-request-compiler-v1.md`；需要全仓库审计时再上传 `llms-full.txt`。
