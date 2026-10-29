# P12 验证记录

日期：2026 年 10 月 21 日。状态：工程验收通过；真实玩家反馈尚未收到。

[完整报告](./release-verification.md) · [原始 JSON](./release-verification.json) · [阶段说明](../docs/worldline/23-P12完整验收与试玩修订.md)

## 结果

- 94 个 JavaScript 文件语法通过，两个 HTML 入口完全一致。
- 424 项单元测试通过，失败 0；见 [TAP](./release-unit.tap)。
- 十二组共 102 个浏览器场景通过，页面脚本错误 0。
- 核对代码、资产和测试的 SHA-256 与续跑开始时一致。

## 中断与续跑

首轮完整运行在附页检查期间发生长时间环境中断，未将该组计为通过。续跑确认代码、资产与测试未变化，沿用 8 组已经通过的浏览器结果，重新执行附页、共用呈现、连续主线和存储故障四组；语法、双入口和全部单元测试也重新执行。每组来源在完整报告和 JSON 中明确标记，没有把未完成组沿用为成功。

开始源运行：2026-10-21T08:02:37.333Z

本次续跑：2026-10-21T08:42:42.078Z

完成：2026-10-21T08:45:59.252Z

源码与测试指纹：`731b57529cbb239c6050f58b48fb5030b7ae2cd6cd8d4f6d3279aa0260d1da09`。

## 浏览器覆盖

| 专项 | 场景 | 本次来源 |
|---|---:|---|
| [high-priority](./browser-regressions/high-priority.json) | 6 | 代码未变，沿用已通过组 |
| [worldline](./browser-regressions/worldline.json) | 9 | 代码未变，沿用已通过组 |
| [first-voyage](./browser-regressions/first-voyage.json) | 10 | 代码未变，沿用已通过组 |
| [postal-world](./browser-regressions/postal-world.json) | 8 | 代码未变，沿用已通过组 |
| [nightwatch](./browser-regressions/nightwatch.json) | 8 | 代码未变，沿用已通过组 |
| [revision](./browser-regressions/revision.json) | 7 | 代码未变，沿用已通过组 |
| [atlas](./browser-regressions/atlas.json) | 7 | 代码未变，沿用已通过组 |
| [return](./browser-regressions/return.json) | 8 | 代码未变，沿用已通过组 |
| [appendix](./browser-regressions/appendix.json) | 19 | 续跑重新执行 |
| [presentation](./browser-regressions/presentation.json) | 7 | 续跑重新执行 |
| [campaign](./browser-regressions/campaign.json) | 10 | 续跑重新执行 |
| [resilience](./browser-regressions/resilience.json) | 3 | 续跑重新执行 |

## 新增验收与修订

- 从全新隔离档实际操作十五项新版主线，普通两星且不做支线即可完成五次交付、00、正式桌位与交班。没有向存档填入新版完成结果。
- 提前研究 M10，拆信前记录刷新后仍封存；三种身份分别逆序完成三十关；新旧混合档保持旧页的原始证据范围。
- 结局后实际制作并补寄 M02，重开并失败保留旧成果、星数、引用与五次交付；取消重置和确认重置分别验证。
- 写入限额时五章交付和附页仍可在当前会话完成，明确持续提示未保存；恢复存储后保存当前会话，原磁盘记录在故障期间保持不变。
- 拒绝读取存储时仍可正式记录并归档。320 像素下提示不遮控件；免费操作不反复播报相同存储提示。
- 损坏 JSON 在普通探索和取消重置时不变；确认重置保留一份精确原文备份，再建立可重新加载的新档。
- 电键使用原生事件时间戳，检查处理延迟、重复按键、失焦、指针身份和不兼容时间戳回退；不修改短长音判定阈值。
- 跨页检查先切回被观察页面，再检查同步和旧运行时销毁；保存内容、来源与资源断言保留。

## 可复现命令

```powershell
npm run verify
# 运行环境中断后，代码、资产和测试均未变化时可以续跑
npm run verify -- --resume
```

默认命令全量执行。续跑会校验指纹；变化时重跑浏览器组。每次先写运行中状态，失败也会更新报告，避免旧的绿色结果冒充本次通过。

## 视觉检查与试玩边界

已查看 [纯新档结尾](./browser-regressions/p12-fresh-ending.png)、[会话模式结尾](./browser-regressions/p12-session-ending.png) 和 [320 像素存储故障界面](./browser-regressions/p12-storage-denied.png)。

原地址为 http://127.0.0.1:4173/，独立试玩地址为 http://127.0.0.1:4174/。浏览器回归使用隔离上下文与独立测试端口，不写玩家的这两个地址的存档。

真实玩家的任务理解、趣味性和节奏反馈仍待收集，见 [试玩记录](../docs/worldline/24-P12玩家试玩记录.md)。本次没有把工程走查写成真人用户测试，也不代表完成所有浏览器、设备和辅助技术组合的人工评测。
