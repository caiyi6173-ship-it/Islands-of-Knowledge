# 原版关卡开头恢复验证

恢复原有黑屏打字序章、人物肖像、像素故事场景、分幕导航、自动播放与暂停；保留进入实验台后的操作纸条。任务卡对应现有两组条件。

完成：2026-10-21T10:11:08.766Z

424 项单元测试、32 个浏览器专项场景均通过，页面错误 0。全部源脚本语法检查通过，两个 HTML 入口一致。

本次为恢复开头的专项回归；不是重新执行十三组完整验收。上轮完整验收的时间与代码指纹保留在 release-verification.json。

| 专项 | 场景数 |
|---|---:|
| first-voyage | 10 |
| onboarding | 9 |
| presentation | 7 |
| high-priority | 6 |

覆盖三十关历史序章、原肖像与像素动画、当前目标、跳过/重播、暂停/自动推进、免费指导与正式错误、两个条件页控件、320 px 与减少动态、首航归档寄送、旧记录与冲突恢复。

截图：original-intro-person.png、original-intro-story-P01.png、original-intro-story-M03.png、original-intro-story-C01.png 及 original-intro-mobile-*.png，位于 browser-regressions/。

检查使用独立测试服务与隔离浏览器上下文，不读取或清空 4173/4174 的玩家进度。视觉接受度仍待玩家确认。

[机器可读结果](./intro-restoration-verification.json)
