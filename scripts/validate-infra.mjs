/**
 * infra/ の CloudFormation テンプレートを機械的に確認する。
 *
 * ここで見るのは「YAML として読めるか」と「最低限の構造があるか」まで。
 * CloudFormation として正しいかは AWS 側でしか判定できないので、
 * 適用前に必ず `aws cloudformation validate-template` を通すこと。
 */
import { readFileSync, readdirSync } from 'node:fs'
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
