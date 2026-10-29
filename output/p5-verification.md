# P5 验收记录

日期：2026-10-20。范围：正式网页中的三站地图、邮局物件、伙伴日常与交付后世界变化。所有浏览器测试使用独立服务与隔离存档，未操作用户浏览器的进度。

## 已执行

| 检查 | 结果 | 证据 |
|---|---|---|
| `npm run check` | 通过 | 原项目语法检查，含应用入口 |
| `npm run check:worldline` | 通过 | 邮路、成果、保存字段与货单 |
| `npm run check:first-voyage` | 通过 | 首航模型、场景、工作台与演出 |
| `npm run check:postal-world` | 通过 | 新世界状态、场景、地图与房间视图 |
| `npm test` | 211 项通过，0 失败 | [完整输出](./p5-unit-tests.tap) |
| `npm run test:browser:postal-world` | 8 项通过，0 页面错误 | [P5 报告](./browser-regressions/postal-world.json) |
| `npm run test:browser:first-voyage` | 10 项通过，0 页面错误 | [首航报告](./browser-regressions/first-voyage.json) |
| `npm run test:browser:worldline` | 9 项通过，0 页面错误 | [邮路报告](./browser-regressions/worldline.json) |
| `npm run test:browser` | 6 项通过，0 页面错误 | [原实验台报告](./browser-regressions/high-priority.json) |

四组共 33 项浏览器场景检查。两个 HTML 入口同步，预览服务 `http://127.0.0.1:4173/` 可访问。

## P5 专项覆盖

1. 三个接应站、真实 SVG 路径、草图状态与三项直接关卡入口；新档回条和图夹为空，查看物件与交谈不生成研究成果。
2. 三个室内场景、初见与再见、入口留样台和内港窗口的区别；物件检查保留房间舞台。
3. 从信袋执行真实交付，发船前保存交付事实；回条、小物选择与 00 引用可保存，旧完成不补造读数。
4. 交付后尺与纸进入使用，白天首航与下一章委托区分；重访不把四箱退回岸上。
5. 局部夜班、双方改稿、条件正面、五张回条、正式桌位与整圈邮路；未研究区域仍未完整复色；第四箱回到起点，阿澜交班后不再一直站在码头。
6. 打开的房间即时承接另一页的交付，保持 SVG 实例；明确重置清除已获回条和道具。
7. 390px 全图站点边界、可见邮局图标、物件详情进入可见范围、触摸等价按钮、键盘进出和减少动态效果。
8. 中文文件名入口正常，DOM 无重复 ID。

章节变化的专项回归通过原有完成标记迁移为有效旧成果，再在正式界面执行五次交付；首航专项另从真实新实验台完整操作 P01、C01、M03。没有将后四章旧成果的场景走查冒充 P6—P9 的新玩法验收。

## 模型检查

新增 `tests/postal-world.test.cjs` 的 12 项检查验证：站点与入口区别；访问不产生成果；提前完成不提前发船；白天、夜班与整圈状态；无效未来回条不能跳章；摆放仅用已得小物；人物不因重做失忆；四人六段日常；完整邮路不自动清地图；旧档引用不虚构数值；支线不奖励后章道具；可选保存字段损坏时回退。

## 视觉走查

检查并修正了手机工具栏图标被旧样式隐藏、物件详情排在委托后方而难以发现、返回全图自动弹出岛屿面板遮挡邮站的问题。手机全图显示全部三站，室内选择与详情按同一阅读顺序排列。

- [新档地图](./browser-regressions/p5-world-fresh.png)
- [借用的邮局桌角](./browser-regressions/p5-office-borrowed.png)
- [首航后的回访](./browser-regressions/p5-office-first-receipt.png)
- [白天观测窗口](./browser-regressions/p5-window-day.png)
- [夜班窗口](./browser-regressions/p5-window-night.png)
- [补过条件的测绘台](./browser-regressions/p5-map-desk-revised.png)
- [整圈邮路与局部复色](./browser-regressions/p5-world-circuit.png)
- [390px 全图](./browser-regressions/p5-world-mobile.png)
- [手机物件详情](./browser-regressions/p5-office-mobile-selected.png)

本阶段未开展真实玩家的趣味性、节奏或角色记忆测试。未实现 P6 的新版夜班三关，也未制作完整主结局演出。
