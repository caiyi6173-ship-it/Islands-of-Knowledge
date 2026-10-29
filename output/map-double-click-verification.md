# 地图双击直达验证

2026-10-27T12:23:42.060Z

- 三座岛的岛名、导航和三十个关卡地标支持双击直达；单击仍立即显示介绍。
- 邮局、任务卡和房间物件的双击只执行一次，避免重新打开或跳过开场。
- 点击位置按同一次鼠标手势衔接，预览重绘或相机移动不改变进入目标；拖动离开、滚轮、键盘和切出窗口均取消待配对点击。
- 修正地图地标被通用按下样式推偏，以及数学和化学岛右侧地标被详情挡住的问题。
- 触屏保留单击查看与显式进入；键盘 Tab、Enter 与 Escape 沿用原行为。

446 项单元测试、33 个浏览器场景通过，页面错误 0。其中专项使用真实鼠标坐标双击全部三十关，检查每关只挂载一次、原版开场保留且进入不生成正式研究证据。测试使用隔离浏览器。

命令：

```powershell
node --test tests/*.test.cjs
node scripts/check-high-priority.cjs map-activation
node scripts/check-high-priority.cjs postal-world
node scripts/check-high-priority.cjs high-priority
node scripts/check-high-priority.cjs campaign
```

公网已发布，六个文件与本地 SHA-256 一致；在线浏览器另通过 7 个场景，覆盖三座岛全部三十关，页面错误 0。发布包和回退信息见 [本次发布](./deploy/map-double-click-20261027-122113Z/status.json)。
