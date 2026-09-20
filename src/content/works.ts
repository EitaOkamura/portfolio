import type { Work } from './types'

export const works: Work[] = [
  {
    id: 'portfolio',
    index: '01',
    title: "eta's portfolio",
    summary:
      'この Web サイトです。当初は HTML / CSS / JavaScript (jQuery) の 1 枚もののランディングページでしたが、React + TypeScript + Vite で作り直しました。',
    detailPath: '/works/portfolio',
    stack: ['React', 'TypeScript', 'Vite', 'AWS (S3 / CloudFront / Route 53)', 'GitHub Actions'],
  },
  {
    id: 'ga',
    index: '02',
    title: 'G.A. (Genetic Algorithm)',
    summary:
      '大学時代の研究内容です。遺伝的アルゴリズムを使用し、平坦折り紙の最適化を行いました。使用言語は Python です。',
    note: 'どこまで掲載可能か分からないため、ご興味がある際は面接時等で予稿集等の資料をお見せいたします。',
    stack: ['Python', 'NumPy'],
  },
  {
    id: 'architecture',
    index: '03',
    title: '建築（構造設計 & 施工管理）',
    summary:
      'これまでの構造設計、建築施工管理で携わったプロジェクトや業務内容をまとめました。構造設計では Python で簡単な計算ツール等を作成しました。',
    detailPath: '/works/architecture',
    stack: ['SS7', 'midas', 'AutoCAD', 'Python'],
  },
  {
    id: 'training',
    index: '04',
    title: '職業訓練校',
    summary:
      '職業訓練校（IoT システムエンジニア科）で履修した内容を紹介します。C 言語基礎、マイコン制御、ネットワーク、電子回路など。',
    detailPath: '/works/training',
    stack: ['C', 'Java', 'RX63N', 'ESP32', 'VMware ESXi'],
  },
  {
    id: 'raspberry-pi',
    index: '05',
    title: 'Raspberry Pi',
    summary:
      'Raspberry Pi 4 で開発したシステムを紹介します。OpenCV 等を利用した監視カメラシステムなど。',
    detailPath: '/works/raspberry-pi',
    stack: ['Python', 'OpenCV', 'MediaPipe', 'Raspberry Pi 4'],
  },
]
