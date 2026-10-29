# P6 验证记录

日期：2026 年 10 月 20 日。项目：知识群岛 / R02 夜班还开着。

## 已通过

- `npm run check`、`npm run check:worldline`、`npm run check:first-voyage`、`npm run check:postal-world`、`npm run check:nightwatch`：全部通过。日志：[p6-syntax.log](./p6-syntax.log)。
- `node --test --test-reporter=tap tests/*.test.cjs`：231 项通过，0 失败（比 P5 新增 20 项）。原始结果：[p6-unit-tests.tap](./p6-unit-tests.tap)。
- 五组真实浏览器检查：41 项场景，0 页面错误。测试各自启动独立端口并使用隔离上下文，没有读写玩家在 4173 上的存档。
- 两个正式 HTML 入口逐字一致；预览地址 `http://127.0.0.1:4173/` 返回 HTTP 200。

| 命令 | 场景 | 结果 |
|---|---:|---|
| `npm run test:browser:nightwatch` | 8 | [nightwatch.json](./browser-regressions/nightwatch.json) |
| `npm run test:browser:first-voyage` | 10 | [first-voyage.json](./browser-regressions/first-voyage.json) |
| `npm run test:browser:postal-world` | 8 | [postal-world.json](./browser-regressions/postal-world.json) |
| `npm run test:browser:worldline` | 9 | [worldline.json](./browser-regressions/worldline.json) |
| `npm run test:browser` | 6 | [high-priority.json](./browser-regressions/high-priority.json) |

各组并行运行时设置独立 `BROWSER_TEST_PORT`（4191—4194）；P6 专项使用默认测试端口 4188。浏览器来源为项目固定版本 Playwright CLI，脚本在 `tests/browser/`。

## P6 具体证据

1. P06 用真实按住操作采样：推进、停稳、反向、整圈转动。检查正负响应、原始样本、同路比较、三星预算与 SVG 根节点保留。自由操作不扣费，刷新可恢复正式片段。来回抖动不获得反向控制比较资格。
2. C10 直接拖盐桥接头入接口，点击已连接接口拆线，再检查两种缺路和完整回路。20 Ω / 45 Ω 读数、方向签独立、合格负载比较与原始配置保存均通过。
3. M08 直接拖黄色箭头，再用滑条精调。直达与最快目标分开，换目标保留旧航向；正式错误扣成本和可靠度。两张有效路线即可两星归档，可选推理引用实际记录后修订为三星，不产生虚假的第三次测量。
4. 提前完成 R02 不交付、不夺走首航开头。R01 寄出后原 R02 成果直接可用。R02 在演出前保存，跳过、回条回看不重复结算，回程旧图自然引出 R03。
5. 仅 P↔C 显示局部夜班，没有提前点亮三岛完整夜邮。
6. 390px 界面无横向溢出，键盘按住可输入真实轨迹。暂停环境动画后仍能操作实验；减少动态效果设置下船只默认停播，控制按钮与数值计算状态一致。
7. 旧规则进行中的 P06 可继续，明确切换新版后旧命令不变。另一页面提交同关研究会关闭旧实验台，旧采样器随之销毁，不再覆盖新记录。
8. 三种角色都能完成三关可选研究；无来源、重复的推理不收费；伪造缓存读数在命令重放时重算；推理引用与旧归档版本保留。

## 截图与视觉检查

已打开检查以下实际浏览器截图：工坊、信号台、航向、手机信号台；交班截图也保留供审阅。

- [P06 工坊](./browser-regressions/p6-workshop.png)
- [C10 双通路](./browser-regressions/p6-signal.png)
- [M08 回程河道](./browser-regressions/p6-return-route.png)
- [夜班回条与旧图](./browser-regressions/p6-night-receipt.png)
- [390px 信号台](./browser-regressions/p6-mobile-signal.png)

三关共用首章实验台结构，场景与配色按内容区分。输入和响应分色、航向箭头明确、接头提供开关替代操作。图像为 SVG / CSS，没有新增图片生成服务依赖。

## 范围

完成 P6 工程接入与自动检查。真实玩家对难度、操作手感、故事吸引力的反馈仍待收集。其余二十四关保留既有机制，R03—R05 新玩法与完整最终演出属于后续阶段；下一阶段为 P7。

详细规则与教学资料见 [17 P6 阶段记录](../docs/worldline/17-P6夜班关卡与验证.md)。
