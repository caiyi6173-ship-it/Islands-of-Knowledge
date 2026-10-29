# P4 验收记录

日期：2026-10-20。范围：正式入口 P01、C01、M03 与 R01 首航闭环。仅在隔离浏览器上下文使用测试存档，未操作用户浏览器存档。

## 结果

- `npm run check`、`npm run check:worldline`、`npm run check:first-voyage`：语法检查通过。
- `npm test`：199 项通过，0 失败；其中 `first-voyage.test.cjs` 新增 16 项。完整输出：[p4-unit-tests.tap](./p4-unit-tests.tap)。
- `npm run test:browser:first-voyage`：10 项场景检查通过，0 页面错误。覆盖新档直接委托、可选科学序章、三关正式操作、拖动/键盘、主题与文字对比度、三星路径与正式惩罚、归档后补充、刷新、窄屏、静音、场景动画暂停、减少动态效果、三科目录星级、发船与 00、旧档和多页保存。
- `npm run test:browser:worldline`：9 项通过，0 页面错误。覆盖后章自由进入、真实归档、旧完成、交付去重、跨页回条、十五项主线完成五次交付、窄屏、重置、双入口。
- `npm run test:browser`：6 项通过，0 页面错误。继续覆盖原实验台的保存、六个数学/化学舞台跨视图操作、答案修改的对照资格，以及数学反馈。
- 两个 HTML 入口内容一致；本机 `http://127.0.0.1:4173/` 响应 HTTP 200。

三套浏览器报告共 25 项场景检查：[首航](./browser-regressions/first-voyage.json)、[邮路](./browser-regressions/worldline.json)、[原实验台](./browser-regressions/high-priority.json)。这是自动检查的场景数量，不能等同于真人试玩人数或趣味性评价。

## 模型与状态核对

新三关均以原始命令重放计算，缓存资源、星星或结果不充当事实。三种角色的无失败三星路径均可负担；一次普通正式错误后也能完成示例路线。P01 不靠故意下沉取星；C01 身份变化不改变测量、不折扣；M03 原点切换改变实际世界落点，并保存每个航标的残差。

六种三关完成顺序均在单元层通过，浏览器实际走通 P01→C01→M03 及中途退出、刷新、补充与回访。旧进行中规则留在原入口，新尝试单独保存；旧完成无需重打，也不补造原始读数。首航先存交付事实，再播放演出，跳过或回看不重复交付。

## 视觉走查

已检查桌面与 390px 截图，修复普通弹窗的蓝色和白字覆盖主题问题。港口为海绿木色，留样台为浅纸与玻璃青，测绘台为粉笔黑板；实时输入不重建整块舞台。四箱只在备航岸上或航行船上出现，缺角箱回条中的图画用于辨认。

- [P01 港口](./browser-regressions/p4-harbor-desktop.png)
- [C01 留样台](./browser-regressions/p4-samples-desktop.png)
- [M03 测绘台](./browser-regressions/p4-chart-desktop.png)
- [小禾回条](./browser-regressions/p4-first-receipt.png)
- [390px 窄屏](./browser-regressions/p4-chart-mobile.png)

本阶段未实施后四章的新玩法、P5 实体邮局与地图三站回路，也未完成真人试玩。实际节奏、是否主动比较以及人物吸引力仍需真实玩家反馈。
