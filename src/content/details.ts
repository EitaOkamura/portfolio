import type { DetailSection } from './types'

/** 作品ごとの詳細ページ。元サイトではモーダルと別 HTML に分かれていたものを、
 *  URL を持つページに揃えた（職務経歴書から個別に参照できるようにするため）。 */
export const detailPages: Record<
  string,
  { title: string; lead: string[]; sections: DetailSection[] }
> = {
  portfolio: {
    title: "eta's portfolio",
    lead: [
      'この Web サイトそのものです。転職活動のために作ったランディングページを、React + TypeScript で作り直しました。',
    ],
    sections: [
      {
        id: 'before',
        title: '作り直す前',
        blocks: [
          {
            heading: 'HTML / CSS / jQuery の 1 枚もの',
            body: [
              'HTML と CSS、JavaScript (jQuery) を使用し、1 枚のランディングページとして作成しました。プロフィール画面のアコーディオンや、作品画面でマウスカーソルの位置に応じてカードが傾く演出を入れ、レスポンシブ対応も行いました。',
              'サーバーは AWS を使用し、SSL 化するため CloudFront 経由で公開していました。',
            ],
            figures: [
              { src: '/images/etasportfolio/PCimage.webp', alt: '旧サイトの PC 表示' },
              { src: '/images/etasportfolio/smartPhone.webp', alt: '旧サイトのスマートフォン表示' },
            ],
          },
        ],
      },
      {
        id: 'after',
        title: '作り直した後',
        blocks: [
          {
            heading: 'React + TypeScript + Vite',
            body: [
              'jQuery による DOM 操作をやめ、React のコンポーネントに置き換えました。文言とスキル一覧は TypeScript の型付きデータとして `src/content/` に切り出し、コンポーネントは並べ方だけを持つようにしています。内容の追加でレイアウトが壊れないようにするためです。',
              'ルーティングを入れ、作品ごとに URL を持たせました。職務経歴書から個別のページを参照できます。',
              '表示に関わる計算（★の描画、年表の整形など）は純粋関数として切り出し、vitest でテストしています。',
            ],
          },
          {
            heading: '画像の最適化',
            body: [
              '旧サイトは画像が合計 47MB あり、最大のものは 6623×9362px / 12.6MB の設計課題パネルでした。sharp を使った変換スクリプトを用意し、用途ごとに上限幅を変えて WebP へ変換したところ、合計 4.4MB（90.6% 削減）になりました。',
            ],
          },
          {
            heading: 'AWS の構成を見直した',
            body: [
              '旧構成では S3 の静的ウェブサイトホスティングをパブリックに公開し、それを CloudFront のオリジンにしていました。この状態では S3 のエンドポイントに直接アクセスでき、CloudFront を迂回できてしまいます。迂回された分は CloudFront の無料枠で吸収されず S3 の課金対象になる上、S3 の website エンドポイントは HTTP 専用で HTTPS が使えません。',
              'CloudFront の Origin Access Control (OAC) に変更し、バケットを完全に非公開にしました。あわせて HTTP から HTTPS へのリダイレクトと、セキュリティヘッダの付与を行っています。構成は CloudFormation テンプレートとして `infra/` に置いてあります。',
            ],
            figures: [
              { src: '/images/etasportfolio/AWSArchitecture.webp', alt: 'AWS 構成図' },
            ],
          },
        ],
      },
    ],
  },

  'raspberry-pi': {
    title: 'Raspberry Pi 4',
    lead: [
      'Raspberry Pi 4 を使って、画像認識と電子工作を組み合わせたシステムを作りました。',
    ],
    sections: [
      {
        id: 'opencv',
        title: 'OpenCV',
        blocks: [
          {
            heading: '画像認識',
            body: [
              'Raspberry Pi に OpenCV をインストールするのにかなり手間取って諦めかけていましたが、何とか出来ました。カスケード分類器による顔認識等を行っています。また、MediaPipe を利用した手の動作検知を行いました。',
              '今後は YOLOv8 を利用した物体検知や、TensorFlow で AI モデルを作成したいと思っています。',
            ],
            figures: [
              { src: '/images/RaspberryPi/opencv1.webp', alt: 'OpenCV による顔認識' },
              { src: '/images/RaspberryPi/opencv2.webp', alt: 'OpenCV の実行画面' },
              { src: '/images/RaspberryPi/opencv_hand1.webp', alt: 'MediaPipe による手の動作検知' },
              { src: '/images/RaspberryPi/opencv_hand2.webp', alt: '手の動作検知の実行結果' },
            ],
          },
          {
            heading: '監視カメラ',
            body: [
              'OpenCV とカスケード分類器を利用して顔認識や動体検知を行い、認識したら写真を撮影して LINE に画像付きで送信されるシステムを作成しました。',
              'さらに監視カメラらしくするため、認識したら LED が点灯し、圧電スピーカーが鳴り、サーボモーターが回転して鍵を掛けるという機能を追加しました。',
            ],
            figures: [
              { src: '/images/RaspberryPi/raspi1.webp', alt: '監視カメラの構成' },
              { src: '/images/RaspberryPi/raspi2.webp', alt: '監視カメラの動作の様子' },
            ],
          },
        ],
      },
      {
        id: 'electronics',
        title: '電子工作',
        blocks: [
          {
            heading: '電子工作',
            body: [
              '監視カメラ用に LED 点灯や圧電スピーカーを鳴らすといった様々な機能を試しています。Raspberry Pi Pico も購入したので、こちらでも色々と試してみたいと思っています。',
            ],
            figures: [
              { src: '/images/RaspberryPi/raspi7.webp', alt: '電子工作の様子 1' },
              { src: '/images/RaspberryPi/raspi8.webp', alt: '電子工作の様子 2' },
              { src: '/images/RaspberryPi/raspi9.webp', alt: '電子工作の様子 3' },
            ],
          },
          {
            heading: 'ラジコン制御',
            body: [
              'WebIOPi を利用したブラウザからのモーター制御と、PS4 のコントローラーを接続しての制御をしました。手の動作検知はできたので、今後は動作ごとにモーターの制御をしてみたいと思います。',
            ],
            figures: [
              { src: '/images/RaspberryPi/raspi10.webp', alt: 'ラジコン制御 1' },
              { src: '/images/RaspberryPi/raspi11.webp', alt: 'ラジコン制御 2' },
            ],
          },
        ],
      },
    ],
  },

  training: {
    title: 'IoT システムエンジニア科',
    lead: [
      '職業訓練校で履修した内容です。電気理論・電子回路から、C 言語とマイコン制御、ネットワーク構築、Java まで扱いました。',
    ],
    sections: [
      {
        id: 'micon',
        title: 'マイコン制御',
        blocks: [
          {
            heading: 'RX63N',
            body: [
              'C 言語の基本文法、ポインタや構造体を学んだ後に、マイコンの制御を行います。LED 点灯、スイッチによる処理、LCD 表示、タイマカウント、例外処理、AD/DA 変換、シリアル通信等を行いました。',
            ],
            figures: [
              { src: '/images/poriteku/micon1.webp', alt: 'RX63N によるマイコン制御 1' },
              { src: '/images/poriteku/micon2.webp', alt: 'RX63N によるマイコン制御 2' },
            ],
          },
          {
            heading: 'ESP32',
            body: [
              'C++ をベースとした Arduino 言語を使用してマイコンの制御を行います。AT コマンドによるネットワーク操作や、Arduino IDE にて LED 点灯、シリアル通信、PWM 出力、Web サーバ利用、SPIFFS の利用、TCP 通信等を行いました。',
            ],
            figures: [
              { src: '/images/poriteku/micon4.webp', alt: 'ESP32 の制御 1' },
              { src: '/images/poriteku/micon5.webp', alt: 'ESP32 の制御 2' },
              { src: '/images/poriteku/micon7.webp', alt: 'ESP32 の制御 3' },
            ],
          },
        ],
      },
      {
        id: 'network',
        title: 'ネットワーク構築',
        blocks: [
          {
            heading: 'ネットワーク施工',
            body: [
              'ネットワークを取り扱う上で基本となる知識や、ネットワーク接続に必要な基本的な機器の接続・設定方法を習得します。業務用の設備（ルータ・ハブ）を CUI (TeraTerm) から設定し、VLAN や VPN の設定を行いました。実際に LAN ケーブルの製作から、教室の OA フロアのパネルを剥がして LAN ケーブルを通す作業まで行っています。',
            ],
            figures: [
              { src: '/images/poriteku/network1.webp', alt: 'ネットワーク機器の設定' },
              { src: '/images/poriteku/network2.webp', alt: 'ネットワーク構築の様子' },
              { src: '/images/poriteku/LAN1.webp', alt: 'LAN ケーブルの製作' },
            ],
          },
          {
            heading: '仮想化基盤の構築',
            body: [
              '仮想化専用 OS の VMware ESXi を使用し、仮想マシンを構築します。また、Windows 11 や Server をインストールし、動作を確認しました。CentOS にて Linux の基本操作の習得をしました。',
            ],
            figures: [
              { src: '/images/poriteku/network3.webp', alt: '仮想化基盤の構築 1' },
              { src: '/images/poriteku/network4.webp', alt: '仮想化基盤の構築 2' },
            ],
          },
        ],
      },
      {
        id: 'circuit',
        title: '電子回路',
        blocks: [
          {
            heading: '電気理論',
            body: [
              '電流、電圧、抵抗の初歩から実際に電子回路を組み、テスタで確認しながら電気理論を学習しました。',
            ],
            figures: [
              { src: '/images/poriteku/sokutei7.webp', alt: '電気理論の実習 1' },
              { src: '/images/poriteku/sokutei8.webp', alt: '電気理論の実習 2' },
            ],
          },
          {
            heading: 'アナログ回路',
            body: [
              'ダイオード・トランジスタ・オペアンプ等を活用して様々な構成の電子回路を実際に組みました。ファンクションジェネレーターで生成した波形を回路に通し、オシロスコープで確認する作業も行いました。',
            ],
            figures: [
              { src: '/images/poriteku/sokutei9.webp', alt: 'アナログ回路の実習 1' },
              { src: '/images/poriteku/sokutei11.webp', alt: 'アナログ回路の実習 2' },
              { src: '/images/poriteku/sokutei17.webp', alt: 'アナログ回路の実習 3' },
            ],
          },
          {
            heading: '電子機器組み立て',
            body: ['RX63N に使用する入出力基板を実際にはんだ付けして作成しました。'],
            figures: [{ src: '/images/poriteku/handa1.webp', alt: 'はんだ付けの様子' }],
          },
        ],
      },
    ],
  },

  architecture: {
    title: 'Architecture',
    lead: [
      '実際に業務で行ったプロジェクト名はここでは控えさせていただきます。プロジェクトの用途や規模感を記載します。',
    ],
    sections: [
      {
        id: 'construction',
        title: '建築施工管理',
        blocks: [
          {
            heading: '老人ホーム',
            body: [
              'RC 造 4 階建ての老人ホームで、延床面積が 5,000 ㎡ 程の建物でした。監督として初めての現場です。',
            ],
          },
          {
            heading: '工場（食品）',
            body: [
              'S 造 2 階建ての食品系の工場で、延床面積が 3,500 ㎡ 程、敷地面積がかなり広い現場でした。海に近く、基礎工事でかなり苦戦した記憶があります。',
            ],
          },
          {
            heading: 'ホームセンター',
            body: ['S 造 2 階建てのホームセンターで、建築面積は 7,000 ㎡ 程だったかと思います。'],
          },
          {
            heading: '駅ビル',
            body: [
              '某新幹線が止まる駅の中にある商業施設の改修を JV 形式で行いました。駅側とのやり取りや特殊な書類があり、かなり勉強になりました。',
            ],
          },
          {
            heading: 'その他',
            body: ['その他も小規模になりますが、複数物件を掛け持ちで行っていました。'],
          },
        ],
      },
      {
        id: 'structural',
        title: '建築構造設計',
        blocks: [
          {
            heading: '駅舎',
            body: [
              '主に都内の駅舎を担当していました。複数人で計算・解析を行い、図面作成の業務も行いました。構造設計者として初めての物件もかなり大規模な物件で、その構造計算や図面作成を担当することができ、かなり成長できました。遠いところですと北海道の駅舎も担当させていただきました。',
            ],
          },
          {
            heading: '超高層（130m）',
            body: [
              'オフィスや商業施設、劇場が入った超高層建物の構造計画を担当しました。メインの時刻歴応答解析はまだスキルが無く、上司にお願いしました。部材設計や図面作成などを主に行い、一部、解析ソフトの設定上、計算の出力結果が実状と異なる箇所を補正するための計算ツールを Python でコーディングし、解析ソフトの CSV 出力結果を補正するプログラムを組みました。',
              '3 人体制で行い、大学で講師をしている上司 2 人と一緒に業務を行えて、自分の成長を実感すると共に、至らない点が多々あることを実感しました。',
            ],
          },
          {
            heading: '官庁物件',
            body: [
              '詳しい施設名はここでは控えますが、官庁物件もいくつか担当いたしました。業務内容的に計算量がかなり多く、計算書だけでかなりの量になります。また、法的な処理も難しく、古い施設だと組積造などもあり業務幅がかなり広がりました。',
            ],
          },
          {
            heading: '耐震診断',
            body: [
              'しっかり担当したのは RC 造の 1 物件のみで、お手伝いが少しあるくらいです。正直かなり自信のないところです。',
            ],
          },
          {
            heading: 'その他',
            body: [
              '小規模プロジェクトを複数持って、上司の確認を受けつつ一通りの構造計算を行うことが出来たので、大規模物件の一部分を計算するのとは違った成長が出来ました。また、特殊建築物の施工検討や仮設物の検討等、新築改修とは違った物件も担当させていただきました。',
            ],
          },
        ],
      },
      {
        id: 'university',
        title: '大学の設計課題',
        blocks: [
          {
            heading: '設計課題',
            body: [
              '文字だけだとあれなので、大学の設計課題で作成したもので残っているものを掲載します。このほかにも構造設計課題等も行いました。社会人になってからもいくつか作成したのですが、データが紛失したので見つかり次第掲載します。',
            ],
            figures: [
              { src: '/images/Architecture/Sophomore.webp', alt: '大学 2 年の設計課題' },
              { src: '/images/Architecture/Junior1.webp', alt: '大学 3 年の設計課題 その1' },
              { src: '/images/Architecture/Junior2.webp', alt: '大学 3 年の設計課題 その2' },
            ],
          },
        ],
      },
    ],
  },
}
