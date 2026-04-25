# ReadmeHub

![Build](https://img.shields.io/badge/build-passing-2563eb)
![README](https://img.shields.io/badge/readme-ready-0f766e)
![License](https://img.shields.io/badge/license-MIT-2f855a)
![Contributors](https://img.shields.io/badge/contributors-welcome-f59e0b)

把已有开源项目整理成 10 分钟可理解的 README。

[调研评审](docs/research-review.md) · [快速开始](#快速开始) · [功能](#功能) · [贡献](#贡献) · [License](#license)

## 项目定位

ReadmeHub 是一个面向已有开源项目的 README 助手。它把维护者手里的项目事实、安装路径、截图/GIF、差异点和社区入口整理成一份 GitHub 友好的 README，并在生成前给出结构化评审。

| 项目状态 | 目标读者 | 主要场景 | 技术栈 |
| --- | --- | --- | --- |
| 实验中 | 开源项目维护者、独立开发者、技术内容创作者 | 发布项目、重写 README、提交 awesome-list | React + TypeScript + Vite |

## 功能

- 项目事实表单：收集定位、受众、场景、安装、运行、视觉素材、贡献方式。
- README 质量评审：检查定位、GitHub 搜索、10 分钟上手、视觉证据、结构完整度、差异表达、社区可信度、语言一致性。
- 内容骨架：把 Navigation、Logo/Slogan、Badges、Quick Install、What is this、GIF、X vs Y、Docs、Contributing 转成可执行顺序。
- Markdown 生成：实时输出 GitHub 风格 README。
- 预览与源码：支持渲染预览、源码查看、复制、下载 README.md。

## 快速开始

环境要求：

- Node.js 20+
- npm 10+

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 截图

当前版本是本地前端工具，核心界面由三栏组成：

- 左侧：项目事实输入。
- 中间：README 质量评审与内容骨架。
- 右侧：README 预览和 Markdown 源码。

## 调研依据

产品判断记录在 [docs/research-review.md](docs/research-review.md)。主要参考：

- [awesome-readme](https://github.com/matiassingers/awesome-readme)
- [GitHub Docs: About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes)
- [Standard Readme](https://github.com/RichardLitt/standard-readme)

## 为什么选择 ReadmeHub

| 维度 | 常见做法 | ReadmeHub |
| --- | --- | --- |
| 信息来源 | 复制模板后再填空 | 先收集项目事实，再生成 README |
| 质量判断 | 只看 Markdown 是否完整 | 按 README 的真实阅读路径打分 |
| 视觉素材 | 截图和 GIF 经常被遗忘 | 把视觉证据列为独立评审项 |
| 社区入口 | 贡献方式放在末尾或缺失 | 把贡献、Issue、License 纳入基础骨架 |

## 项目结构

```text
readmehub/
  docs/
    research-review.md
  LICENSE
  src/
    App.tsx
    App.css
    index.css
```

## 贡献

欢迎提交 issue 和 pull request，尤其是：

- 新的 README 诊断规则。
- 不同项目类型的模板：CLI、库、Web App、模型、数据集、awesome-list。
- 中英文分离生成策略。
- GitHub 仓库自动读取与链接检查。

## License

MIT
