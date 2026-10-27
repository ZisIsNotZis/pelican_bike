<p align="center">
  <img src="assets/logo.svg" width="128" height="128" alt="Pelican Express 标志：一只骑着红色单车的鹈鹕">
</p>

<p align="center"><a href="README.md">English</a> · 简体中文</p>

<h1 align="center">鹈鹕快车</h1>

<p align="center"><strong>一个滑块，一只鹈鹕，一辆红色单车：从晴天慢骑一路冲进夜间曲速隧道。</strong></p>

<p align="center">只有一个 HTML 文件，手绘 SVG 场景，合成音效，没有任何依赖。</p>

![鹈鹕快车：晴天公路上，一只鹈鹕骑着红色单车经过鱼市](assets/preview_day.png)

## 快速开始

克隆仓库，然后用现代浏览器打开 `pelican_bike.html`。不用安装、不用构建，也不用起服务器。

```bash
git clone https://github.com/ZisIsNotZis/pelican_bike.git
cd pelican_bike
open pelican_bike.html        # macOS
# xdg-open pelican_bike.html  # Linux
# start pelican_bike.html     # Windows
```

页面完全离线运行。受浏览器限制，声音会在你第一次点击或按键之后才响起。

### 操作

| 操作 | 效果 |
| --- | --- |
| 拖动速度滑块 | 依次经过 `cruising`、`brisk`、`working hard`、`ALL OUT!!`、`SONIC`、`LUDICROUS` 六个档位 |
| 点击鹈鹕 | 让它叫一声 |
| 点击车铃，或按 `B` | 响铃 |
| 按 `N` | 在白天和夜晚之间切换 |
| 按 `M` | 开关风声、低频轰鸣、铃声和鹈鹕叫声 |
| `?speed=85&night=1&instant=1` | 用链接直达指定速度、夜间模式，并跳过渐变 |

## 目前能做什么

- **六个档位，一趟到底。** 速度表从 km/h 一路跳到马赫数，再到光速的几分之一，画面也跟着升级。
- **手工搭出来的 SVG 世界。** 四层视差、循环公路、云、山丘、树、鱼市路牌，还有一辆用反向运动学驱动双腿的单车。
- **昼夜切换。** 夜里有星星、月亮、车头灯和萤火虫；白天有蝴蝶和太阳。
- **跟着速度走的音效。** 风声和低频轰鸣由 Web Audio API 实时合成，音量与滤波随速度变化；铃声和鹈鹕叫声也是合成的。
- **高速段的视觉爆发。** 尘土、飞散的羽毛、汗珠、蒸汽、漫画式怒气符号、轮缘火花、速度线、音爆环、残影、彩虹尾迹、时间隧道和画面震动。
- **体量很小。** 没有依赖、没有网络请求、没有构建产物。一个 HTML 文件，几年后打开照样能骑。
- **尊重“减少动态效果”。** 当系统开启 `prefers-reduced-motion: reduce` 时，页面只画一帧静态画面，不循环播放。

| 夜间骑行 | 音速段 | 极速夜骑 |
| --- | --- | --- |
| ![夜间模式](assets/preview_night.png) | ![音速段](assets/preview_sonic.png) | ![夜间的极速模式](assets/preview_ludicrous_night.png) |

录好的骑行视频：[assets/pelican_ride.mp4](assets/pelican_ride.mp4)。

## 项目结构

```text
pelican_bike.html          整个产品：内联 CSS、一个 SVG 场景、一个 JavaScript 文件。
record3.js                 仅开发用的确定性录制脚本（无头 Chromium + DevTools）。
assets/                    标志、四张预览截图、录好的骑行视频。
docs/project-status.md     项目状态与范围。
CONTRIBUTING.md            贡献范围、手动检查清单和 PR 约定。
LICENSE.md                 AGPL-3.0。
```

`pelican_bike.html` 内部：

- 场景是一个 SVG，复用了渐变、遮罩、视差瓦片和粒子池。
- 一个 `requestAnimationFrame` 主循环，把滑块值同时映射到档位强度、世界速度、音效和特效。
- 不引用外部字体、图片、脚本或样式表，页面自给自足。

## 如何开发

直接改 `pelican_bike.html`，刷新浏览器即可。没有构建步骤，也没有测试套件。

需要录制一段确定性骑行时，可以用仓库里的脚本：

```bash
node record3.js 720 frames3 30
```

它会把 720 帧、30 fps 的 JPEG 写进 `frames3/`。运行前需要 Node.js，以及一个 Chromium 无头 shell（路径在 `record3.js` 顶部配置）。`frames*/` 已被 Git 忽略。

## 如何参与

先看 [CONTRIBUTING.md](CONTRIBUTING.md)：里面写了改动范围、提交 PR 前要手动过一遍的检查清单，以及提交信息风格。简而言之：一个 PR 只做一件事，涉及画面的改动附截图或短视频，页面保持在单个 HTML 文件、运行时不引入依赖——这条限制就是项目本身。

除此之外，这个 demo 已按里程碑关闭。详见 [docs/project-status.md](docs/project-status.md)。

## 路线图

### 已实现

- [x] 可交互速度滑块，六个命名档位和实时速度读数
- [x] 手绘 SVG 鹈鹕、单车、视差风景和循环公路
- [x] 昼夜模式：星星、月亮、车头灯、萤火虫和蝴蝶
- [x] 合成风声、低频轰鸣、铃声和鹈鹕叫声
- [x] 音爆、时间隧道和极速段特效
- [x] 键盘操作、URL 直达参数和减少动态效果支持
- [x] 确定性录制脚本和展示预览图
- [x] 零依赖、单文件即可打开

### 计划中

- [ ] 无。这个 demo 已按里程碑关闭（2026-09-29）。

**未来设想。** 让鹈鹕快车一直是一个小巧、自给自足的玩具：一个几年后打开还能骑的 HTML 文件。如果以后重新开工，自然的方向是给同一趟骑行增加更多地点和天气，而不是加更多控件或引入构建系统。

## 许可证

[AGPL-3.0](LICENSE.md)。版权所有 © ZisIsNotZis。鹈鹕乐意到处旅行，只要源代码跟着一起走。
