# 港口首页与飞行入场验收

完成时间：2026-10-21T13:09:17.231Z

本次执行首页专项与相关回归，共 428 项单元测试、33 个浏览器场景通过，页面错误 0。未执行整套 npm run verify；其他阶段的历史报告不作为本次重跑结果。

## 执行项

- npm run check 与 npm run check:harbor：通过。
- 两个 HTML 入口逐字节一致。
- node --test tests/*.test.cjs：428 项通过。
- harbor：9 个浏览器场景通过，页面错误 0。
- first-voyage：10 个浏览器场景通过，页面错误 0。
- postal-world：8 个浏览器场景通过，页面错误 0。
- high-priority：6 个浏览器场景通过，页面错误 0。

## 体验入口

- / 或 /#home：港口首页，下滑或点击启航。
- /#map：直接进入地图；地图页刷新保留此入口。
- 探索指南 → 回到启航首页：重看。

## 结果

首页采用新生成的冷蓝港口插画；七秒内由码头前景、海面与远岛，经过分层云雾，升高到当前实际世界地图。结束时地图中心、缩放与容器位置一致，未复制地图或重建存档。

保留当前解锁颜色、迷雾、地图节点、三岛关卡原版历史开头及操作引导。Escape/直接进入均可取消；加载中跳过、立即重播、减少动态效果、缺图和受保护存档均有浏览器验证。

## 视觉走查

- [桌面首页](browser-regressions/harbor-home-desktop.png)
- [手机首页](browser-regressions/harbor-home-mobile.png)
- [横屏首页](browser-regressions/harbor-home-landscape.png)
- [掠海](browser-regressions/harbor-sea.png)
- [升高](browser-regressions/harbor-rise.png)
- [交接前](browser-regressions/harbor-handoff.png)
- [交还地图](browser-regressions/harbor-map.png)

## 图片素材

- 生成模式：内置 image_gen。
- [已接入底图](../assets/harbor-arrival-v1.png)
- [完整最终提示词](../assets/harbor-arrival-v1-prompt.txt)
