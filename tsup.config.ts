import { defineConfig } from "tsup"

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    minify: true,
    shims: true,
    publicDir: "src/templates",
})
