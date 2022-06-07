import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import  styleImport, {AndDesignVueResolve} from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    styleImport({
      resolves : [AndDesignVueResolve()]
    })
  ]
})
