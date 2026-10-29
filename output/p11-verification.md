# P11 验证记录

日期：2026 年 10 月 21 日。范围：新版三十关、五章交付、补充回条及既有兼容入口。阶段说明见 [22 P11](../docs/worldline/22-P11统一视听与交互打磨.md)。

## 结果

- 93 个生产脚本与检查脚本通过 `node --check`；见 [语法日志](./p11-syntax.log)。
- 411 项单元测试通过，失败 0；新增 4 项共用音效生命周期检查，见 [完整 TAP](./p11-unit.tap)。
- 十组共 89 个浏览器场景通过，页面脚本错误 0；见 [汇总 JSON](./p11-browser-summary.json)。
- 两个 HTML 入口内容一致，均加载共用呈现层。
- 本地预览 `http://127.0.0.1:4173/` 已重新启动并确认 HTTP 200。

## 浏览器回归

| 专项 | 通过场景 | 结果 |
|---|---:|---|
| high-priority | 6 | [JSON](./browser-regressions/high-priority.json) |
| worldline | 9 | [JSON](./browser-regressions/worldline.json) |
| first-voyage | 10 | [JSON](./browser-regressions/first-voyage.json) |
| postal-world | 8 | [JSON](./browser-regressions/postal-world.json) |
| nightwatch | 8 | [JSON](./browser-regressions/nightwatch.json) |
| revision | 7 | [JSON](./browser-regressions/revision.json) |
| atlas | 7 | [JSON](./browser-regressions/atlas.json) |
| return | 8 | [JSON](./browser-regressions/return.json) |
| appendix | 19 | [JSON](./browser-regressions/appendix.json) |
| presentation | 7 | [JSON](./browser-regressions/presentation.json) |

本轮复跑全部九组原有回归，再加入 presentation 专项的七组场景。它们是汇总场景数；三十关桌面与三十关 320 像素巡检包含在对应场景中，不重复计数。

## 本阶段新增核对

1. 三十关共用画框、章节物件、参数命名和独立结果播报；四类正式反馈在每关底色上的对比度均不低于 4.5:1。
2. 开头等待主动跳过，Escape 后焦点到操作区，Tab / Shift+Tab 保留在弹窗内；免费预览不刷读屏结果播报。
3. 正式失败保留原有资源结算；参考、目标成立、归档使用不同文字、符号和音效；舞台节点保持同一个。
4. 现场打开期间切换系统减少动态效果，船立即暂停，键盘仍能改变参数并即时计算；P02 播放有静态终态。
5. 三十关在 320 像素宽度下无横向溢出，主要按钮和滑条具有至少 44 像素高的触控区域；使用真实触屏上下文检查。
6. 交付自动翻页在系统偏好变化后停在当前幕；手动跳过仍读到已保存的回条，静音按钮可用，存档交付不重复结算。
7. 使用真实 Web Audio 节点观察琴弦与电键：静音取消正在发声及排队的音符，退出取消余音；单元测试另覆盖共用提示、页面隐藏、窗口失焦与跨页静音。

检查期间修正了 R05 静态运行时没有 pause 方法时的接入问题，以及 C03 分类按钮的旧样式优先级。原有夜班与图册回归更新了系统减少动态效果的按钮文案和禁用状态断言；连续采样、数值响应、正式结算、保留舞台等行为断言继续保留。

浏览器各组使用独立服务端口及隔离上下文，没有写入玩家在 4173 端口的存档。报码时长专项单独运行，避免多组浏览器竞争导致真实按键时长失真。

## 截图检查

- [物理现场与错误反馈](./browser-regressions/p11-formal-error.png)
- [浅色化学现场与错误反馈](./browser-regressions/p11-sample-error.png)
- [首航现场](./browser-regressions/p11-harbor-desktop.png)
- [320 像素分子邮票](./browser-regressions/p11-mobile-C05.png)
- [320 像素报码现场](./browser-regressions/p11-mobile-P07.png)
- [320 像素桥洞图纸](./browser-regressions/p11-mobile-M05.png)
- [手机操作与记录区](./browser-regressions/p6-mobile-signal.png)

人工看过桌面深色错误、浅色错误及手机操作区截图，文字和按钮未相互遮挡。自动布局巡检同时覆盖三十关。截图和工程检查不替代真实玩家的理解、趣味性或节奏反馈，也不代表完成全部读屏软件、浏览器和设备组合的人工测试；这些留在 P12。
