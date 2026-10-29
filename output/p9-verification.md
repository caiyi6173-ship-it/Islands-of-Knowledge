# P9 验证记录

日期：2026 年 10 月 20 日。知识群岛 / R05「下一次还成立吗」。

## 工程结果

- `npm run check`、`check:worldline`、`check:first-voyage`、`check:postal-world`、`check:nightwatch`、`check:revision`、`check:atlas`、`check:return` 全部通过。日志：[p9-syntax.log](./p9-syntax.log)。
- `node --test --test-reporter=tap tests/*.test.cjs`：324 项通过，0 失败，较 P8 新增 34 项。完整结果：[p9-unit-tests.tap](./p9-unit-tests.tap)。
- 八组真实浏览器回归：63 项场景全部通过，0 页面错误。各组使用独立服务端口（4188、4191—4197）和隔离上下文，没有修改玩家在 4173 上的存档。
- 两个正式 HTML 入口逐字节一致，新增脚本均在应用入口前加载，没有增加运行时依赖。
- 玩家预览地址 `http://127.0.0.1:4173/` 返回 HTTP 200。

| 命令 | 场景数 | 结果 |
|---|---:|---|
| `npm run test:browser:return` | 8 | [return.json](./browser-regressions/return.json) |
| `npm run test:browser:atlas` | 7 | [atlas.json](./browser-regressions/atlas.json) |
| `npm run test:browser:revision` | 7 | [revision.json](./browser-regressions/revision.json) |
| `npm run test:browser:nightwatch` | 8 | [nightwatch.json](./browser-regressions/nightwatch.json) |
| `npm run test:browser:first-voyage` | 10 | [first-voyage.json](./browser-regressions/first-voyage.json) |
| `npm run test:browser:postal-world` | 8 | [postal-world.json](./browser-regressions/postal-world.json) |
| `npm run test:browser:worldline` | 9 | [worldline.json](./browser-regressions/worldline.json) |
| `npm run test:browser` | 6 | [high-priority.json](./browser-regressions/high-priority.json) |

## P9 专项检查内容

1. **正交光源**：通过真实滑条夹住低频两种通量及同通量的高频预览。免费操作不扣资源，正式记录含三组实际参数。换材料后沿用旧光源会失败并扣成本，换到足够高频后成功；固定频率比较通量的相对发射数变化及动能不变，取得第三星。舞台保持同一 SVG。
2. **封存与拆信**：键盘操作曲线控制点，拟合并正式封存两组预测。退出和刷新不提前公开观测，也不改原记录。主动打开信封才出现独立观测；随后改变曲线并正式核对，原预测不变，修订单列。引用两份拆信前记录核对误差，获得选做研究。
3. **边界与原子账**：实际拖动称量范围，将逸出气体计入，再切回容器边界。开闭成对预览可归档；“质量消失”的判断正式失败。换产气量作合格比较，随后明确切到独立方程卡。未配平方程再失败，修正后仍可两星完成；多次失误不继续授予第三星，世界主线不被永久阻塞。
4. **整圈与结尾**：可提前完成 R05，前四章交付后直接复用已有成果。R05 在演出前保存三份寄出版本及正式桌位。三张实寄页引用真实光电、预报与质量记录；00 可选用本次真实预报。最后回到实际桌位，阿墨继续搭档，阿澜交班回家，三站航线完成整圈。
5. **修订、刷新与回看**：后来补充研究产生新版本，返航演出仍显示原寄出版本；选定的 00 保留原引用。演出中刷新后，从邮局回条绳可重看；跳过、Escape 与重复回看不重复交付。
6. **手机与可访问操作**：390px 下三关无横向溢出。减少动态效果时光源停止装饰动画，实时数值仍更新；方向键可替代拖动称量边界。
7. **默认旧档结局**：十五项主线旧完成记录足以交付五章。无需三星、支线或文字输入即可用默认 00 结束；旧记录不补造新模型数值。手机结尾和桌位保持可用。
8. **旧任务与生命周期**：进行中的原 M10 默认继续，主动切到新版时保留原命令。每次进入仍显示短开场，退出光电台后不再产生正式活动或输入副作用。

新增单元测试同时覆盖光电公式与阈值、预览包重算、同通量与同频率的独立约束、三角色资源预算、无需第三星的主线完成、无依据精度声明、公开后无法追加预封存、真实推理来源、质量总账、边界与判断不伪造比较、最简系数与固定分子式、非法输入、缓存重算、十五种主线引用、旧档诚实回退及实际寄出版本稳定性。

## 截图检查

已打开检查桌面三关、封存与公开状态、实际寄出页、00、手机操作及默认手机结尾。检查后修正了气体文字与移开的容器盖重叠、曲线缺少纵轴刻度，以及 00 露出内部版本编号的问题；补充新人、桌角与清单的像素画面，再次生成截图并通过 P9 全组回归。

- [P10 光电柜](./browser-regressions/p9-photoelectric.png)
- [M10 拆信前封存](./browser-regressions/p9-sealed.png)
- [M10 独立观测与修订](./browser-regressions/p9-disclosed.png)
- [C08 称量边界](./browser-regressions/p9-mass-boundary.png)
- [C08 独立原子账](./browser-regressions/p9-atoms.png)
- [返航三份实寄页](./browser-regressions/p9-return.png)
- [00 与下一位信使](./browser-regressions/p9-letter.png)
- [390px 称量操作](./browser-regressions/p9-mobile-mass.png)
- [默认手机结尾](./browser-regressions/p9-mobile-ending.png)

## 已知范围

十五项主线的新玩法、五段共同交付及基础结局已接通。另十五项补充委托仍使用既有机制，按 P10 继续改写；完整视听统一与真实玩家试玩仍属于后续工作。以上工程验证不等同于真实玩家对难度、操作和故事的反馈。

设计、科学边界、资源与接入细节见 [20 P9 新记录与整圈返航](../docs/worldline/20-P9新记录与整圈返航.md)。
