import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
    port: 5173,      // Aapka fixed port
    strictPort: true, // Agar 5173 busy hai, toh ye automatically 5174 pe nahi jayega
    cors: true        // Frontend level pe CORS configuration enable karne ke liye
  }
})