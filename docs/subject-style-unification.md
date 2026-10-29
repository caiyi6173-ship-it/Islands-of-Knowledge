# 三岛视觉与关卡统一

版本：2026-10-16。

## 产品结果

- 地图以物理岛为美术参考：完整俯视立体岛屿、石质悬崖、森林、古典建筑与海湾。数学、化学具有各自的地形、建筑和学科装置，地标改为与物理岛一致的建筑缩略图。
- 初始蓝色与探索迷雾保留；访问仅揭雾，完成发现才恢复周边颜色，十关完成恢复整岛。
- 三科共用同一个关卡工作台与开场播放器：黑幕序章、人物、故事、任务。每次进入播放，支持跳过、暂停和重播。
- 布局、舞台比例、人物气泡、资源栏、记录页签、证据选择与结论提交沿用物理岛。各科保留自己的历史人物、仪器、模型、公式、配色与像素动画。
- 即时调参和拖拽不消耗资源，正式记录才结算；保留反馈、错误惩罚、单变量对照、补给、最佳星级与多种结局。

## 代码入口

`src/physics-console.js` 导出 `AtlasScenarioWorkbench`，保留原物理 API；`src/physics-level-intro.js` 导出 `AtlasLevelIntro`。`src/subject-levels.js` 绑定数学和化学的模型、人物、主题与仪器到同一套界面。`src/scenario-engine.js`、`src/research-engine.js` 提取原物理岛的纯规则，共享给化学；数学继续使用原有推理模型与存档。

旧化学 version 1 记录迁移为统一 version 4，原始记录保存在 `legacyChemistry`；历史最高星级不会因迁移重放而升级。数学、物理原记录兼容，三科已恢复的地图颜色独立于重玩进度。

地图地理与地标坐标在 `src/exploration.js`，建筑图标在 `src/subject-map-art.js`。`index.html` 与 `学科脉络地图.html` 保持同一入口内容。

## 美术资产与提示词

数学岛使用内置 image_gen 工具生成，以项目现有 `assets/physics-island.png` 为风格参考。化学底图的生成调用多次网络失败，因此交付版本使用世界地图中现有化学岛原画，以原生 SVG 独立取景、海岸遮罩与海面衔接呈现；原图像素不变，原素材保留。未采用 CLI/API 后备模式。交付文件：

- 数学：`D:/项目ai/map/assets/math-island-painterly.png`
- 化学：`D:/项目ai/map/assets/chemistry-island-painterly.svg`

### 数学岛提示词规格

Create a detailed MATHEMATICS ISLAND game map in landscape 8:5, elevated isometric view, one complete island surrounded by teal sea. Match the Physics Island reference: painterly realistic miniature terrain, weathered pale stone cliffs, forests, waterfalls and classical buildings. Include a southwest proportional-string courtyard, a western brass balance market, surveying terrace, central geometric mechanical garden, southeast parabolic stone bridge, northeast mirror colonnade, southern triangular court, eastern vector canal, northern water clock and observatory. Connect destinations with stone paths and show the entire coastline. No text, letters, labels, UI, people, fog, flat vector graphics, pixel art or low-poly forms.

### 化学岛尝试提示词（未返回结果，未采用）

Generate a complete CHEMISTRY ISLAND game map, landscape 8:5, matching the attached Physics Island style reference very closely: detailed painterly 3D isometric landscape, pale weathered stone cliffs, realistic miniature forests, turquoise sea, waterfalls and classical stone buildings. Reference image is for style only. Show one whole island surrounded by sea, with a dock at southwest, connected pale stone paths and ten clear destinations: southwest specimen greenhouse harbor with jars; western brass weighing workshop; northwest botanical and mineral conservatory; central paired-electron glass lantern pavilion; southern molecule archive; southeast tetrahedral glass pavilion in pink gardens; eastern brass dipole weather terrace; northern academy with a large balance and sealed vessels; northeast copper and turquoise electrochemistry workshop by a stream; southeast coastal telegraph station with two battery vessels and a stone arch. Mountains behind, coves and coast visible. Give the buildings believable varied architecture integrated into the terrain, same materials, lighting, camera angle and high detail level as the reference. Full color, natural palette. No words, labels, letters, numbers, UI, people, borders, fog or icons. Avoid flat vector graphics, pixel art and low-poly.

## 验证

- `npm run check`：所有应用脚本通过语法检查。
- `npm test`：143 项模型、奖励、惩罚、重放与迁移测试通过。
- 浏览器逐关完成数学十关、化学十关：共 40 轮取证、20 次对照，均可提交结论并保存星级；记录时舞台 DOM 保持。
- 三科序章与人物／故事／任务开场、暂停、重播、键盘焦点，以及 360、390、768、1024、1440 宽度无水平溢出。
- 数学坐标拖拽、化学键角拖拽与键盘微调、模型旋转、化学动画暂停、旧自由分子工坊均可用。
- 浏览器旧版化学存档迁移后，最佳星级与原始记录保留，地图色彩不回退；初始无已获颜色，十关完成后整岛恢复。
- 自动化产物在 `output/playwright/unified-*`；使用隔离浏览器上下文，不改动用户的实际本机进度。
