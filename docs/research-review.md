# README 助手调研评审

## 输入材料

这次产品判断来自三类材料：

- 用户给出的 Good / Not so good 清单：README 是开源项目第一张名片，不应写成商业宣传页。
- 用户给出的结构图：顶部导航、Logo、Slogan、Badges、Quick Install、What is this、GIF、X vs Y、Documentation、Contributing。
- 外部参考：[awesome-readme](https://github.com/matiassingers/awesome-readme)、[GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)、[Standard Readme](https://github.com/RichardLitt/standard-readme)。

## 关键判断

README 助手不应该只是“套模板”。已有项目的问题通常不是缺少 Markdown，而是缺少项目事实的整理顺序：项目给谁用、解决什么问题、如何 10 分钟跑起来、有什么视觉证据、社区是否仍然活跃。

GitHub 搜索结果里的 README 承担了筛选作用。项目名、一句话定位、徽章、关键词、文档入口、贡献入口，需要在前两屏让读者判断“这是不是我要找的项目”。

用户图里的 README 架构是合理的：先建立信任和定位，再给快速开始，再用 GIF 或截图解释核心路径，随后说明差异、文档和贡献方式。这个顺序比传统“安装、使用、API”更适合第一次访问。

## 反模式

- 商业宣传压过工程事实：很多形容词，但没有安装、运行、贡献路径。
- 中文英文混写：技术词可以保留英文，但正文主语言应该一致。
- 过短：只有一句简介和安装命令，读者无法判断边界。
- 过长：把设计文档、教程和博客全部塞进 README，导致 10 分钟内无法理解项目。
- 缺少视觉证据：没有截图、GIF、asciinema 或视频，读者只能靠想象。

## 产品定位

ReadmeHub 面向“已经有代码，但 README 混乱或缺失”的项目维护者。它先做评审，再生成 README，而不是直接替用户写一篇完整宣传文案。

核心模块：

- 项目事实表单：收集定位、受众、场景、安装、运行、视觉素材、贡献方式。
- README 评审：按定位、搜索、上手、视觉、结构、差异、社区、语言一致性打分。
- Markdown 生成：输出 GitHub 友好的 README，支持实时预览、源码查看、复制、下载。
- 内容骨架：把用户图片中的结构转换为可操作的 README 顺序。

## 评分规则

| 维度 | 权重 | 检查点 |
| --- | --- | --- |
| 定位清晰 | 高 | 项目名、一句话、描述、目标读者、使用场景 |
| 10 分钟上手 | 高 | 环境要求、安装命令、启动命令、阅读时长 |
| 结构完整 | 高 | 导航、文档、贡献、License |
| GitHub 搜索友好 | 中 | 关键词、徽章、仓库链接、文档入口 |
| 图文与演示 | 中 | 截图、GIF、视频、demo 链接 |
| 差异表达 | 中 | X vs Y、替代方案、项目边界 |
| 社区可信度 | 中 | 贡献说明、问题反馈、维护状态 |
| 语言一致 | 低 | 主语言、语气、避免中英文正文混杂 |

## MVP 取舍

当前版本先做本地前端工具，不接 GitHub API，不自动读取仓库文件。原因是 README 质量首先取决于维护者对项目事实的确认；自动扫描可以作为后续增强。

下一步可以加入：

- 从 GitHub URL 拉取 README、package.json、license、topics。
- 按项目类型生成不同模板：CLI、库、Web App、模型、数据集、awesome-list。
- 输出英文版与中文版，避免在同一份 README 中混写。
- 对生成内容做可访问性、链接有效性、徽章有效性检查。
