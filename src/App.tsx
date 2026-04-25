import { useMemo, useState, type CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Clipboard,
  Code2,
  Download,
  Eye,
  FileText,
  Image,
  Languages,
  Link as LinkIcon,
  ListChecks,
  Navigation,
  Rocket,
  Sparkles,
  Target,
  Users,
  Wand2,
} from 'lucide-react'
import './App.css'

type ProjectLanguage = '中文' | 'English'
type ProjectStatus = '实验中' | '活跃维护' | '稳定'
type ProjectTone = '社区友好' | '工程直接' | '产品克制'
type PreviewMode = 'preview' | 'source'
type AuditState = 'good' | 'warning' | 'danger'

type ProjectInput = {
  projectName: string
  tagline: string
  description: string
  audience: string
  scenario: string
  repoUrl: string
  websiteUrl: string
  docsUrl: string
  demoUrl: string
  installCommand: string
  quickStartCommand: string
  requirements: string
  features: string
  badges: string
  visualPlan: string
  competitors: string
  advantages: string
  navItems: string
  contributing: string
  community: string
  license: string
  language: ProjectLanguage
  status: ProjectStatus
  tone: ProjectTone
  existingReadme: string
}

type AuditItem = {
  title: string
  score: number
  weight: number
  state: AuditState
  evidence: string
  action: string
  Icon: typeof Target
}

const initialProject: ProjectInput = {
  projectName: 'ReadmeHub',
  tagline: '把已有项目整理成 10 分钟可理解的 README',
  description:
    'ReadmeHub 面向已经有代码、但 README 混乱或缺失的开源项目。它把项目事实、安装路径、视觉素材、社区入口和差异点整理成一份 GitHub 友好的 README。',
  audience: '开源项目维护者、第一次接触项目的新手、潜在贡献者',
  scenario: '项目准备发布、重写 README、提交 awesome-list、参加 hackathon 后整理成果',
  repoUrl: 'https://github.com/yourname/readmehub',
  websiteUrl: '',
  docsUrl: 'https://github.com/yourname/readmehub#readme',
  demoUrl: '',
  installCommand: 'npm install',
  quickStartCommand: 'npm run dev',
  requirements: 'Node.js 20+\nnpm 10+',
  features:
    'README 结构诊断\nGitHub 搜索可读性检查\n项目定位与受众梳理\n导航、徽章、视觉素材建议\nAI / Agent 调用说明生成\nMarkdown 实时预览与复制',
  badges: 'build passing\nlicense MIT\nreadme ready\ncontributors welcome',
  visualPlan:
    'README 顶部放产品截图\n用 30 秒 GIF 展示从填写项目事实到复制 README\n文档区保留安装成功截图',
  competitors: '空白 README\nAI 直接代写\n手工复制模板',
  advantages: '先评审再生成\n围绕已有项目事实\n中文与英文版本分开维护\n把贡献入口放到可见位置',
  navItems: '功能\n快速开始\n截图\nAI 调用\n文档\n贡献\nLicense',
  contributing:
    '欢迎提交 README 案例、诊断规则、模板片段和多语言翻译。请先开 issue 描述项目类型与目标读者。',
  community: 'GitHub Issues / Discussions',
  license: 'MIT',
  language: '中文',
  status: '活跃维护',
  tone: '工程直接',
  existingReadme: '',
}

const readmeStructure = [
  {
    title: 'Navigation',
    label: '导航',
    note: 'Website / Docs / Install / Contributing',
    Icon: Navigation,
  },
  {
    title: 'Logo + Slogan',
    label: '识别',
    note: '项目名、一句话定位、状态徽章',
    Icon: BadgeCheck,
  },
  {
    title: 'What is this',
    label: '定位',
    note: '对象、问题、使用场景',
    Icon: Target,
  },
  {
    title: 'GIF / Video',
    label: '演示',
    note: '命令行、UI、核心路径',
    Icon: Image,
  },
  {
    title: 'X vs Y',
    label: '差异',
    note: '与替代方案的边界',
    Icon: ListChecks,
  },
  {
    title: 'Install + Docs',
    label: '上手',
    note: '安装、运行、文档、贡献',
    Icon: Rocket,
  },
  {
    title: 'AI / Agent',
    label: '调用',
    note: '让 AI 读懂项目并安全接手',
    Icon: Wand2,
  },
]

function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function compact(value: string, fallback: string) {
  return value.trim() || fallback
}

function slugifyHeading(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
}

function escapeShieldSegment(value: string) {
  return encodeURIComponent(value.trim().replace(/-/g, '--')).replace(/%20/g, '%20')
}

function badgeMarkdown(label: string, license: string) {
  const lower = label.toLowerCase()

  if (lower.includes('license')) {
    return `![License](https://img.shields.io/badge/license-${escapeShieldSegment(
      license || 'MIT',
    )}-2f855a)`
  }

  if (lower.includes('build')) {
    return '![Build](https://img.shields.io/badge/build-passing-2563eb)'
  }

  if (lower.includes('contributor')) {
    return '![Contributors](https://img.shields.io/badge/contributors-welcome-f59e0b)'
  }

  if (lower.includes('readme')) {
    return '![README](https://img.shields.io/badge/readme-ready-0f766e)'
  }

  const safeLabel = escapeShieldSegment(label)
  return `![${label}](https://img.shields.io/badge/${safeLabel}-ready-475569)`
}

function toMarkdownList(value: string, fallback: string) {
  const items = splitLines(value)
  if (!items.length) {
    return `- ${fallback}`
  }

  return items.map((item) => `- ${item}`).join('\n')
}

function toCommandBlocks(value: string) {
  const commands = splitLines(value)
  if (!commands.length) {
    return '```bash\n# 待补充命令\n```'
  }

  return commands.map((command) => `\`\`\`bash\n${command}\n\`\`\``).join('\n\n')
}

function buildAgentUsage(name: string) {
  return `## AI 调用

如果希望让 Codex、Claude Code、Cursor Agent 等 AI agent 接手这个项目，建议把下面这段作为调用提示词：

\`\`\`text
请先阅读本项目的 README、配置文件、脚本入口、docs 和测试入口，基于真实代码事实协助我维护 ${name}。

工作要求：
- 先说明你理解到的项目定位、技术栈、主要入口和运行方式。
- 修改前检查 git status，避免覆盖我已有改动。
- 优先遵循本项目现有结构和命名，不要凭空新增复杂抽象。
- 涉及密钥、个人数据、运行状态或本地生成物时，不要提交到 Git。
- 改完后运行项目已有的最小检查，并说明结果。
\`\`\`

适合让 AI 执行的任务：

- 改进 README、docs、示例和运行说明。
- 根据现有测试入口补充小范围回归测试。
- 梳理项目结构、风险边界和维护清单。
- 修复有明确复现步骤的问题。

不适合直接交给 AI 自动决定的任务：

- 删除数据、迁移生产状态或覆盖本机私有配置。
- 发布版本、推送远端、修改 License 或公开敏感信息。
- 需要业务负责人、医生、律师或财务人员确认的判断。
`
}

function buildLinks(project: ProjectInput) {
  const links = [
    project.websiteUrl && `[Website](${project.websiteUrl})`,
    project.repoUrl && `[GitHub](${project.repoUrl})`,
    project.docsUrl && `[Documentation](${project.docsUrl})`,
    project.demoUrl && `[Demo](${project.demoUrl})`,
  ].filter(Boolean)

  return links.length ? links.join(' · ') : '[GitHub](https://github.com/) · [Documentation](#文档)'
}

function buildNav(project: ProjectInput) {
  const navItems = splitLines(project.navItems)
  if (!navItems.length) {
    return '[功能](#功能) · [快速开始](#快速开始) · [贡献](#贡献) · [license](#license)'
  }

  return navItems.map((item) => `[${item}](#${slugifyHeading(item)})`).join(' · ')
}

function buildGeneratedReadme(project: ProjectInput) {
  const name = compact(project.projectName, 'Project Name')
  const badges = splitLines(project.badges)
    .map((badge) => badgeMarkdown(badge, project.license))
    .join(' ')
  const requirements = splitLines(project.requirements)
  const competitors = splitLines(project.competitors)
  const advantages = splitLines(project.advantages)
  const visualPlan = splitLines(project.visualPlan)

  const comparisonRows = [
    ['信息来源', competitors[0] || '模板或空白文档', advantages[0] || '基于项目事实整理'],
    ['上手路径', competitors[1] || '读者需要自己猜', advantages[1] || '安装、运行、文档集中呈现'],
    ['社区入口', competitors[2] || '贡献方式不明显', advantages[2] || '贡献入口前置'],
  ]
    .map((row) => `| ${row[0]} | ${row[1]} | ${row[2]} |`)
    .join('\n')

  return `# ${name}

${badges}

${compact(project.tagline, '一句话说明这个项目解决什么问题')}

${buildLinks(project)}

${buildNav(project)}

## 项目定位

${compact(project.description, '用 2 到 4 句话说明项目是什么、服务谁、解决什么问题。')}

| 项目状态 | 目标读者 | 主要场景 | 语言 |
| --- | --- | --- | --- |
| ${project.status} | ${compact(project.audience, '待补充')} | ${compact(project.scenario, '待补充')} | ${project.language} |

## 功能

${toMarkdownList(project.features, '待补充核心功能')}

## 快速开始

环境要求：

${requirements.length ? requirements.map((item) => `- ${item}`).join('\n') : '- 待补充运行环境'}

安装依赖：

${toCommandBlocks(project.installCommand)}

启动项目：

${toCommandBlocks(project.quickStartCommand)}

## 截图

${visualPlan.length ? visualPlan.map((item) => `- ${item}`).join('\n') : '- 待补充截图、GIF 或视频'}

![${name} demo](docs/assets/demo.gif)

${buildAgentUsage(name)}

## 为什么选择 ${name}

| 维度 | 常见做法 | ${name} |
| --- | --- | --- |
${comparisonRows}

## 文档

- 使用文档：${project.docsUrl ? `[Documentation](${project.docsUrl})` : '待补充'}
- 在线演示：${project.demoUrl ? `[Demo](${project.demoUrl})` : '待补充'}
- 问题反馈：${project.repoUrl ? `[Issues](${project.repoUrl}/issues)` : '待补充'}

## 贡献

${compact(project.contributing, '欢迎提交 issue 和 pull request。请先说明你要解决的问题与影响范围。')}

社区入口：${compact(project.community, 'GitHub Issues / Discussions')}

## License

${compact(project.license, 'MIT')}
`
}

function scoreFrom(checks: boolean[]) {
  const complete = checks.filter(Boolean).length
  return Math.round((complete / checks.length) * 100)
}

function auditState(score: number): AuditState {
  if (score >= 80) {
    return 'good'
  }
  if (score >= 45) {
    return 'warning'
  }
  return 'danger'
}

function estimateReadMinutes(value: string) {
  const cjk = (value.match(/[\u4e00-\u9fff]/g) ?? []).length
  const words = (value.match(/[A-Za-z0-9_+-]+/g) ?? []).length
  const minutes = cjk / 450 + words / 180
  return Math.max(1, Math.round(minutes))
}

function languageRisk(value: string) {
  const cjk = (value.match(/[\u4e00-\u9fff]/g) ?? []).length
  const latin = (value.match(/[A-Za-z][A-Za-z-]{2,}/g) ?? []).length
  return cjk > 120 && latin > 180
}

function marketingRisk(value: string) {
  return /领先|革命性|颠覆|商业化|增长黑客|私域|购买|咨询报价|转化率/.test(value)
}

function buildAudit(project: ProjectInput, generatedReadme: string): AuditItem[] {
  const existing = project.existingReadme.trim()
  const reviewText = existing || generatedReadme
  const lines = {
    features: splitLines(project.features),
    badges: splitLines(project.badges),
    nav: splitLines(project.navItems),
    visual: splitLines(project.visualPlan),
    competitors: splitLines(project.competitors),
    advantages: splitLines(project.advantages),
  }
  const readMinutes = estimateReadMinutes(reviewText)
  const visualEvidence = /!\[|\.(gif|png|jpg|jpeg|webp)|asciinema|youtube|bilibili/i.test(reviewText)
  const docsEvidence = /docs|documentation|文档|guide|指南/i.test(reviewText)
  const contributionEvidence = /contribut|贡献|issue|discussion|pull request|pr/i.test(reviewText)
  const agentEvidence = /AI 调用|Agent 调用|agent|Codex|Claude Code|Cursor Agent/i.test(reviewText)
  const hasMarketingRisk = marketingRisk(reviewText)
  const hasLanguageRisk = existing ? languageRisk(existing) : false

  const audits = [
    {
      title: '定位清晰',
      score: scoreFrom([
        Boolean(project.projectName.trim()),
        Boolean(project.tagline.trim()),
        project.description.trim().length > 40,
        Boolean(project.audience.trim()),
        Boolean(project.scenario.trim()),
      ]),
      weight: 1.25,
      evidence: '项目名、一句话、读者、场景需要在 README 前两屏出现。',
      action: '补充“这是什么、给谁用、解决什么问题”。',
      Icon: Target,
    },
    {
      title: 'GitHub 搜索友好',
      score: scoreFrom([
        lines.features.length >= 3,
        lines.badges.length >= 2,
        Boolean(project.repoUrl.trim()),
        docsEvidence,
      ]),
      weight: 1,
      evidence: '关键词、徽章、链接和文档入口会影响搜索结果里的可判断性。',
      action: '把核心能力拆成可搜索的名词，并补齐 repo/docs 链接。',
      Icon: Code2,
    },
    {
      title: '10 分钟可上手',
      score: scoreFrom([
        Boolean(project.installCommand.trim()),
        Boolean(project.quickStartCommand.trim()),
        Boolean(project.requirements.trim()),
        readMinutes <= 10,
      ]),
      weight: 1.35,
      evidence: `当前预计阅读 ${readMinutes} 分钟，安装和启动命令要紧邻出现。`,
      action: '把环境要求、安装、启动拆成三段，不要藏在长文里。',
      Icon: Rocket,
    },
    {
      title: '图文与演示',
      score: scoreFrom([
        lines.visual.length >= 2,
        visualEvidence,
        Boolean(project.demoUrl.trim()) || /gif|视频|截图|screenshot/i.test(project.visualPlan),
      ]),
      weight: 1,
      evidence: '截图、GIF、asciinema 或短视频能降低第一次理解成本。',
      action: '补一张结果截图和一段核心路径 GIF。',
      Icon: Image,
    },
    {
      title: '结构完整',
      score: scoreFrom([
        lines.nav.length >= 4,
        docsEvidence,
        contributionEvidence,
        agentEvidence,
        Boolean(project.license.trim()),
      ]),
      weight: 1.15,
      evidence: '导航、文档、AI 调用、贡献、License 是现代 README 的基础骨架。',
      action: '补齐导航列表、文档入口、AI 调用说明、贡献规则和 License。',
      Icon: BookOpen,
    },
    {
      title: '差异表达',
      score: scoreFrom([
        lines.competitors.length >= 2,
        lines.advantages.length >= 2,
        reviewText.includes('| 维度 |') || reviewText.includes('为什么选择'),
      ]),
      weight: 0.8,
      evidence: 'X vs Y 能让读者判断项目边界，避免泛泛而谈。',
      action: '加入与替代方案的对比表，写清楚适合与不适合。',
      Icon: ListChecks,
    },
    {
      title: '社区可信度',
      score: scoreFrom([
        Boolean(project.contributing.trim()),
        Boolean(project.community.trim()),
        contributionEvidence,
        !hasMarketingRisk,
      ]),
      weight: 1,
      evidence: hasMarketingRisk
        ? '检测到偏商业宣传词，README 容易像销售页。'
        : '贡献入口、问题反馈和维护状态会影响信任感。',
      action: '减少市场口号，把贡献方式和维护状态写清楚。',
      Icon: Users,
    },
    {
      title: '语言一致',
      score: scoreFrom([
        Boolean(project.language),
        Boolean(project.tone),
        !hasLanguageRisk,
        !/Good：|Not so good：/.test(reviewText),
      ]),
      weight: 0.75,
      evidence: hasLanguageRisk
        ? '现有 README 中中文与英文正文比例都很高，建议拆版本。'
        : `当前选择 ${project.language} / ${project.tone}。`,
      action: '正文保持单一主语言，术语表再保留英文关键词。',
      Icon: Languages,
    },
  ].map((item) => ({ ...item, state: auditState(item.score) }))

  return audits
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}

function Segment<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: T[]
  onChange: (value: T) => void
}) {
  return (
    <div className="segment-field">
      <span>{label}</span>
      <div className="segment" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={option === value ? 'active' : ''}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [project, setProject] = useState<ProjectInput>(initialProject)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('preview')
  const [copied, setCopied] = useState(false)

  const generatedReadme = useMemo(() => buildGeneratedReadme(project), [project])
  const auditItems = useMemo(
    () => buildAudit(project, generatedReadme),
    [project, generatedReadme],
  )
  const totalWeight = auditItems.reduce((sum, item) => sum + item.weight, 0)
  const score = Math.round(
    auditItems.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight,
  )
  const scoreLabel = score >= 85 ? '可以发布' : score >= 65 ? '需要补强' : '先别发布'

  const updateProject = <Key extends keyof ProjectInput>(
    key: Key,
    value: ProjectInput[Key],
  ) => {
    setProject((current) => ({ ...current, [key]: value }))
  }

  const copyReadme = async () => {
    await navigator.clipboard.writeText(generatedReadme)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const downloadReadme = () => {
    const blob = new Blob([generatedReadme], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'README.md'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <div>
            <p>ReadmeHub</p>
            <strong>开源项目 README 助手</strong>
          </div>
        </div>
        <div className="toolbar" aria-label="README 操作">
          <button type="button" onClick={copyReadme}>
            <Clipboard size={17} aria-hidden="true" />
            {copied ? '已复制' : '复制 README'}
          </button>
          <button type="button" onClick={downloadReadme}>
            <Download size={17} aria-hidden="true" />
            下载 .md
          </button>
        </div>
      </header>

      <main className="workspace">
        <section className="panel editor-panel" aria-labelledby="project-facts">
          <div className="panel-heading">
            <Wand2 size={19} aria-hidden="true" />
            <div>
              <p>Input</p>
              <h1 id="project-facts">项目事实</h1>
            </div>
          </div>

          <div className="field-grid two">
            <Field
              label="项目名"
              value={project.projectName}
              onChange={(value) => updateProject('projectName', value)}
            />
            <Field
              label="仓库地址"
              value={project.repoUrl}
              onChange={(value) => updateProject('repoUrl', value)}
            />
          </div>

          <Field
            label="一句话定位"
            value={project.tagline}
            onChange={(value) => updateProject('tagline', value)}
          />
          <Field
            label="项目描述"
            value={project.description}
            rows={4}
            multiline
            onChange={(value) => updateProject('description', value)}
          />

          <div className="field-grid two">
            <Field
              label="目标读者"
              value={project.audience}
              onChange={(value) => updateProject('audience', value)}
            />
            <Field
              label="使用场景"
              value={project.scenario}
              onChange={(value) => updateProject('scenario', value)}
            />
          </div>

          <div className="field-grid three">
            <Segment<ProjectLanguage>
              label="语言"
              value={project.language}
              options={['中文', 'English']}
              onChange={(value) => updateProject('language', value)}
            />
            <Segment<ProjectStatus>
              label="状态"
              value={project.status}
              options={['实验中', '活跃维护', '稳定']}
              onChange={(value) => updateProject('status', value)}
            />
            <Segment<ProjectTone>
              label="语气"
              value={project.tone}
              options={['社区友好', '工程直接', '产品克制']}
              onChange={(value) => updateProject('tone', value)}
            />
          </div>

          <div className="field-grid two">
            <Field
              label="网站"
              value={project.websiteUrl}
              placeholder="https://..."
              onChange={(value) => updateProject('websiteUrl', value)}
            />
            <Field
              label="文档"
              value={project.docsUrl}
              placeholder="https://..."
              onChange={(value) => updateProject('docsUrl', value)}
            />
          </div>

          <div className="field-grid two">
            <Field
              label="演示"
              value={project.demoUrl}
              placeholder="https://..."
              onChange={(value) => updateProject('demoUrl', value)}
            />
            <Field
              label="License"
              value={project.license}
              onChange={(value) => updateProject('license', value)}
            />
          </div>

          <Field
            label="导航项"
            value={project.navItems}
            multiline
            rows={3}
            onChange={(value) => updateProject('navItems', value)}
          />
          <Field
            label="徽章"
            value={project.badges}
            multiline
            rows={3}
            onChange={(value) => updateProject('badges', value)}
          />
          <Field
            label="功能列表"
            value={project.features}
            multiline
            rows={5}
            onChange={(value) => updateProject('features', value)}
          />
          <div className="field-grid two">
            <Field
              label="环境要求"
              value={project.requirements}
              multiline
              rows={3}
              onChange={(value) => updateProject('requirements', value)}
            />
            <Field
              label="安装命令"
              value={project.installCommand}
              multiline
              rows={3}
              onChange={(value) => updateProject('installCommand', value)}
            />
          </div>
          <Field
            label="启动命令"
            value={project.quickStartCommand}
            multiline
            rows={3}
            onChange={(value) => updateProject('quickStartCommand', value)}
          />
          <Field
            label="截图 / GIF / 视频"
            value={project.visualPlan}
            multiline
            rows={4}
            onChange={(value) => updateProject('visualPlan', value)}
          />
          <div className="field-grid two">
            <Field
              label="替代方案"
              value={project.competitors}
              multiline
              rows={4}
              onChange={(value) => updateProject('competitors', value)}
            />
            <Field
              label="项目优势"
              value={project.advantages}
              multiline
              rows={4}
              onChange={(value) => updateProject('advantages', value)}
            />
          </div>
          <Field
            label="贡献说明"
            value={project.contributing}
            multiline
            rows={4}
            onChange={(value) => updateProject('contributing', value)}
          />
          <Field
            label="社区入口"
            value={project.community}
            onChange={(value) => updateProject('community', value)}
          />
          <Field
            label="现有 README"
            value={project.existingReadme}
            multiline
            rows={6}
            placeholder="粘贴已有 README 后，评审会优先检查现有内容。"
            onChange={(value) => updateProject('existingReadme', value)}
          />
        </section>

        <section className="panel review-panel" aria-labelledby="readme-review">
          <div className="panel-heading">
            <Sparkles size={19} aria-hidden="true" />
            <div>
              <p>Review</p>
              <h2 id="readme-review">README 评审</h2>
            </div>
          </div>

          <div className="score-board">
            <div
              className="score-ring"
              style={{ '--score-angle': `${score * 3.6}deg` } as CSSProperties}
              aria-label={`README 评分 ${score}`}
            >
              <span>{score}</span>
              <small>{scoreLabel}</small>
            </div>
            <div className="score-copy">
              <strong>第一张名片</strong>
              <p>优先检查定位、上手路径、视觉证据和社区入口。</p>
            </div>
          </div>

          <div className="audit-list">
            {auditItems.map(({ title, score: itemScore, state, evidence, action, Icon }) => (
              <article className={`audit-item ${state}`} key={title}>
                <div className="audit-icon">
                  {state === 'good' ? (
                    <CheckCircle2 size={18} aria-label="通过" />
                  ) : state === 'warning' ? (
                    <AlertTriangle size={18} aria-label="注意" />
                  ) : (
                    <AlertTriangle size={18} aria-label="缺失" />
                  )}
                </div>
                <div>
                  <div className="audit-title">
                    <Icon size={17} aria-hidden="true" />
                    <strong>{title}</strong>
                    <span>{itemScore}</span>
                  </div>
                  <p>{evidence}</p>
                  <small>{action}</small>
                </div>
              </article>
            ))}
          </div>

          <div className="structure-map" aria-labelledby="structure-map-title">
            <div className="section-title">
              <FileText size={18} aria-hidden="true" />
              <h3 id="structure-map-title">内容骨架</h3>
            </div>
            {readmeStructure.map(({ title, label, note, Icon }) => (
              <div className="structure-step" key={title}>
                <Icon size={18} aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  <span>{label}</span>
                  <p>{note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel preview-panel" aria-labelledby="readme-preview">
          <div className="panel-heading">
            <BookOpen size={19} aria-hidden="true" />
            <div>
              <p>Output</p>
              <h2 id="readme-preview">README 预览</h2>
            </div>
          </div>

          <div className="preview-toolbar">
            <div className="segment compact" role="group" aria-label="预览模式">
              <button
                type="button"
                className={previewMode === 'preview' ? 'active' : ''}
                onClick={() => setPreviewMode('preview')}
              >
                <Eye size={16} aria-hidden="true" />
                预览
              </button>
              <button
                type="button"
                className={previewMode === 'source' ? 'active' : ''}
                onClick={() => setPreviewMode('source')}
              >
                <Code2 size={16} aria-hidden="true" />
                源码
              </button>
            </div>
            <a href={project.repoUrl || 'https://github.com/'} target="_blank">
              <LinkIcon size={16} aria-hidden="true" />
              GitHub
            </a>
          </div>

          <div className="preview-surface">
            {previewMode === 'preview' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{generatedReadme}</ReactMarkdown>
            ) : (
              <pre>
                <code>{generatedReadme}</code>
              </pre>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
