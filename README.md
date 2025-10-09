# 🚀 ChatWebsite

A modern, full-stack **chat application** built with a Turborepo monorepo using **Next.js**, **TypeScript**, **Tailwind CSS**, and shared UI components.

---

## 🌟 Key Features

* 🔁 Real-time chat experience (1:1 and group-ready)
* 🧩 Monorepo architecture (Turborepo) for scalable development
* 🛠️ Shared `ui` component library across apps
* ⚡ TypeScript-first codebase for type safety
* 🎨 Tailwind CSS for utility-first styling

---

## 📂 Quick Project Structure

```
/
├── apps/
│   ├── web/                   # Main Next.js web application
│     
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── config/                # Shared configs (eslint, tsconfig, etc.)
│   ├── utils/                 # Shared utilities
│   └── db/                    # Database layer and ORM setup
├── websocket_server/           # WebSocket backend for real-time communication
├── turbo.json
├── package.json
└── README.md
```

---

## 🧰 Prerequisites

* Node.js (v20 or newer recommended)
* Pnpm

---

## ⚡ Getting Started (Local)

1. **Clone the repo**

```bash
git clone https://github.com/preetarora3004/ChatWebsite.git
cd ChatWebsite
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Run the app**

```bash
pnpm run dev
```

Open your browser at `http://localhost:3000` (or follow the terminal output).

---

## 🛠️ Scripts (Common)

* `pnpm run dev` — start development servers
* `pnpm run build` — build all apps
* `pnpm run start` — run production server

*(Adjust scripts as needed in root/package.json)*

---

## 🔧 Configuration

Create a `.env.local` in the `apps/web` folder (or at repo root depending on setup) with variables such as:

```
NEXT_PUBLIC_API_URL=https://api.example.com
SOCKET_URL=ws://localhost:8080
# Add other secrets or keys as required
```

> ⚠️ Never commit secrets to the repository.

---

## 🎨 Styling & UI

* Tailwind CSS is used for styling. Check `tailwind.config.js` for custom themes.
* Shared components live in `packages/ui` — import them into apps using the monorepo package imports.

---

## 🔗 Transpiling / Next.js Notes

If Next.js needs to transpile the `ui` package (or other packages), ensure `next.config.js` includes the package in `transpilePackages` or use the `@turbo/next` setup pattern. This keeps local packages working smoothly in dev and production.

---

## ✅ Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository ✂️
2. Create a feature branch: `git checkout -b feat/your-feature` 🌿
3. Make changes and commit with clear messages 📝
4. Open a Pull Request and describe the change 💬

---

## 🙏 Acknowledgements

Built with ❤️ using Next.js, Tailwind CSS, and a Turborepo monorepo pattern.

