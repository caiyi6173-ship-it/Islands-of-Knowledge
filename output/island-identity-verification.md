# 岛屿名称与邮路站点分离验收

本次修改将三座岛的主入口与三个邮路站点拆开：大字岛名、学科符号与探索入口置于岛屿主体；邮局、测绘台、观测窗口改为沿岸的小地标。邮路线从新站点坐标生成。

岛名打开对应学科介绍并可进入该岛，站点仍打开原邮务场景。原有关卡内容、进度、复色、迷雾与每次打开/刷新先进入港口首页的规则均保留。

验证：428 项单元测试通过；邮局地图 10 个浏览器场景与首页飞行 10 个浏览器场景通过，页面错误 0。未运行完整 npm run verify。改动脚本语法检查通过，两个 HTML 入口保持一致。

覆盖 320×568、390×844、667×375、844×390、1440×900、1920×980、2560×1080。断言三个独立岛名和三个邮路站点都位于画面内、可点击、互不重叠，且岛名保持视觉优先。

- [桌面效果](playwright/island-identity-1920.png)
- [手机效果](playwright/island-identity-390.png)
- [窄屏效果](playwright/island-identity-320.png)
- [横屏效果](playwright/island-identity-667.png)
- [地图回归结果](browser-regressions/postal-world.json)
- [首页回归结果](browser-regressions/harbor.json)
