import { defineConfig, type ViteDevServer } from 'vite'
import type { AddressInfo } from 'node:net'
import { buildSync } from 'esbuild';
import { build } from 'electron-builder';
import { join } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import vue from '@vitejs/plugin-vue'
import electron from 'electron';
import { copy } from 'fs-extra';
function devPlugin() {
  return {
    name: "dev-plugin",
    configureServer(server: ViteDevServer) {
      buildSync({
        entryPoints: ["./src/main/mainEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainEntry.js",
        external: ["electron", "better-sqlite3"],
      });

      buildSync({
        entryPoints: ["./src/preload/preload_main.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/preload_main.js",
        external: ["electron"],
      });
      const sourceDir = join(__dirname, 'public');
      const targetDir = join(__dirname, 'dist');

      copy(sourceDir, targetDir, {
        overwrite: true,
        errorOnExist: false,
        preserveTimestamps: true
      })

      server.httpServer?.once("listening", () => {
        const addressInfo = server.httpServer?.address() as AddressInfo
        let httpAddress = `http://localhost:${addressInfo?.port}`;
        const electronPath = (electron as any).path || (electron as unknown as string);
        let electronProcess = spawn(electronPath, ["./dist/mainEntry.js", httpAddress], {
          cwd: process.cwd(),
          stdio: "inherit",
        });
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};

function buildMain() {
  buildSync({
    entryPoints: ["./src/main/mainEntry.ts"],
    bundle: true,
    platform: "node",
    minify: true,
    outfile: "./dist/mainEntry.js",
    external: ["electron", "better-sqlite3"],
  });
  buildSync({
    entryPoints: ["./src/preload/preload_main.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    outfile: "./dist/preload_main.js",
    external: ["electron"],
  });
}

//为生产环境准备package.json
function preparePackageJson() {
  let pkgJsonPath = join(process.cwd(), "package.json");
  let localPkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf-8"));
  localPkgJson.main = "mainEntry.js";
  delete localPkgJson.scripts;
  let tarJsonPath = join(process.cwd(), "dist", "package.json");
  writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
  mkdirSync(join(process.cwd(), "dist", "node_modules"), { recursive: true });
}


//使用electron-builder制成安装包
function buildInstaller() {
  //因为electron版本原因已经不支持ia32版本了
  return build({
    config: {
      appId: "com.yourcompany.stickynotes",
      copyright: "Copyright © 2024 Your Company",
      productName: "StickyNotes",
      directories: {
        output: join(process.cwd(), "release"),
        app: join(process.cwd(), "dist")
      },
      npmRebuild: false,
      extends: null,
      asar: true,
      win: {
        icon: "build/icon.ico",
        target: [
          {
            target: "nsis",
            arch: ["x64"]
          }
        ],
      },
      nsis: {
        oneClick: false,
        perMachine: false,
        allowElevation: true,
        allowToChangeInstallationDirectory: true,
        installerIcon: "build/icon.ico",
        uninstallerIcon: "build/uninstall.ico",
        installerHeaderIcon: "build/header.ico",
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: "StickyNotes",
        deleteAppDataOnUninstall: true,
        uninstallDisplayName: "${productName}-Uninstaller",
        artifactName: "${productName}-${version}-setup.${ext}",
        runAfterFinish: true,
        multiLanguageInstaller: true,
        displayLanguageSelector: true,
        installerLanguages: ["zh-CN", "en-US"],
      }
    },

    projectDir: process.cwd(),
    win: ["nsis"],
    x64: true,
    publish: 'never', // 不自动发布
  });
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [devPlugin(), vue()],
  build: {
    rollupOptions: {
      plugins: [{
        name: 'build',
        closeBundle() {
          buildMain();
          preparePackageJson();
          // 自动调用 electron-builder 打包 Windows 安装包
          buildInstaller();
        }
      }],
    }
  },
  base: './',
  json: {
    stringify: true,
  }
})
