# 知识群岛

以游戏地图探索物理、数学和化学。项目使用原生 HTML、CSS、JavaScript、SVG 与 Canvas，无前端运行时依赖，也无需构建。

## 开始使用

在项目目录运行：

```powershell
npm start
```

打开 http://127.0.0.1:4173 。也可以直接用浏览器打开 `index.html` 或 `学科脉络地图.html`；本地文件模式的进度存储行为取决于浏览器。

## 当前功能

- 三岛邮路：顶栏“三岛邮路”查看五章货单、归档依据与回条。P4 已接入新版首航 P01、C01、M03：同一批四箱货的承载、样品身份与窗口地址；三份成果齐备后首航，小禾寄回缺角箱回条，00 引用真实成果。旧完成、地图复色和历史最佳保留，详见 [P4 阶段记录](docs/worldline/15-P4首航实现与验证.md)。十五项主线与十五项补充委托均已接通新版玩法，原规则记录兼容保留。
- P5 邮局与三站地图：大地图上的潮汐港邮局、标本港观测窗口、测绘台均可直接访问；点回条绳、图夹、信袋、桌角和 00 回看真实成果，与老乔、阿墨、阿澜、小禾交谈。交付后留下夜窗、补注、回寄箱和交班等变化；桌面小物可选且保存。地图委托卡提供三项直接入口，拜访邮局不成为进关条件，详见 [P5 阶段记录](docs/worldline/16-P5邮局地图与伙伴日常.md)。
- P6 夜班章节：P06 连续推拉与旋转采样、C10 外导线与盐桥双通路、M08 直达与最快过河双目标，接入共同交班、回条和两张旧图伏笔；旧记录兼容保留。详见 [P6 阶段记录](docs/worldline/17-P6夜班关卡与验证.md)。
- P7 共同改稿：P07 亲手按短长音、M06 重排变换与逐点叠图、C04 排电子对并核对点线图例，寄出三份修订分册并收到小禾自己的补注。00 可引用本章真实记录。详见 [P7 阶段记录](docs/worldline/18-P7共同改稿与图例核对.md)。
- P8 共同图册：P03 对照地面与球形世界轨迹、M05 拖曲线检查全船宽、C06 转三维模型并核对投影。用途、条件和未检验项随实际寄出版本保存，补做不会改写旧图册。详见 [P8 阶段记录](docs/worldline/19-P8图册用途与适用条件.md)。
- P9 新记录与结局：P10 分离频率与光子通量、M10 先封存预测再拆观测信、C08 拖称量边界并独立配平。十五项主线与五次交付完成整圈夜邮，获得正式桌位；00 可引用十五项真实成果，结局后继续探索。详见 [P9 阶段记录](docs/worldline/20-P9新记录与整圈返航.md)。
- P10 十五项补充委托：五批支线各有实际操作、必要依据与收件人追加回条；可提前研究、晚补寄和另寄补订版本，主线不重演。00 可引用三十项成果，全部现场完成后恢复整张地图色彩。详见 [P10 阶段记录](docs/worldline/21-P10十五项补充委托与追加回条.md)。
- P11 视听与交互打磨：三十关共用人物画框、章节物件、状态符号和结果音效；开头主动跳过，静音立即停止声音，系统减少动态效果即时生效。滑条标签、键盘焦点与 320 像素窄屏布局统一。详见 [P11 阶段记录](docs/worldline/22-P11统一视听与交互打磨.md)。
- P12 完整验收与修订：增加纯新档十五项主线直达结局、三种身份逆序三十关、新旧混合档和保存故障检查；保存失败时提供明确的会话模式，保护损坏原文，改进电键计时。统一验收命令为 `npm run verify`，最新结果见 [完整验收报告](output/release-verification.md)，真人试玩单独记录于 [P12 试玩记录](docs/worldline/24-P12玩家试玩记录.md)。
- P12 试玩修订：按玩家要求接回三科原版的黑屏打字序章、人物、像素故事与任务剧场，每次进关重播，可暂停或跳过。六十个条件页的操作纸条继续提供控件、动作与观察提示，连接新条件、归档和货单。演出与提示免费，正式错误保留原有成本。详见 [入场与操作引导修订](docs/worldline/25-P12试玩修订-入场与操作引导.md)。
- 网站像素序章《答案之前》：约 96 秒、九幕原创像素动画，从探索指南主动打开。可选中文旁白与配乐，支持暂停、分幕定位和跳过；新玩家直接看到首航委托。
- 三学科群岛地图与 30 个独立可交互的知识地点，支持拖动、缩放、学科定位、搜索与地点索引。岛名、关卡地标单击查看介绍、双击直接进入；邮局、任务卡等快捷入口单双击均可，双击只打开一次。触屏与键盘操作沿用原有方式。
- 物理岛“十场未决的探索”：十位科学家、十套独立配色的像素动画场景、三种身份、三幕事件与四种结局；调查、实验和快速试探会改变资源、证据与人物信任。
- 知识详情、理解验证、关系解释和三条跨学科路线。发展故事提供十篇物理发现故事、十位物理人物的彩色插画与档案，另保留数学、化学各三个问题切面。
- 投篮实验：参数调整、地球与月球重力、暂停、参考轨迹、连续轨迹进球判定。
- 函数实验：三个参数实时控制、目标匹配、零系数退化处理、顶点与对称轴。
- 分子实验：甲烷、氨、水三个模板；放置、连接、删除、撤销，另有按钮与列表操作及预设空间结构示意。
- 本地探索手记，分别保存访问、理解验证、关系验证、实验完成和实验参数。
- 手机布局、键盘入口、弹窗焦点管理及减少动态效果支持。
- 地图以冷蓝色开始；三学科均根据有效研究成果恢复附近地形和地标原色。开关迷雾只改变可见范围；访问或知识小测不代替研究完成。
- 外层导航采用深海蓝像素 HUD，使用航海金突出当前任务与主要操作；关卡内部使用十套各自独立的彩色像素界面，装置随实验设置与结果变化，支持减少动态效果。
- 详情卡的说明可以独立滚动，主要操作固定在底部；手机工具栏分行排列。关卡目录、地点索引、手记和实验控制区统一深色界面，阅读文字与数值标签分别使用适合的字体。

本版是可玩的本地产品原型。分子模型采用有限模板与二维投影，发展故事展示问题线索；正式教学发布前仍需按 PRD 完成学科内容与历史来源审核。当前不包含账号、云同步和后台。

## 文件结构

| 文件                            | 作用                                         |
| ------------------------------- | -------------------------------------------- |
| `index.html`                    | 入口与页面结构                               |
| `学科脉络地图.html`             | 同内容的中文名称入口                         |
| `src/styles.css`                | 游戏地图、界面与响应式样式                   |
| `src/blue-horizon.css`          | 全站蓝色主题、首页构图与响应式覆盖           |
| `src/pixel-expeditions.css`     | 逐片复色地图、关卡独立配色、像素界面与动画   |
| `src/pixel-atlas-hud.css`       | 深海蓝像素 HUD、面板层级与多尺寸细节适配     |
| `src/physics-history.js`        | 十篇物理发现故事、人物贡献、研究节点与史料   |
| `src/history-view.js`           | 发现故事与人物档案切换、学科导航和关卡跳转   |
| `src/history-view.css`          | 发展故事阅读室、人物插画与手机阅读布局       |
| `src/research-presentation.js/css` | 三十关共用肖像、章节物件、反馈、窄屏与过渡 |
| `src/physics-pixel-worlds.js`   | 十套原创像素场景、人物、主题与实验状态展示   |
| `src/content.js`                | 节点、关系、路线和题目内容                   |
| `src/site-prologue-data.js`     | 网站序章的九幕文案、人物与 96 秒时间轴        |
| `src/site-prologue-art.js`      | 九个原创 Canvas 像素场景与动作               |
| `src/site-prologue.js`          | 播放、旁白配乐、真实资源状态、会话与焦点管理   |
| `src/site-prologue.css`         | 序章的桌面、手机和减少动态效果布局           |
| `assets/prologue/`              | 按字幕时长校准的 18 段本地中文旁白，约 0.5 MB |
| `scripts/render-site-prologue-narration.ps1` | 离线生成中文旁白（Windows 语音与 FFmpeg） |
| `src/app.js`                    | 地图交互、内容视图、进度和实验界面           |
| `src/worldline-data.js` / `src/worldline.js` | 三十项邮路任务、成果版本、历史与章节交付 |
| `src/research-session.js` / `src/research-adapters.js` | 新研究规则、事务、补充核对、来源与版本隔离 |
| `src/worldline-view.js` / `src/worldline.css` | 邮路货单、归档读数、回条与手机界面 |
| `src/first-voyage-models.js` | 首航三关的参数、结构化测量、原点转换与额外研究 |
| `src/first-voyage-workbench.js` / `.css` | 首航即时操作、局部更新、两条件研究与成果 |
| `src/first-voyage-art.js` / `src/first-voyage-delivery.js` | 主题像素舞台、伙伴、首航与回条演出 |
| `src/postal-world.js` | 根据实际交付推导三站状态、伙伴对白与已取得小物；不判定研究结论 |
| `src/postal-art.js` / `src/postal-room-view.js` | 三站像素场景、可点物件、伙伴日常、图夹与桌面摆放 |
| `src/postal-map-view.js` / `src/postal-world.css` | 三站地图标记、分阶段邮路、当前委托和窄屏布局 |
| `src/science.js`                | 与渲染解耦的物理、函数和分子判定             |
| `src/physics-level-data.js`     | 物理人物、科学档案与史实来源                 |
| `src/physics-models.js`         | 浮力、轨道、能量、波与微观模型               |
| `src/physics-art.js`            | 十位人物立绘与十个建筑地标                   |
| `src/physics-scenarios.js`      | 十关事件内容、身份能力、物理判定和分支规则   |
| `src/physics-investigations.js` | 二十个预判情境、对照资格、论证验证与研究印记 |
| `src/physics-atlas-art.js`      | 十套科学主题插画、手绘人物与学科图章         |
| `src/physics-console.js`        | 身份选择、三幕流程、实验、记录与结局界面     |
| `src/physics-console.css`       | 科学事件界面、独立场景与手机适配             |
| `src/physics-research.css`      | 预判、读数对照、实验记录本和论证工作台       |
| `src/physics-levels.css`        | 地标、人物面板和关卡索引的基础样式           |
| `assets/world-map-v2.png`       | 按当前三座岛重绘的世界总览，文字和交互由代码渲染 |
| `server.cjs`                    | 仅监听本机的静态预览服务                     |
| `tests/science.test.cjs`        | 模型边界与内容完整性测试                     |
| `docs/`                         | PRD 与地图设计方案                           |
| `output/playwright/`            | 浏览器走查脚本、截图与验收记录               |
| `output/legacy-atlas.html`      | 重做前网页的备份                             |

修改入口结构时同步两个 HTML 入口；其他代码和素材由两个入口共享。

## 检查

```powershell
npm run check
npm run check:worldline
npm run check:first-voyage
npm run check:postal-world
npm test
npm run test:browser
npm run test:browser:worldline
npm run test:browser:first-voyage
npm run test:browser:postal-world
npm run test:browser:map-activation
```

首次运行浏览器回归前执行 `npm ci`。`npm run test:browser` 使用项目内固定版本的 Playwright CLI，自动启动 4188 端口的独立预览服务，在隔离会话中检查多标签存档、数学/化学跨视图交互、对照奖励和数学反馈，失败时返回非零退出码。结果保存在 `output/browser-regressions/`，不会读写日常浏览器中的玩家存档。默认使用已安装的 Chrome；可设置 `$env:BROWSER_TEST_BROWSER="msedge"` 使用 Edge，或用 `BROWSER_TEST_PORT` 更改测试端口。

对应源码位于 `tests/browser/high-priority.js` 和 `scripts/check-high-priority.cjs`。

`npm run test:browser:scroll-layout` 检查三十关的手机滚动、真实触摸下滑、桌面侧栏滚轮、320px 窄屏与横屏，以及三座岛复色前后的章节卡片。读数区使用单列，避免标签挤压数值。此检查也包含在 `npm run verify` 中。

邮路回归位于 `tests/browser/worldline.js`，验证真实通关归档、旧档迁移、交付顺序、跨页回条、重置与 390px 界面，结果同样保存在 `output/browser-regressions/`。两个回归命令可依次运行；并行运行时请设置不同的 `BROWSER_TEST_PORT`。

首航回归位于 `tests/browser/first-voyage.js`，从新档直接操作三关，检查免费预览、正式惩罚、额外研究、真实坐标拖动、首航跳过与回看、00 引用、旧档和多标签保护。当前命令与结果见 [P4 验收记录](output/p4-verification.md)。下文保留原实验系统说明；首航三关的现行规则以 P4 记录为准。

邮局地图回归位于 `tests/browser/postal-world.js`，检查三站与物件、伙伴重访、交付后场景、真实引用与桌面选择、局部夜班和整圈邮路的区别，以及跨页更新、重置、键盘和 390px 视口。P5 的完整结果见 [P5 验收记录](output/p5-verification.md)。

旧 `output/playwright/` 脚本保留为历史走查与视觉工具；例如旧自由实验流程可通过 CLI 手动运行：

```powershell
npx --yes --package @playwright/cli playwright-cli -s=islands open http://127.0.0.1:4173 --browser msedge
npx --yes --package @playwright/cli playwright-cli -s=islands run-code --filename=output/playwright/flow-check.js
```

旧脚本的选择器与开场条件不代表当前关卡的自动验收结果；四类高优先问题以 `npm run test:browser` 的明确断言为准。

当前世界地图由内置 imagegen 按三座独立岛屿的地景重绘生成，完整描述保存在 `assets/world-map-v2-prompt.txt`，地图对应关系与验证见 `docs/world-map-redesign.md`。旧图与旧提示词保留为历史资源；界面未接入外部图片、字体或分析服务。

## 物理岛：十场未决的探索

从世界地图进入物理岛，点击“选择一场科学事件”自由选择关卡，也可以点击地标进入。

事件节奏与像素表现参考 [知乎脑洞游乐园](https://zhihu.sanbei101.cn/)。外层导航参考本机 `D:\项目ai\知乎\网页\oauth` 首页的蓝色地平线风格。未知地图统一为冷蓝色，成功发表发现后，附近地图由原图的彩色图层渐进显现。进入关卡则切换为各自独立的像素配色、硬边画框和像素人物。所有场景均由本项目代码原创绘制。事件和回应由本地预设规则结算，无需登录或接入大模型。

十关依次为青绿潮汐港、赭金斜面钟楼、靛紫引力夜空、橙铜蒸汽工坊、粉紫双缝花园、绿铜电磁感应室、落日信号海峡、翡翠矿石研究所、橙焰量子炉房、紫罗兰光电实验室。摇船、水波、滚动小球、引力轨迹、搅拌装置、线圈、信号波、粒子与炉火均有对应动画。实验台设置会更新场景预览；只有提交实验才消耗资源。动画为示意，精确判定和读数使用原有物理模型。

每关包含三幕：建立参照、面对新条件、提交结论。探索者多两格时间；造物者有更多器材、首次实验免器材，并擅长快速试探；质疑者初始信任较高，首次调查的线索更强。

- 完整实验消耗两格时间和一份器材，成功得到强度2的直接证据；失败可以在资源允许时重试。
- 每幕第一次只改一个设置的公平对照，消耗一格时间并复用器材。后续复验恢复普通成本；零改动与多改动不能按公平对照提交。
- 实验前可留下现象预判；猜错不额外扣资源。目标未达成的实验也会保留读数，预判与实际现象在结果页和实验记录本中对照。
- 调查消耗一格时间，得到方向性线索；质疑者首次调查得到额外强度。
- 调查后可以继续同幕实验，实验台内也可请人物排查；每幕只调查一次。调查后的完整线索会带入实验，初始方法提示不直接公布答案。同幕以最强记录计分，完整实验可以升级调查记录。
- 快速试探不耗时间，消耗两份器材。工匠或已有线索时，可得到强度1的初步记录；缺少参照时会损失信任。
- 暂不行动不消耗资源，不增加证据。资源耗尽仍可进入下一幕和结局。
- 第三幕由玩家选择解释、1—3条实际行动记录和适用范围来组织论证。发表成立需要选中记录覆盖两幕、支持强度至少3、至少一次成功的完整实验、正的信任；同一幕不重复叠分。结局分为完整发现、发现成立、保留结论、过度推断。
- 论证未成立或过度推断后，可使用现有记录免费修订，无需重做实验；重玩与修订都保留已收集结局和最佳发现状态。结局展示“先想后试”“公平比较”“证据成链”三个本次研究印记。

十关依次围绕浮力、加速度、引力轨道、功热转换、干涉、电磁感应、电磁波、放射性证据、能量量子与光电效应展开。物理模型、教学类比、史实来源和虚构对白均在关卡手记中说明。牛顿的手记仍可进入自由投篮；数学和化学实验保持可用。

进度保存在 knowledge-islands-v2 的 physicsScenarios 命名空间。离开和刷新可恢复已结算的行动；尚未提交的实验设置不扣费。旧版 physicsStories、physicsLevels 和其他学科记录保留，不自动计入新版通关。旧故事文档、src/physics-scenes.js 与 src/physics-levels.js 保留供对照，当前入口不加载这两个控制文件。

## 浏览器检查

- output/playwright/event-campaign-check.js：十关三幕、二十次成功实验、三种身份、失败重试、分支结局、刷新续玩、旧存档兼容与390/768/1024像素适配。
- output/playwright/event-strategy-check.js：快速试探、保留资源、调查路线、键盘和边界恢复。
- output/playwright/research-upgrade-check.js：十关四十次实验、二十组对照、调查跟进、刷新续玩、论证、研究印记及手机适配。
- output/playwright/research-revision-check.js：论证免费修订、保留选择、失败读数、结局收藏与刷新恢复。
- output/playwright/pixel-theme-check.js：十套独立配色、像素人物和场景、实际运行的动画、装置预览、手机布局和减少动态效果。
- output/playwright/pixel-restoration-check.js：初始蓝色、迷雾与复色分离、实际通关后的复色动画、刷新保留、世界地图同步与全岛复色。
- output/playwright/flow-check.js：投篮、函数、分子实验，搜索、跨学科路线与手机导航回归。
- output/playwright/ui-detail-check.js：360–1440像素的11组视口、工具栏遮挡、详情卡操作区、关卡目录、地点索引与手机实验界面。
- output/playwright/history-room-check.js：十篇发现故事、十位人物插画与贡献、史料入口、故事与人物切换、关卡跳转、数学化学内容保留及六组屏幕尺寸。
- tests/physics-scenarios.test.cjs：全关卡物理路径、身份与成本、所有策略组合、四种结局和事件重放。
- tests/physics-investigations.test.cjs：全部参数组合的现象预判、公平对照资格与成本、证据升级、论证结果、修订和旧版事件兼容。机制设计见 docs/physics-mechanics-upgrade.md。

output/playwright/story-*.js、illustrated-theme-check.js 和 blue-responsive-check.js 是此前视觉版本的检查脚本，不用于当前像素关卡验收。

P6 专项检查：`npm run check:nightwatch`、`npm run test:browser:nightwatch`。三关数值与研究边界见 `tests/nightwatch.test.cjs`；实际结果与截图见 [P6 验证记录](output/p6-verification.md)。

P7 专项检查：`npm run check:revision`、`npm run test:browser:revision`。模型、预算与来源检查位于 `tests/revision.test.cjs`；结果见 [P7 验证记录](output/p7-verification.md)。

P8 专项检查：`npm run check:atlas`、`npm run test:browser:atlas`。独立模型和版本检查位于 `tests/atlas.test.cjs`；结果见 [P8 验证记录](output/p8-verification.md)。

P9 专项检查：`npm run check:return`、`npm run test:browser:return`。模型、封存顺序、预算与引用检查位于 `tests/return.test.cjs`；结果见 [P9 验证记录](output/p9-verification.md)。

P10 专项检查：`npm run check:appendix`、`npm run test:browser:appendix`。十五关模型、预算与补寄检查位于 `tests/appendix.test.cjs`；结果见 [P10 验证记录](output/p10-verification.md)。

P11 专项检查：`npm run check:presentation`、`npm run test:browser:presentation`。音频生命周期单元检查位于 `tests/physics-sound.test.cjs`；结果见 [P11 验证记录](output/p11-verification.md)。完整流程验收与真人反馈见 P12。

P12 完整验收：`npm run verify`。也可单独运行 `npm run test:browser:campaign` 或 `npm run test:browser:resilience`。研究规则与存档检查见 `tests/campaign.test.cjs`、`tests/progress-store.test.cjs`、`tests/revision-input.test.cjs`。说明见 [P12 阶段记录](docs/worldline/23-P12完整验收与试玩修订.md)。

完整验收若因本地环境中断，可用 `npm run verify -- --resume` 续跑。工具会校验代码、资产与测试是否变化，并在报告中标明沿用的已通过组；任何变化都重新执行浏览器检查。

P12 首轮工程验收：424 项单元测试、102 个浏览器场景通过，页面错误 0，见 [首轮验证记录](output/p12-verification.md)。随后补入指引，并按二次反馈恢复原版开场；玩家的视觉接受度与上手体验仍待复试。`npm run test:browser:onboarding` 已接入完整验收，恢复后的当前检查见 [开头恢复专项](output/intro-restoration-verification.md)，此前完整检查留存于 [完整报告](output/release-verification.md)。

三十关现使用阿墨的轻操作指引：每次只提示一个动作、描亮一个控件组，并分别说明即时预览、释放回放、持续按住和夹预览的操作方式。拖动与按住须等松手后才推进；切换第二组条件会说明变化。卡片中的“怎么操作 · 免费”可定位、看手势示范或重新带做，操作进度单独保存在 `knowledge-islands-guidance-v1`，不写入研究记录。原故事开场每次进关照常播放，正式成本和错误惩罚仍按原规则结算。详细说明见 [上手引导修订](docs/worldline/25-P12试玩修订-入场与操作引导.md)。

## 港口序章与飞行入场

每次打开或刷新网页都先显示港口首页，包括带 `#map` 的旧地址及浏览器历史返回。向下滚动依次阅读六幕：海的那边 → 三座岛 → 见习信使的桌角 → 搭档阿墨 → 四箱货的第一份委托 → 我想试试。原生滚动允许向上回看；页码、上一幕、继续按钮与键盘提供等效操作。手机长内容可以在同一幕中继续阅读，序章不设置强制阅读时长。

读到最后一幕并滚到页尾后，需要停止上一轮滚动，再做一次明确的向下操作，才触发约 7 秒的离港、掠海、升高与真实全图交接。触控板惯性、刚到页尾的触摸滑动与按住方向键都不会直接越过故事启动飞行。最后的继续按钮也可以明确启航。任何一幕都可直接进入地图，Escape 可跳过；有游戏进度时顶部入口显示“继续探索”。每次刷新仍从首页开始，序章不增加或重置探索成果。

`src/harbor-story.js` 提供六幕信息、可编辑 SVG 场景与最后一次滚动的意图判断；`src/harbor-story.css` 管理叙事排版、人物和插画。海图、邮局桌角、信袋、渡鸦、四箱委托等场景沿用现有像素伙伴与港口图，没有新增图片服务或外部运行依赖。

`src/harbor-flight.js` 计算镜头；`src/harbor-entry.js` 管理原生滚动、分幕导航、触摸、准备、重播与取消。飞行后半段移动的是原来的 `#world`，其颜色、迷雾、节点和存档状态保留，结束时按实际地图容器的位置交还。减少动态时仍能阅读全部六幕，启航使用短暂淡出。各关原版历史开头和操作指引照常保留。

大地图与飞行终点共用 `src/map-camera.js`：围绕三岛主体取景，外圈海雾柔化到画布边缘，地标随屏幕保持可读大小，短横屏使用紧凑导航。比例回归检查 320–2560px 视口下全部六个站点操作是否在画面内、是否被其他控件遮住。

大地图上的岛屿与邮路站点分别标注：三座岛使用大字岛名、学科符号与探索入口；邮局、测绘台、观测窗口位于各岛沿岸，用较小的信件地标表示。邮路线跟随站点坐标，岛名打开学科介绍，站点打开相应邮务场景。回归同时检查六个入口是否互不重叠、岛名是否保持视觉优先。

港口底图由内置 imagegen 生成，已保存到 [harbor-arrival-v1.png](assets/harbor-arrival-v1.png)，完整最终提示词与生成方式见 [提示词](assets/harbor-arrival-v1-prompt.txt)。旧的九幕科学史网站序章仍可在探索指南中单独重看。

专项命令：`npm run check:harbor`、`npm run test:browser:harbor`。首页回归覆盖六幕叙事、逆向阅读、页尾意图判断、真实地图交接、跳过与重播、原版关卡开头、手机触摸及横竖屏、减少动态效果、加载中取消、缺图、受保护存档和双 HTML 入口。结果位于 `output/browser-regressions/harbor.json`；该组已加入 `npm run verify`。

六幕动效位于 `src/harbor-motion.css`：文字错峰入场、插画滚动视差、海雾与远鸟、邮路绘制、纸页与信袋、阿墨眨眼与纸夹、小船与水波、启程前的角色动作。桌面采用整屏停靠，手机与矮屏自由滚动。离屏、切出网页与飞行时暂停环境循环；系统减少动态效果会关闭入场和视差。SVG 场景坐标与局部动画支点分开，保留物件的位置。验证见 [六幕动效记录](output/story-motion-verification.md)。

地图双击直达专项：`npm run test:browser:map-activation`。验证三岛、三十关、预览重绘后的第二次点击、邮局与任务入口、键盘和触屏，结果见 [地图双击验证](output/map-double-click-verification.md)。
