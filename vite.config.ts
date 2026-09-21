import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    // mode === 'ghpages'  → сборка для GitHub Pages (абсолютный base)
    // всё остальное       → относительный base (Live Server, preview, Vercel, Netlify)
    base: mode === 'ghpages'
        ? '/portfolio/'
        : './',
}))