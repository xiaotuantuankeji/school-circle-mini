# School Circle Mini (Campus Social Mini-Program)

![license](https://img.shields.io/badge/license-Apache%202.0-blue)
![platform](https://img.shields.io/badge/platform-WeChat%20Mini--Program-green)
![framework](https://img.shields.io/badge/framework-uni--app-brightgreen)

**An open-source campus social network / campus community mini-program for universities.** Built with uni-app (Vue 2 + TypeScript), it provides campus feeds, campus circles, course schedule management, playmate matching and student identity verification — everything you need to launch your own campus SNS for college students.

## Features

- Campus feeds & campus circles (校园动态 / 校园圈子)
- Course schedule management (课程表)
- Playmate matching (玩伴匹配)
- Student identity verification (校园身份认证)
- Runs on WeChat Mini-Program & H5 with a single codebase

## Tech Stack

uni-app · Vue 2 · TypeScript · WeChat Mini-Program · HBuilderX / Vue CLI · ESLint + Prettier

## Quick Start

1. Install [HBuilderX](https://www.dcloud.io/hbuilderx.html)
2. Import the `school-circle-mini` directory
3. Set your WeChat Mini-Program AppID in `manifest.json`
4. Update server endpoints in `common/config.ts`
5. Run to WeChat Mini-Program

```bash
npm install
npm run lint
npm run typecheck
```

## Viewing the H5 Demo on a PC

The H5 pages are designed for mobile viewports, so they will look stretched and broken in a desktop browser. Use the browser's **device emulation / responsive mode** to view them as on a phone:

- **Chrome / Edge:** press `F12` → (optional) adjust the DevTools dock position via the **⋮ menu → Dock side** (dock right / dock bottom / undock into a separate window; shortcut `Ctrl+Shift+D`, `Cmd+Shift+D` on Mac) → click the device toolbar icon (or `Ctrl+Shift+M`; `Cmd+Shift+M` on Mac) → pick a phone model (e.g. iPhone 12/13) or set the width to `375px` → refresh the page.
- **360 Secure / 360 Speed Browser:** switch to **Speed mode** (Chromium engine) via the address bar toggle first — device emulation is unavailable in compatibility mode → press `F12` → click the device toolbar icon, or press `Ctrl+Shift+M` → pick a phone model or set the width to `375px` → refresh.
- **Safari:** Safari → Settings → Advanced → enable "Show Develop menu in menu bar", then Develop → Enter Responsive Design Mode (`Option+Cmd+R`) → pick a device → refresh.

## Related Repos

- Frontend (this repo): [school-circle-mini](https://github.com/xiaotuantuankeji/school-circle-mini)
- Backend: [school-circle-server](https://github.com/xiaotuantuankeji/school-circle-server)

## License

Licensed under the [Apache License 2.0](LICENSE).

Copyright &copy; 2026 Nanjing Xiaotuantuan Technology Co., Ltd.
