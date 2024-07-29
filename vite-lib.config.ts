import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv } from "vite";
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import dts from "vite-plugin-dts";

export default defineConfig(async (params: ConfigEnv) => {
  const { command, mode } = params;
  const ENV = loadEnv(mode, process.cwd());
  console.log("node version", process.version);
  console.info(
    `running mode: ${mode}, command: ${command}, ENV: ${JSON.stringify(ENV)}`
  );
  return {
    plugins: [
      libInjectCss(),
      dts({ rollupTypes: true })
    ],
    define: {
      '__DEV__': mode === 'development', // 自定义开发模式标识
      '__PROD__': mode === 'production', // 自定义生产模式标识
    },
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    base: "./",
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "dialog",
        fileName: (format: string) => `dialog.${format}.js`,
        formats: ["es", "umd"] as any,
      },
      emptyOutDir: true,
      sourcemap: mode === "development",
      minify: mode !== "development",
      rollupOptions: {
        external: [],
        output: {
          globals: {
          }
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          // additionalData: `$injectedColor: orange;`
          additionalData: `@import "dyn-components/theme.scss";@import "@/assets/styles/globalInjectedScss/index.scss";`
        }
        // less: {
        //   modifyVars: {
        //     '@primary-color': '#1990EB',
        //     hack: `true; @import "@import "@/assets/stylesheets/globalInjectedLess/index.less";`
        //   },
        //   javascriptEnabled: true,
        // }
      }
      // postcss: {}
    },
  }
});
