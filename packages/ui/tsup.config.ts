// import { defineConfig } from "tsup";
// import path from "path";

// export default defineConfig({
//   entry: ["src/index.ts"],
//   format: ["cjs", "esm"],
//   dts: true,
//   sourcemap: true,
//   clean: true,
//   esbuildOptions(options) {
//     // 👇 Fix alias resolution for build
//     options.alias = {
//       "@": path.resolve(__dirname, "src"),
//     };
//   },
// });
