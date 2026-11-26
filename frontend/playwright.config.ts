import { defineConfig } from '@playwright/test'
import { randomUUID, randomBytes } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const apiPort = Number(process.env.E2E_API_PORT || 4398)
const webPort = Number(process.env.E2E_WEB_PORT || 4397)
export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 180000,
  expect: { timeout: 15000 },
  use: {
    baseURL: `http://127.0.0.1:${webPort}`,
    viewport: { width: 1280, height: 800 },
  },
  webServer: [
    {
      command:
        'pnpm exec prisma migrate deploy && pnpm build && node dist/main.js',
      cwd: '../backend',
      port: apiPort,
      timeout: 300000,
      stdout: 'pipe',
      env: {
        DATABASE_URL:
          'file:' + join(tmpdir(), 'financy-' + randomUUID() + '.db'),
        JWT_SECRET: randomBytes(32).toString('hex'),
        PORT: String(apiPort),
      },
    },
    {
      command: `pnpm exec tsc --noEmit && pnpm exec vite build --outDir node_modules/.cache/financy-e2e && pnpm exec vite preview --outDir node_modules/.cache/financy-e2e --host 127.0.0.1 --port ${webPort} --strictPort`,
      port: webPort,
      timeout: 300000,
      stdout: 'pipe',
      env: { VITE_BACKEND_URL: `http://127.0.0.1:${apiPort}/graphql` },
    },
  ],
})
