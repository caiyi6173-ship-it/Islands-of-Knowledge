# P8 验证记录

日期：2026 年 10 月 20 日。知识群岛 / R04「图纸背面的那一行」。

## 工程结果

- `npm run check`、`check:worldline`、`check:first-voyage`、`check:postal-world`、`check:nightwatch`、`check:revision`、`check:atlas` 全部通过。日志：[p8-syntax.log](./p8-syntax.log)。
- `node --test --test-reporter=tap tests/*.test.cjs`：290 项通过，0 失败，较 P7 新增 31 项。完整结果：[p8-unit-tests.tap](./p8-unit-tests.tap)。
- 七组真实浏览器回归：55 项场景全部通过，0 页面错误。使用独立服务端口与隔离上下文，没有操作玩家在 4173 上的存档。
- 两个正式 HTML 入口逐字节一致；新增脚本均在应用入口之前加载，没有增加运行时依赖。
- 原预览地址 `http://127.0.0.1:4173/` 返回 HTTP 200。

| 命令 | 场景数 | 结果 |
|---|---:|---|
| `npm run test:browser:atlas` | 7 | [atlas.json](./browser-regressions/atlas.json) |
| `npm run test:browser:revision` | 7 | [revision.json](./browser-regressions/revision.json) |
| `npm run test:browser:nightwatch` | 8 | [nightwatch.json](./browser-regressions/nightwatch.json) |
| `npm run test:browser:first-voyage` | 10 | [first-voyage.json](./browser-regressions/first-voyage.json) |
| `npm run test:browser:postal-world` | 8 | [postal-world.json](./browser-regressions/postal-world.json) |
| `npm run test:browser:worldline` | 9 | [worldline.json](./browser-regressions/worldline.json) |
| `npm run test:browser` | 6 | [high-priority.json](./browser-regressions/high-priority.json) |

## P8 专项检查内容

1. **轨迹柜**：地面抛体与理想球形世界明确分开，拖动速度即更新。改变用途标签不改变轨迹读数；将教学模型提交为实际运输指令会扣正式成本与可靠度。碰撞、闭合轨迹、开放轨迹和画面裁切分别判断。可诚实记录不同轨迹作比较，暂停与退出能清理播放。
2. **桥洞图**：实际拖动顶点和开口，切到新页前显示固定顶点条件，保留旧曲线。顶点高 5、全船宽最低仅 3.2 的曲线正式失败；调整后最低 3.875，通过净空要求。可引用真实有效记录补充凹向下曲线的区间依据，获得第三星。
3. **空间构型**：实际拖动相机，三维夹角保持不变，投影夹角随观察方向变化。仅填写 109.5° 不改变真实模型；错误标注在正式提交时结算。选做逐一对应 H1—H4 的前后关系，换视角后重新对应；现代水分子页独立展示两氢及两片孤对区域。
4. **共同图册**：可提前完成、归档和刷新恢复；交付前几章后直接使用已有 R04 成果。交付先保存再播放，人物共同展开各自遗漏的条件。图册三张正面页引用实际寄出版本的用途、条件、读数与尚未检验的事项，并引出 R05。
5. **版本与邮局**：寄出后补做研究产生新版本，回看图册仍展示原寄出版本；图夹展示正式记录中的条件与来源。跳过、退出、重看不重复交付，也不提前标记三岛完整夜邮。
6. **手机与减少动态效果**：390px 下三关操作区与条件说明没有横向溢出。减少动态效果时轨迹默认静止；曲线保留原生输入，空间相机支持方向键与滑条。
7. **旧档与生命周期**：原 C06 进行中任务可继续，明确切换新版时保留旧命令。退出轨迹台后没有残留播放或新正式记录。

单元测试另验证抛体公式、圆轨道周期、椭圆模型时间、轨迹分类与裁切区别、固定顶点参数拒绝、整个船宽的解析最低值、三维投影与退化视角、标注与物理量分离、逐顶点对应、三角色预算、正式错误成本、伪造缓存重算、旧完成标记不补造读数，以及已寄出图册版本的稳定性。

## 实际截图

已打开检查轨迹台、桥洞图、现代水分子页、三页图册与手机界面。截图检查后修正了桥洞坐标轴的意外填色，以及拖动分子中央文字时会选中文字的问题，并重新生成截图。

- [P03 轨迹柜](./browser-regressions/p8-orbit.png)
- [M05 全船宽净空图](./browser-regressions/p8-bridge.png)
- [C06 三维角与投影角](./browser-regressions/p8-water.png)
- [共同图册三张正面页](./browser-regressions/p8-book.png)
- [390px 空间构型操作区](./browser-regressions/p8-mobile-model.png)

## 已知范围

以上是工程检查与浏览器操作验证，真实玩家对故事、难度和操作手感的反馈仍待收集。累计十二关使用新世界线玩法，其余十八关保留既有机制。P8 不提前完成最终环线；下一阶段为 P9 / R05 与最终收束。

模型、关卡设计、版本规则与资料来源见 [19 P8 阶段记录](../docs/worldline/19-P8图册用途与适用条件.md)。
