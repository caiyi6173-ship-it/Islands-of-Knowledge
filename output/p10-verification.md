# P10 验证记录

日期：2026 年 10 月 20 日。知识群岛 / 十五项补充委托与独立追加回条。

## 工程结果

- `npm run check`、`check:worldline`、`check:first-voyage`、`check:postal-world`、`check:nightwatch`、`check:revision`、`check:atlas`、`check:return`、`check:appendix` 通过。日志：[p10-syntax.log](./p10-syntax.log)。
- `node --test --test-reporter=tap tests/*.test.cjs`：407 项通过，0 失败，较 P9 新增 83 项。结果：[p10-unit-tests.tap](./p10-unit-tests.tap)。
- 九组真实浏览器回归：82 项场景通过，0 页面错误。追加支线组使用 4188，既有组分配 4191—4198 端口及独立上下文，没有操作玩家在 4173 上的存档。
- 两个正式 HTML 入口逐字节一致；新增脚本均在应用入口前加载，没有增加运行时依赖。
- `http://127.0.0.1:4173/` 返回 HTTP 200。

| 命令 | 场景数 | 结果 |
|---|---:|---|
| `npm run test:browser:appendix` | 19 | [appendix.json](./browser-regressions/appendix.json) |
| `npm run test:browser:return` | 8 | [return.json](./browser-regressions/return.json) |
| `npm run test:browser:atlas` | 7 | [atlas.json](./browser-regressions/atlas.json) |
| `npm run test:browser:revision` | 7 | [revision.json](./browser-regressions/revision.json) |
| `npm run test:browser:nightwatch` | 8 | [nightwatch.json](./browser-regressions/nightwatch.json) |
| `npm run test:browser:first-voyage` | 10 | [first-voyage.json](./browser-regressions/first-voyage.json) |
| `npm run test:browser:postal-world` | 8 | [postal-world.json](./browser-regressions/postal-world.json) |
| `npm run test:browser:worldline` | 9 | [worldline.json](./browser-regressions/worldline.json) |
| `npm run test:browser` | 6 | [high-priority.json](./browser-regressions/high-priority.json) |

P07 的真实按键回归曾在高并行负载下把计划短按延迟到 907 ms，实际输入因而被识别为长音。较低负载下重跑该组通过；保留了真实时长的判定。此项回归对宿主机调度延迟敏感。

## 十五项真实操作

| 关卡 | 浏览器操作与验证 |
|---|---|
| P02 | 实际拖第三只钟到 9，结合滑条得到 1、4、9，免费放球；核对释放起三段间隔和新坡度下的时间比 |
| M02 | 同步消去，拒绝取走不存在的包，保留中间式 3x=21，继续除法并代回 |
| C05 | 改每份水的原子数、整体复制到三份，再独立组 NH₃，核对总数与下标 |
| P04 | 接上传动、播放一次落锤，记录真实微小温升与保温差别，引用留热比推理 |
| M04 | 从输入端实际拖线到有数字文字的输出端，再用按钮补表；域外显示未定义，两张同旧样本的表构成反例 |
| C09 | 分别记两行电子，再切外电源电解；固定 Cu²⁺，比较电量倍增与析铜量 |
| P05 | 同一波长下正式记录暗、亮参考，再换波长；屏幕与固定点同算 |
| M01 | 调实际弦长、主动拨弦，排列完整奇偶矛盾证明，再引用精确分数差 |
| C03 | 按性质分组、X 留空，现代壳层另页；打开给定 E 卡并引用初排核验 |
| P08 | 无依据的新元素声明受到正式惩罚；修正背景与范围，保留给定批次统计 |
| M07 | 三角形前提、平方关系与逆定理都需实际放入依据；两条件完成后比较缩放 |
| C07 | 实际拖第二支向量到 180°，保留非零分量，明确做抽象参考，再换固定水分子角 |
| P09 | 同资料叠两模型、核对全点残差，新温度继续使用独立给定参照 |
| M09 | 正间隔差商、完整极限步骤、缩间隔的真实误差变化，驻点加二阶导数理由 |
| C02 | 原子比与质量比区分，整体倍增，再统一碳基准比较两种组成 |

每关都检查舞台 SVG 在操作与切条件时保持挂载、成果真实归档，以及提前完成支线不会发生主线交付。单元测试另覆盖十五关×三种角色的完整研究预算，十五关仅两记录的两星完成路线，非法操作、计算公式、模型边界、缓存重算、必要推理、真实引用和研究折扣。

## 补寄、世界与旧档

1. 提前归档后刷新，支线仍在，所属章节未交付时显示等待补寄。
2. 五次主线交付保持原条件和已寄版本；十五份支线不被追加为结局门槛。
3. 从货单补寄 P02，码头记时员回条读取实际寄出页；从邮局回条绳回看不重复邮寄。
4. 后来追加一次有效研究、归档新版本，从货单寄出补订页；保留第一次的引用，并能回看旧版读数。
5. 三十份成果齐备显示邮路全览，世界地图完整复色；补寄操作不自动改写已选 00。
6. 十五关均检查 390px 布局，展开数学推理区无横向溢出，按钮可替代直接拖放；减少动态效果仍能即时计算。
7. 进行中的旧 M07 默认继续；明确切换到新版后原命令保留。旧完成回条不补造新版动作和读数，单元测试直接覆盖。
8. 进度合并测试覆盖不同附页独立补寄、重复发送去重、虚假引用剔除和重置空字段。

## 截图与细节修正

已打开检查斜坡、落锤、双缝、分拣表、直角模板、现代分类附页、变化率、追加回条与手机邮票界面。回归另外生成其余关卡截图。

截图与交互检查后修正了：拖线端口上的数字文字命中、平方板按共同比例画正方形、斜坡轨迹与角度同步、低钟位与标题留距、差商和切线同时显示，以及回条外框的像素风格。必要的推理卡与输入继续保留原生键盘/按钮入口。

- [P02 钟位与坡度](./browser-regressions/p10-bells.png)
- [P04 能量与微小温升](./browser-regressions/p10-heat.png)
- [P05 干涉屏幕](./browser-regressions/p10-fringes.png)
- [M04 分拣关系表](./browser-regressions/p10-sorting.png)
- [M07 三角形与平方板](./browser-regressions/p10-triangle.png)
- [C03 历史分类与现代附页](./browser-regressions/p10-classification.png)
- [M09 割线与切线](./browser-regressions/p10-calculus.png)
- [实际寄出页的追加回条](./browser-regressions/p10-receipt.png)
- [390px 分子邮票](./browser-regressions/p10-mobile-stamps.png)

## 当前范围

三十个现场已接入新版玩法，十五项主线与十五项补充委托分别形成交付和追加回条。工程回归完成；真实玩家对难度、文字与手感的反馈仍待收集。P11 继续统一人物、音效、场景反馈和过渡，P12 做完整试玩修订。

设计、公式、来源与模型范围见 [21 P10 阶段说明](../docs/worldline/21-P10十五项补充委托与追加回条.md)。
