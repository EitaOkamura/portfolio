import { defineConfig } from 'vitest/config'

// 本番ビルド用の vite.config.ts とは分ける。
// テストに要らないプラグインを読み込まないため。
export default defineConfig({
  test: {
    // 純粋関数のテストから始める。コンポーネントを足すときに jsdom へ変える。
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
