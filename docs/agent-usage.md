# Agent 调用 ReadmeHub

这份文档说明如何让 Codex、Claude Code、Cursor Agent 等代码 agent 使用 ReadmeHub 的 README 标准来改造其他项目。

ReadmeHub 当前有两种使用方式：

- 前端工具：启动本地页面，手动填写项目事实并生成 README。
- Agent 工作流：让 agent 读取 ReadmeHub 的结构和目标项目事实，直接改造目标项目的 README。

## 推荐方式

当目标项目已经在本机时，推荐让 agent 按以下顺序工作：

1. 读取 ReadmeHub 的标准：
   - `README.md`
   - `docs/research-review.md`
   - `src/App.tsx` 中的 `buildGeneratedReadme()` 和 `buildAudit()`
2. 读取目标项目事实：
   - `README.md`
   - `package.json`、`pyproject.toml`、`requirements.txt` 等技术栈文件
   - `docs/`、`scripts/`、`src/`、`tests/`、`LICENSE`
   - `git status --short --branch`
3. 生成或改写目标 README：
   - 顶部放项目名、一句话定位、徽章和导航
   - 前两屏说明目标读者、使用场景、技术栈和 10 分钟上手路径
   - 保留功能、快速开始、项目结构、文档、贡献、License 和底部 Star 进展图
   - 明确边界、风险和不可替代的人类判断
4. 验证改动：
   - `git diff --check`
   - 若目标项目有测试或构建脚本，按项目自己的入口跑最小检查
5. 由用户决定是否提交和推送。

## 可直接使用的提示词

把下面这段发给 agent，并替换目标项目路径：

```text
请使用 /Users/lishu/Documents/projects/readmehub 的 README 标准，改造 <目标项目路径> 的 README。

要求：
- 先读取 readmehub/README.md、docs/research-review.md，并参考 src/App.tsx 里的 buildGeneratedReadme 和 buildAudit 逻辑。
- 再读取目标项目的 README、配置文件、脚本、docs 和测试入口，先基于事实改写，不要凭空编造功能。
- README 需要包含：项目名、徽章、一句话定位、导航、项目定位表、功能、快速开始、运行流程或使用方式、为什么选择、项目结构、文档、贡献或维护说明、License、底部 Star 进展图。
- 如果项目涉及医疗、财务、密钥、个人数据或本地运行状态，必须写清安全边界和不要提交的文件。
- 改完后运行 git diff --check；如果目标项目有明确的测试/构建命令，也运行最小验证。
- 只在我明确要求时提交和推送。
```

## 针对缺失 README 的项目

如果目标项目没有 README，让 agent 先做事实盘点：

```text
请先评估 <目标项目路径> 的项目事实，不要急着写 README。

请输出：
- 项目是什么
- 目标读者是谁
- 主要使用场景
- 技术栈和入口文件
- 安装/运行命令
- 哪些目录是源码、文档、样例、运行数据、私有配置
- 哪些内容不应该进入 Git

然后再按 ReadmeHub 标准创建 README.md。
```

## 注意事项

- Agent 不应该只套模板，必须先读目标项目事实。
- 对本地工具、内部项目、医疗或家庭数据项目，README 应优先写清安全边界和运行前提。
- 对已经存在 README 的项目，优先保留真实命令、真实路径和真实限制。
- 对外部分享来源、演讲、文章或教程，能确认作者账号时应加链接，不能确认时只写文本来源。
- 如果目标项目还没有 License，不要替用户擅自添加开源协议；只在 README 中写明“未指定”。
