# P7 验证记录

日期：2026 年 10 月 20 日。知识群岛 / R03 对岸看懂了吗。

## 工程结果

- `npm run check`、`npm run check:worldline`、`npm run check:first-voyage`、`npm run check:postal-world`、`npm run check:nightwatch`、`npm run check:revision` 全部通过。日志：[p7-syntax.log](./p7-syntax.log)。
- `node --test --test-reporter=tap tests/*.test.cjs`：259 项通过，0 失败，较 P6 新增 28 项。完整结果：[p7-unit-tests.tap](./p7-unit-tests.tap)。
- 六组真实浏览器回归：48 项场景，0 页面错误。独立服务端口与隔离上下文，没有操作玩家在 4173 上的存档。
- 两个正式 HTML 入口保持一致，新增脚本均加载在应用入口之前。

| 命令 | 场景数 | 结果 |
|---|---:|---|
| `npm run test:browser:revision` | 7 | [revision.json](./browser-regressions/revision.json) |
| `npm run test:browser:nightwatch` | 8 | [nightwatch.json](./browser-regressions/nightwatch.json) |
| `npm run test:browser:first-voyage` | 10 | [first-voyage.json](./browser-regressions/first-voyage.json) |
| `npm run test:browser:postal-world` | 8 | [postal-world.json](./browser-regressions/postal-world.json) |
| `npm run test:browser:worldline` | 9 | [worldline.json](./browser-regressions/worldline.json) |
| `npm run test:browser` | 6 | [high-priority.json](./browser-regressions/high-priority.json) |

并行运行时为各组设置独立 `BROWSER_TEST_PORT`（4191—4195）；P7 专项使用 4188。仍通过项目固定版本的 Playwright CLI 执行普通浏览器脚本，没有增加测试框架或运行时依赖。

## P7 专项检查内容

1. **真实报码**：实际按住并松开空格，保留毫秒时长；同一段原始时序改变调谐，不扣自由操作费用。失谐参考与调谐结果享受合格比较价格；新条件保留旧刻度并要求 R。故意在正确刻度发 S 会指出第二符号，并扣本次正式成本与可靠度；实际 R 可归档，最佳星级保留。
2. **有序变换**：实际从操作区拖 R、T 卡进序列，交换次序，逐步叠图，再放大 2 倍。检查 A 的中间位置 `(-2,3)` 与最终位置 `(-4,6)` 分开，面积倍率为 4；反射反转定向。两份正式目标记录可先两星归档，引用实际记录补推理后修订为三星，不增加伪造实验。
3. **电子分布与图例**：直接拖 H₂ 电子对入共享区，O₂ 用等价键盘/按钮操作逐对摆放。总数 12 但孤对全偏一侧会正式失败；调整到两侧各 2 对后通过。切显示不获折扣，必须实际把共享对对应到不同键线；孤对和全分子电子数不消失、不翻倍。
4. **提前完成与共同寄稿**：R03 在前两章之前可自由做完、归档与刷新恢复。补交前两章后直接使用已有记录，无需重做；R03 交付在演出前保存。回信包含小禾自己的修订，并引出 R04。回看不重复交付，00 可分别引用 P07、M06、C04 的有效版本。
5. **邮局回访**：回条绳可重看双方修订；图夹优先展示当前委托与最近交付的分册，M06 推理有真实来源。R03 不提前点亮三岛完整夜邮。
6. **手机与减少动态效果**：390px 下三关、给定旧页展开和操作区无横向溢出；按钮可替代原生拖卡，电子对可用选择框与摆放按钮。减少动态效果时提供静态步骤。
7. **旧档与生命周期**：进行中的原 M06 仍默认继续，明确切换新版保留旧命令。按住空格时点击退出不会把鼠标释放误当成键盘释放；退出后无幽灵按键、正式记录或残留音效定时器。

单元测试另验证三角色预算、非法输入、完全同一原始时序的比较约束、可负担比较优先于补给、缩放/反射的长度与内角、点线双射、无来源推理拒绝、缓存结果重算、00 引用稳定和旧完成标记不补造新读数。

## 实际截图

已打开检查桌面收发台、图纸桌、电子图例台、共同回条和手机界面。它们沿用相同实验台结构，采用各自学科的配色和图示。

- [P07 收发台与纸带](./browser-regressions/p7-radio.png)
- [M06 透明图纸与变换序列](./browser-regressions/p7-chart.png)
- [C04 电子分布与点线对应](./browser-regressions/p7-electrons.png)
- [小禾补注与 00 回信引用](./browser-regressions/p7-receipt.png)
- [390px 电子操作区](./browser-regressions/p7-mobile-electrons.png)

回归等待实际更新后的界面读数，不以输入框属性变化或固定几十毫秒延迟作为数值刷新完成的依据。

## 已知范围

这是 P7 的工程实现与自动检查。真实玩家对难度、手感和故事吸引力的反馈仍待收集。共九关使用新世界线玩法，其余二十一关保留既有机制，完整最终演出仍在后续阶段。下一阶段为 P8「图纸背面的那一行」。

具体模型、故事、资源与资料来源见 [18 P7 阶段记录](../docs/worldline/18-P7共同改稿与图例核对.md)。
