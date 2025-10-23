// vite.config.ts
import { defineConfig } from "file:///C:/Users/johnn/Documents/voice-chat-assistant/frontend/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/johnn/Documents/voice-chat-assistant/frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\johnn\\Documents\\voice-chat-assistant\\frontend";
var projectRoot = path.resolve(__vite_injected_original_dirname, "..");
var promptsDir = path.resolve(projectRoot, "prompts");
var vite_config_default = defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          // base: '/src', // Default behavior is usually fine. Re-evaluate if needed.
        }
        // compilerOptions for Transition/TransitionGroup usually not needed in Vue 3.
        // compilerOptions: {
        //   isCustomElement: tag => tag === 'TransitionGroup' || tag === 'transition'
        // }
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "functions-js": path.resolve(__vite_injected_original_dirname, "./node_modules/@supabase/functions-js")
      // Optional: Alias for prompts if deep relative paths become cumbersome
      // '#prompts': path.resolve(__dirname, '../prompts') // Assumes prompts is sibling to frontend
    }
  },
  server: {
    port: 3e3,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        // Your backend API
        changeOrigin: true
      }
    },
    /**
     * @property fs.allow
     * @description Configure file system access for the Vite dev server.
     * Allows serving files from specified directories.
     * Crucial if dynamically importing files (like prompts) from outside the frontend root (e.g., project root).
     */
    fs: {
      allow: [
        // Allow serving files from the project root (where vite.config.js is, usually 'frontend')
        ".",
        // Allow serving files from the parent directory (which should be the main project root)
        // This is necessary for import.meta.glob('../../../../prompts/*.md') to work from within src/views
        promptsDir
      ]
    }
  },
  /**
   * @property optimizeDeps
   * @description Dependency pre-bundling options.
   */
  optimizeDeps: {
    exclude: [
      "natural"
      // Exclude 'natural' due to its conditional "cloudflare:sockets" import
      // which causes issues during Vite's pre-bundling.
      // Add other problematic CJS dependencies here if they arise
    ]
    // include: ['string-similarity', 'stemmer'] // Optional: force pre-bundling of these if needed,
    // but usually not necessary for ESM-friendly libs.
  },
  build: {
    // Optional: If 'natural' or other CJS deps still cause issues in production build,
    // you might need to configure rollupOptions for commonjs plugin.
    // rollupOptions: {
    //   plugins: [
    //     // import commonjs from '@rollup/plugin-commonjs'; // npm i -D @rollup/plugin-commonjs
    //     // commonjs(),
    //   ],
    // },
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxqb2hublxcXFxEb2N1bWVudHNcXFxcdm9pY2UtY2hhdC1hc3Npc3RhbnRcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGpvaG5uXFxcXERvY3VtZW50c1xcXFx2b2ljZS1jaGF0LWFzc2lzdGFudFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvam9obm4vRG9jdW1lbnRzL3ZvaWNlLWNoYXQtYXNzaXN0YW50L2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7Ly8gRmlsZTogZnJvbnRlbmQvdml0ZS5jb25maWcudHNcclxuLyoqXHJcbiAqIEBmaWxlIHZpdGUuY29uZmlnLnRzXHJcbiAqIEBkZXNjcmlwdGlvbiBWaXRlIGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBmcm9udGVuZCBhcHBsaWNhdGlvbi5cclxuICogQHZlcnNpb24gMS4xLjFcclxuICpcclxuICogQG5vdGVzXHJcbiAqIC0gdjEuMS4xOiBBZGRlZCBzZXJ2ZXIuZnMuYWxsb3cgdG8gZW5zdXJlIFZpdGUgZGV2IHNlcnZlciBjYW4gYWNjZXNzIC4uL3Byb21wdHMuXHJcbiAqIC0gdjEuMS4wOiBBZGRlZCAnbmF0dXJhbCcgdG8gb3B0aW1pemVEZXBzLmV4Y2x1ZGUuXHJcbiAqL1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuXHJcbmNvbnN0IHByb2plY3RSb290ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJylcclxuY29uc3QgcHJvbXB0c0RpciA9IHBhdGgucmVzb2x2ZShwcm9qZWN0Um9vdCwgJ3Byb21wdHMnKVxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoe1xyXG4gICAgICB0ZW1wbGF0ZToge1xyXG4gICAgICAgIHRyYW5zZm9ybUFzc2V0VXJsczoge1xyXG4gICAgICAgICAgLy8gYmFzZTogJy9zcmMnLCAvLyBEZWZhdWx0IGJlaGF2aW9yIGlzIHVzdWFsbHkgZmluZS4gUmUtZXZhbHVhdGUgaWYgbmVlZGVkLlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gY29tcGlsZXJPcHRpb25zIGZvciBUcmFuc2l0aW9uL1RyYW5zaXRpb25Hcm91cCB1c3VhbGx5IG5vdCBuZWVkZWQgaW4gVnVlIDMuXHJcbiAgICAgICAgLy8gY29tcGlsZXJPcHRpb25zOiB7XHJcbiAgICAgICAgLy8gICBpc0N1c3RvbUVsZW1lbnQ6IHRhZyA9PiB0YWcgPT09ICdUcmFuc2l0aW9uR3JvdXAnIHx8IHRhZyA9PT0gJ3RyYW5zaXRpb24nXHJcbiAgICAgICAgLy8gfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgICAgJ2Z1bmN0aW9ucy1qcyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL25vZGVfbW9kdWxlcy9Ac3VwYWJhc2UvZnVuY3Rpb25zLWpzJyksXG4gICAgICAvLyBPcHRpb25hbDogQWxpYXMgZm9yIHByb21wdHMgaWYgZGVlcCByZWxhdGl2ZSBwYXRocyBiZWNvbWUgY3VtYmVyc29tZVxuICAgICAgLy8gJyNwcm9tcHRzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL3Byb21wdHMnKSAvLyBBc3N1bWVzIHByb21wdHMgaXMgc2libGluZyB0byBmcm9udGVuZFxuICAgIH0sXG4gIH0sXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMScsIC8vIFlvdXIgYmFja2VuZCBBUElcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAcHJvcGVydHkgZnMuYWxsb3dcclxuICAgICAqIEBkZXNjcmlwdGlvbiBDb25maWd1cmUgZmlsZSBzeXN0ZW0gYWNjZXNzIGZvciB0aGUgVml0ZSBkZXYgc2VydmVyLlxyXG4gICAgICogQWxsb3dzIHNlcnZpbmcgZmlsZXMgZnJvbSBzcGVjaWZpZWQgZGlyZWN0b3JpZXMuXHJcbiAgICAgKiBDcnVjaWFsIGlmIGR5bmFtaWNhbGx5IGltcG9ydGluZyBmaWxlcyAobGlrZSBwcm9tcHRzKSBmcm9tIG91dHNpZGUgdGhlIGZyb250ZW5kIHJvb3QgKGUuZy4sIHByb2plY3Qgcm9vdCkuXHJcbiAgICAgKi9cclxuICAgIGZzOiB7XHJcbiAgICAgIGFsbG93OiBbXHJcbiAgICAgICAgLy8gQWxsb3cgc2VydmluZyBmaWxlcyBmcm9tIHRoZSBwcm9qZWN0IHJvb3QgKHdoZXJlIHZpdGUuY29uZmlnLmpzIGlzLCB1c3VhbGx5ICdmcm9udGVuZCcpXHJcbiAgICAgICAgJy4nLFxyXG4gICAgICAgIC8vIEFsbG93IHNlcnZpbmcgZmlsZXMgZnJvbSB0aGUgcGFyZW50IGRpcmVjdG9yeSAod2hpY2ggc2hvdWxkIGJlIHRoZSBtYWluIHByb2plY3Qgcm9vdClcclxuICAgICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBmb3IgaW1wb3J0Lm1ldGEuZ2xvYignLi4vLi4vLi4vLi4vcHJvbXB0cy8qLm1kJykgdG8gd29yayBmcm9tIHdpdGhpbiBzcmMvdmlld3NcclxuICAgICAgICBwcm9tcHRzRGlyLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSBvcHRpbWl6ZURlcHNcclxuICAgKiBAZGVzY3JpcHRpb24gRGVwZW5kZW5jeSBwcmUtYnVuZGxpbmcgb3B0aW9ucy5cclxuICAgKi9cclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGV4Y2x1ZGU6IFtcclxuICAgICAgJ25hdHVyYWwnLCAvLyBFeGNsdWRlICduYXR1cmFsJyBkdWUgdG8gaXRzIGNvbmRpdGlvbmFsIFwiY2xvdWRmbGFyZTpzb2NrZXRzXCIgaW1wb3J0XHJcbiAgICAgICAgICAgICAgICAgICAvLyB3aGljaCBjYXVzZXMgaXNzdWVzIGR1cmluZyBWaXRlJ3MgcHJlLWJ1bmRsaW5nLlxyXG4gICAgICAvLyBBZGQgb3RoZXIgcHJvYmxlbWF0aWMgQ0pTIGRlcGVuZGVuY2llcyBoZXJlIGlmIHRoZXkgYXJpc2VcclxuICAgIF0sXHJcbiAgICAvLyBpbmNsdWRlOiBbJ3N0cmluZy1zaW1pbGFyaXR5JywgJ3N0ZW1tZXInXSAvLyBPcHRpb25hbDogZm9yY2UgcHJlLWJ1bmRsaW5nIG9mIHRoZXNlIGlmIG5lZWRlZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBidXQgdXN1YWxseSBub3QgbmVjZXNzYXJ5IGZvciBFU00tZnJpZW5kbHkgbGlicy5cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICAvLyBPcHRpb25hbDogSWYgJ25hdHVyYWwnIG9yIG90aGVyIENKUyBkZXBzIHN0aWxsIGNhdXNlIGlzc3VlcyBpbiBwcm9kdWN0aW9uIGJ1aWxkLFxyXG4gICAgLy8geW91IG1pZ2h0IG5lZWQgdG8gY29uZmlndXJlIHJvbGx1cE9wdGlvbnMgZm9yIGNvbW1vbmpzIHBsdWdpbi5cclxuICAgIC8vIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgIC8vICAgcGx1Z2luczogW1xyXG4gICAgLy8gICAgIC8vIGltcG9ydCBjb21tb25qcyBmcm9tICdAcm9sbHVwL3BsdWdpbi1jb21tb25qcyc7IC8vIG5wbSBpIC1EIEByb2xsdXAvcGx1Z2luLWNvbW1vbmpzXHJcbiAgICAvLyAgICAgLy8gY29tbW9uanMoKSxcclxuICAgIC8vICAgXSxcclxuICAgIC8vIH0sXHJcbiAgfVxyXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQVVBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFaakIsSUFBTSxtQ0FBbUM7QUFjekMsSUFBTSxjQUFjLEtBQUssUUFBUSxrQ0FBVyxJQUFJO0FBQ2hELElBQU0sYUFBYSxLQUFLLFFBQVEsYUFBYSxTQUFTO0FBR3RELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFVBQVU7QUFBQSxRQUNSLG9CQUFvQjtBQUFBO0FBQUEsUUFFcEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsZ0JBQWdCLEtBQUssUUFBUSxrQ0FBVyx1Q0FBdUM7QUFBQTtBQUFBO0FBQUEsSUFHakY7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNoQjtBQUFBLElBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU9BLElBQUk7QUFBQSxNQUNGLE9BQU87QUFBQTtBQUFBLFFBRUw7QUFBQTtBQUFBO0FBQUEsUUFHQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxjQUFjO0FBQUEsSUFDWixTQUFTO0FBQUEsTUFDUDtBQUFBO0FBQUE7QUFBQTtBQUFBLElBR0Y7QUFBQTtBQUFBO0FBQUEsRUFHRjtBQUFBLEVBQ0EsT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVNQO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
