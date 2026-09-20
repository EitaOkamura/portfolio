import type { SkillDomain } from './types'

/** 評価軸は分野ごとに意味が違う。IT は「何を作ったか」、建築は「業務で使ったか」で測る。 */
export const skillDomains: SkillDomain[] = [
  {
    id: 'it',
    title: 'IT',
    lead: '未経験での転職のため、研究や個人開発、個人学習した技術についてまとめました。各技術に対してスキルレベルを5段階で表しています。',
    scale: [
      '基本的な文法や特性を理解している。',
      '参考書等のサンプルコードを一通りコーディングして少しアレンジを加えている。',
      'コードを組み合わせたり、自作でプログラムを作成した。基本的な機能を利用できる。',
      'アプリケーションやサイト等、何か成果を上げている状態。',
      '実際に開発を行った中で特に問題解決に直結した。',
    ],
    groups: [
      {
        id: 'languages',
        title: 'よく使用する言語',
        description:
          '大学時代の研究や、ポートフォリオの作成、学習時に簡単なアプリを作成する際に使用しました。基本的なことは一通り出来ます。Python は構造設計の業務や研究で使用していました。',
        skills: [
          { name: 'Python', rating: 5 },
          { name: 'HTML', rating: 4 },
          { name: 'CSS', rating: 4 },
          { name: 'JavaScript', rating: 4 },
          { name: 'Java', rating: 4 },
          { name: 'C', rating: 3 },
          { name: 'C++', rating: 2 },
          { name: 'C#', rating: 2 },
        ],
      },
      {
        id: 'tech',
        title: '使用した技術',
        description: 'これまで使用したライブラリや、マイコン機器等。',
        skills: [
          { name: 'NumPy', rating: 4 },
          { name: 'pandas', rating: 4 },
          { name: 'OpenCV', rating: 3 },
          { name: 'Unity', rating: 2 },
          { name: 'jQuery', rating: 4 },
          { name: 'RX63N (CS+)', rating: 4 },
          { name: 'Raspberry Pi', rating: 4 },
          { name: 'ESP32 (Arduino IDE)', rating: 3 },
          { name: 'Android Studio', rating: 3 },
          { name: 'AWS', rating: 3 },
        ],
      },
    ],
    learning: {
      title: '学習中',
      description:
        '現在、学習中の技術です。AWS はポートフォリオサイトで S3 と Route 53、CloudFront 等を使用しました。',
      items: ['SQL', 'Git', 'Next.js', 'Docker', 'React', 'TypeScript', 'Linux', 'VMware (ESXi)'],
    },
  },
  {
    id: 'architecture',
    title: 'Architecture',
    lead: 'これまでの業務、大学の設計課題等で使用した解析・計算ソフトや CAD、BIM 等の技術についてまとめました。各技術に対してスキルレベルを5段階で表しています。',
    scale: [
      '基本的な操作や特性を学習中である状態。',
      '基本的な操作や特性を理解している。',
      'プライベートや大学で成果物作成のため使用した。',
      '実際の業務で使用した。',
      '実際の業務で長期間使用した。',
    ],
    groups: [
      {
        id: 'structural',
        title: '構造計算・解析',
        description: '業務で実際に使用していたソフトウェアです。',
        skills: [
          { name: 'SS7', rating: 5 },
          { name: 'midas', rating: 4 },
          { name: 'SS3', rating: 4 },
          { name: 'MC1', rating: 5 },
          { name: 'FC1', rating: 4 },
          { name: 'RC診断', rating: 4 },
          { name: 'RC2次部材', rating: 5 },
          { name: '3D・DynamicPRO', rating: 3 },
          { name: 'Solidbase2008', rating: 4 },
          { name: 'ViewWave', rating: 3 },
        ],
      },
      {
        id: 'cad',
        title: 'CAD・BIM・設計関連ソフト',
        description:
          '業務で実際に使用していたソフトウェアや、学生課題やプライベートで使用していました。',
        skills: [
          { name: 'AutoCAD', rating: 5 },
          { name: 'Rhinoceros', rating: 3 },
          { name: 'Grasshopper', rating: 2 },
          { name: 'Twinmotion', rating: 3 },
          { name: 'ArchiCAD', rating: 3 },
          { name: 'Revit', rating: 2 },
          { name: 'JW_CAD', rating: 5 },
          { name: 'SketchUp', rating: 2 },
        ],
      },
    ],
  },
  {
    id: 'others',
    title: 'Others',
    lead: 'その他の使用ソフトウェアについてまとめました。',
    scale: [
      '基本的な操作や特性を学習中である状態。',
      '基本的な操作や特性を理解している。',
      'プライベートや大学で成果物作成のため使用した。',
      '実際の業務で使用した。',
      '実際の業務で長期間使用した。',
    ],
    groups: [
      {
        id: 'software',
        title: 'その他のソフトウェア',
        description:
          '業務で実際に使用していたソフトウェアや、業務外で、趣味として触っていたソフトウェアです。',
        skills: [
          { name: 'Excel', rating: 5 },
          { name: 'Word', rating: 5 },
          { name: 'PowerPoint', rating: 4 },
          { name: 'DocuWorks', rating: 5 },
          { name: 'Blender', rating: 3 },
          { name: 'Affinity Photo', rating: 2 },
          { name: 'Filmora X', rating: 3 },
          { name: 'Photoshop', rating: 3 },
          { name: 'Illustrator', rating: 3 },
          { name: 'CLIP STUDIO', rating: 3 },
        ],
      },
    ],
  },
]
