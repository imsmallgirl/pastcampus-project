import terser from "@rollup/plugin-terser";
import rollupConfig from "./rollup.config.js";
const config = { ...rollupConfig };

config.plugins = [...config.plugins, terser()];

export default config;
