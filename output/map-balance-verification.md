# 大地图比例调整验收

完成：2026-10-21T14:07:55.486Z

修改：大地图围绕三岛主体取景；地图四周渐变延展到海雾背景；缩小邮局建筑与文字牌；压缩任务卡；短横屏使用单行导航与紧凑地标。地图复色、迷雾、邮路与存档规则沿用原逻辑。

地图与飞行终点统一由 src/map-camera.js 计算取景，避免结束时换用不同缩放造成跳动。

本次通过：428 项单元测试，邮局地图 9 个浏览器场景，首页飞行 9 个浏览器场景，页面错误 0。已完成新模块及改动脚本语法检查，两个 HTML 入口逐字节相同。未运行完整 npm run verify。

布局检查：320×568、390×844、667×375、844×390、1440×900、1920×980、2560×1080；检查全部六个地图操作入口位于画面内，且操作中心不被其他控件遮挡。

- [宽屏关闭迷雾预览](playwright/map-balance-1920.png)
- [宽屏迷雾与节点](playwright/map-balance-verified-1920.png)
- [手机横屏](playwright/map-balance-verified-667.png)
- [手机竖屏](playwright/map-balance-390.png)
- [邮局地图 JSON](browser-regressions/postal-world.json)
- [首页飞行 JSON](browser-regressions/harbor.json)
