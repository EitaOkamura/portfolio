/**
 * infra/ の CloudFormation テンプレートを機械的に確認する。
 *
 * ここで見るのは「YAML として読めるか」と「最低限の構造があるか」まで。
 * CloudFormation として正しいかは AWS 側でしか判定できないので、
 * 適用前に必ず `aws cloudformation validate-template` を通すこと。
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { parse } from 'yaml'

const INFRA = new URL('../infra/', import.meta.url).pathname

/** CloudFormation の短縮形 (!Ref, !Sub, !GetAtt ...) を素通しさせる。
 *  スカラ・配列・マップのどの形でも書けるので、3通りとも登録する。 */
const CFN_FUNCTIONS = [
  'Ref', 'Sub', 'GetAtt', 'If', 'Equals', 'Join', 'Select', 'Split',
  'Not', 'And', 'Or', 'ImportValue', 'FindInMap', 'Base64', 'Cidr', 'Condition',
]

const cfnTags = CFN_FUNCTIONS.flatMap((tag) => [
  { tag: `!${tag}`, resolve: (value) => ({ [`Fn::${tag}`]: value }) },
  { tag: `!${tag}`, collection: 'seq', resolve: (seq) => ({ [`Fn::${tag}`]: seq.toJSON() }) },
  { tag: `!${tag}`, collection: 'map', resolve: (map) => ({ [`Fn::${tag}`]: map.toJSON() }) },
])

let failed = 0

for (const file of readdirSync(INFRA).filter((f) => f.endsWith('.yaml'))) {
  const path = join(INFRA, file)
  try {
    const doc = parse(readFileSync(path, 'utf8'), { customTags: cfnTags })

    if (doc.AWSTemplateFormatVersion !== '2010-09-09') {
      throw new Error('AWSTemplateFormatVersion が 2010-09-09 ではない')
    }
    const resources = Object.keys(doc.Resources ?? {})
    if (resources.length === 0) throw new Error('Resources が空')

    for (const [name, res] of Object.entries(doc.Resources)) {
      if (typeof res?.Type !== 'string') throw new Error(`${name} に Type が無い`)
    }

    // インラインの Lambda コードは make check では検査されないので、ここで見る。
    // 構文エラーをデプロイ後の実行時まで持ち越さないため。
    for (const [name, res] of Object.entries(doc.Resources)) {
      const code = res?.Properties?.Code?.ZipFile
      if (typeof code !== 'string') continue
      if (code.length > 4096) {
        throw new Error(`${name} のインラインコードが ${code.length} 文字。上限は 4096`)
      }
      // インラインの ZipFile は Lambda 側で index.js として保存されるため
      // CommonJS として評価される。import / export を書くと実行時に
      // 「Cannot use import statement outside a module」で落ちる。
      //
      // node --check だけでは捕まらない。最近の Node は .js でも
      // ESM を自動判定して通してしまうため、構文を直接見る。
      const esm = code.match(/^\s*(import\s|export\s|export\{|import\()/m)
      if (esm) {
        throw new Error(
          `${name} のインラインコードが ESM 構文を使っている (${esm[0].trim()})。` +
            'インラインの ZipFile は index.js として保存され CommonJS として' +
            '評価されるため、require / exports で書くこと',
        )
      }

      const tmp = join(tmpdir(), `cfn-inline-${process.pid}-${name}.js`)
      try {
        writeFileSync(tmp, code)
        execFileSync(process.execPath, ['--check', tmp], { stdio: 'pipe' })
      } catch (err) {
        const detail = err.stderr?.toString().trim().split('\n').slice(0, 3).join(' / ') ?? err.message
        throw new Error(`${name} のインラインコードに構文エラー: ${detail}`)
      } finally {
        try {
          unlinkSync(tmp)
        } catch {
          /* 消せなくても検査結果は変わらない */
        }
      }
      console.log(`     ↳ ${name} のインラインコード ${code.length} 文字 (上限 4096)`)
    }

    console.log(`  ✅ ${file}  リソース ${resources.length} 個: ${resources.join(', ')}`)
  } catch (err) {
    failed += 1
    console.error(`  ❌ ${file}: ${err.message}`)
  }
}

if (failed > 0) {
  console.error(`\n${failed} 件のテンプレートに問題があります`)
  process.exit(1)
}
console.log('\ninfra/ の構文チェックを通過しました（CloudFormation としての妥当性は AWS 側で確認すること）')
