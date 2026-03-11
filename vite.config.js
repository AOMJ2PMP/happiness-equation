import { readFileSync } from "fs";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { timeFormat } from "d3";
import path from "path";
import svg from "vite-plugin-svgstring";
import dsv from "@rollup/plugin-dsv";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const timestamp = timeFormat("%Y-%m-%d-%H:%M")(new Date());

export default defineConfig({
	define: {
		__VERSION__: JSON.stringify(version),
		__TIMESTAMP__: JSON.stringify(timestamp)
	},
	plugins: [sveltekit(), dsv(), svg()],
	resolve: {
		alias: {
			$components: path.resolve("./src/components"),
			$data: path.resolve("./src/data"),
			$routes: path.resolve("./src/routes"),
			$styles: path.resolve("./src/styles"),
			$assets: path.resolve("./static/assets"),
		}
	}
});
