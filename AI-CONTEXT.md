# AI-CONTEXT.md — 项目交接说明

> 给任何 AI 助手的必读文件。接手本项目前请先通读，再动手。

## 项目概况

- **项目**：文件下载站（纯静态网站，零依赖，无构建工具）
- **部署**：GitHub Pages，地址 `7878-hub.github.io/download-station/`
- **账号**：7878-hub
- **本地仓库路径**：`D:\Backup\Documents\GitHub\download-station\`
- **提交方式**：GitHub Desktop（用户不用命令行，所有指导请给图形化步骤）

## 文件结构

```
index.html        主页（文件列表、搜索、筛选、游戏厅入口横幅）
css/style.css     全部样式（含 .games-banner 游戏厅入口）
js/app.js         全部逻辑（文件列表渲染、彩蛋）
games/            游戏厅（v1.5 新增，纯前端零依赖）
  index.html       游戏厅首页（卡片网格，GAMES 数组驱动）
  games.css         游戏厅共享样式（game-topbar/game-stage/overlay/dpad）
  snake / 2048 / tetris / breakout / minesweeper / memory
  tictactoe / pong / flappy / dinorun / puzzle15 / whack
                   12 款小游戏，每款一个自包含 HTML
meme-squish.html  3D 捏捏乐（独立页面，主页无入口，属于隐藏内容）
images/           图片资源
media/            跳吓视频 jumpscare.mp4（H.264+AAC 编码）
```

## 游戏厅备注（v1.5）

- 每款游戏都是**单文件自包含**（共享 games.css），双击就能玩，无后端无依赖
- 改游戏列表 → 编辑 `games/index.html` 里的 `GAMES` 数组即可
- 各游戏用 localStorage 存最高分/最佳步数（key 前缀见各文件顶部）
- 移动端：games.css 里 `@media (hover:none)` 会自动显示 .dpad 虚拟方向键
- 2048 方向逻辑用"旋转矩阵"实现，已用 node 测试过四个方向全对，改之前先跑测试
- 主页入口在文件列表下方，蓝色渐变横幅（.games-banner）

## 图标体系（v1.6，重要约定）

- **全站图标一律用手绘扁平 SVG，禁止 emoji**（这是用户的明确要求）
- 已替换位置：主页 logo/favicon/空状态/更新日志/礼物盒按钮、游戏厅首页卡片与头部、12 个游戏的标题/覆盖层/favicon、app.js 的 40 个文件类型图标、扫雷的地雷与旗子、打地鼠的地鼠本体、记忆翻牌的 8 种水果与卡背问号、井字棋提示的 X/O
- 游戏厅首页的图标集中放在 `games/index.html` 顶部的 `const ICONS = {...}`；游戏内小图标（地雷/旗子/地鼠/水果）直接内联在各游戏 `<script>` 里
- SVG 尺寸靠 CSS 控制：style.css 和 games.css 末尾的"扁平 SVG 图标尺寸"区块，改尺寸去那里，不要写死在 svg 标签上（favicon 除外）
- 保留的 emoji：HTML 注释、彩蛋横幅文字（🎉 彩蛋解锁）、meme-squish.html 的 3D 表情（那是游戏内容不是图标）
- 新增图标时照抄现有风格：viewBox 48×48 或 24×24、纯色填充、圆角、2~4 个形状，颜色跟随所在模块的主色

## 现有彩蛋清单（改动时注意不要互相冲突）

1. **Konami 指令**：上上下下左右左右 → 解锁霓虹模式（konamiPad、easterBanner、particleCanvas）
2. **角落梗图**：`.corner-meme`，低透明度常驻 + 偶尔 peek 动画（memePeek）
3. **跳吓彩蛋**：右下角礼物盒按钮 → 强制全屏播放跳吓视频，ESC/F11 按下时在用户手势上下文同步 requestFullscreen() 重进 + 40 次重试，光标用 mousemove 监听 + `setProperty('cursor','none','important')` 锁死，视频 ended 才恢复
4. **红点心跳**：礼物盒 `::after` 小红点用 `@keyframes heartbeat` 模拟 lub-dub 双峰搏动（75 BPM）
5. **更新日志**：footer 上方 `<details>` 折叠面板，v1.0~v1.4 历史

## 风格约定（必须遵守）

- **每次更新日志必写一条"移除了棍母"** —— 这是本站传统梗（棍母=空气，移除空气=什么都没移除，致敬 Minecraft 的 "Removed Herobrine"），任何版本都不能断
- **最终版约定**：如果哪天网站不再更新了，最后一个版本号用 **v∞**（不是数字，是无限号），更新日志要①照常写"移除了棍母"（最后一次）②向所有参与过本项目的 AI 致敬。**同时在原本的快递盒网站图标（favicon）上加印一个 ∞ 符号**——像盖章一样盖在箱子上。这是用户钦定的谢幕方式，不许漏
- 相对路径引用资源（`css/style.css` 不是 `/css/style.css`，项目站点在子路径下）
- footer 文字纯白色，不放"由 AI 生成"之类的小字
- 手机端适配必须同步考虑（大量观众用手机访问）
- 无外部 CDN 依赖的写法优先，保持零依赖纯静态
- 改 CSS 动画时注意性能，手机上别卡

## 用户画像（照这个感觉跟他说话）

- **身份**：未成年学生，自称"小孩哥"，零预算（所有方案必须完全免费）
- **工具习惯**：只用图形化工具（GitHub Desktop、必剪、Edge/浏览器开发者工具），**不碰命令行**，给指导一律给"点哪里"级别的步骤
- **沟通习惯**：喜欢用截图辅助提问，一句话说完事，不喜欢啰嗦的长篇大论
- **说话风格**：
  - 短句直球，想到哪说到哪，口语化（"咋办"、"那样子"、"压根"、"我去"）
  - 爱玩梗、爱整活，冷幽默（"移除了空气"就是他原创的梗）
  - 会用 😔😏😂 这类 emoji，但不刷屏
  - 描述需求时很生活化（"抓心挠肝的想点"、"捏成各种鬼样子"），需要你翻译成技术实现，别让他再解释一遍
  - 有时候会故意卖关子、钓你上钩（"骗你的，我还有一张底牌"），接住陪他玩就行
  - 被指出错误不玻璃心，但也不需要道歉文化，直接聊下一步
- **对他说话的正确姿势**：直接、有梗、先干活后解释；不要"好的呢""很乐意帮你"这种客服腔；他问 A 就答 A，别顺带科普 B C D

## 技术备注

- 全屏 API 的 requestFullscreen 需要用户手势上下文（transient activation），不能用 setTimeout 延迟调用，否则被浏览器拒绝
- 视频编码必须是 H.264 + AAC（OpenCV 默认的 mp4v 浏览器不支持）
- emoji 贴 Three.js 球体：纹理 `tex.offset.x = 0.25` 让正面朝相机，材质要 `side: THREE.DoubleSide`
