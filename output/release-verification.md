# 本地完整验收

开始：2026-10-21T09:34:10.048Z

完成：2026-10-21T09:45:16.302Z

95 个 JavaScript 文件、两个一致入口、424 项单元测试、111 个浏览器场景均通过，页面错误 0。

命令：`npm run verify`；环境中断后可用 `npm run verify -- --resume`。代码、资产或测试变化会重跑所有组。各组浏览器串行运行，使用独立测试服务及隔离上下文。

| 检查 | 数量 | 执行情况 |
|---|---:|---|
| syntax | 95 | 本轮执行 |
| matching-entrypoints | 2 | 本轮执行 |
| unit | 424 | 本轮执行 |
| browser:high-priority | 6 | 本轮执行 |
| browser:worldline | 9 | 本轮执行 |
| browser:first-voyage | 10 | 本轮执行 |
| browser:postal-world | 8 | 本轮执行 |
| browser:nightwatch | 8 | 本轮执行 |
| browser:revision | 7 | 本轮执行 |
| browser:atlas | 7 | 本轮执行 |
| browser:return | 8 | 本轮执行 |
| browser:appendix | 19 | 本轮执行 |
| browser:presentation | 7 | 本轮执行 |
| browser:campaign | 10 | 本轮执行 |
| browser:resilience | 3 | 本轮执行 |
| browser:onboarding | 9 | 本轮执行 |

[完整 JSON](./release-verification.json)

这些是工程验收结果，不能代替真实玩家对趣味性、理解与节奏的试玩反馈。
