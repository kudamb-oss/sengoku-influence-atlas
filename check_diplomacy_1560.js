// 1560年外交・従属関係レイヤーの参照整合性・スキーマ検証スクリプト
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dataDir = path.join(root, 'data');
const diplomacyDir = path.join(dataDir, 'diplomacy');

function parseCsv(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label}: ファイルが存在しません: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (quoted) {
      if (c === '"' && raw[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && raw[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some(val => val !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (quoted) throw new Error(`${label}: 引用符が閉じていません`);
  if (row.length || field) { row.push(field); rows.push(row); }
  const header = rows.shift();
  if (!header || new Set(header).size !== header.length) {
    throw new Error(`${label}: ヘッダーが不正または列名が重複しています`);
  }
  return rows.map((values, index) => {
    if (values.length !== header.length) {
      throw new Error(`${label}:${index + 2}: 列数がヘッダーと一致しません (期待: ${header.length}, 実際: ${values.length})`);
    }
    return Object.fromEntries(header.map((k, i) => [k, values[i]]));
  });
}

function indexBy(rows, key, label) {
  const map = new Map();
  for (const row of rows) {
    const val = row[key];
    if (!val) throw new Error(`${label}: 主キー '${key}' が空欄です`);
    if (map.has(val)) throw new Error(`${label}: 主キー '${key}' が重複しています: ${val}`);
    map.set(val, row);
  }
  return map;
}

const ALLOWED_RELATION_TYPES = new Set([
  'direct_command',
  'subordinate',
  'semi_autonomous_subordinate',
  'branch_family',
  'alliance',
  'peace_treaty',
  'marriage_alliance',
  'hostile',
  'contested_allegiance',
  'nominal_authority',
  'religious_network',
  'intermediary'
]);

const ALLOWED_DIRECTIONS = new Set(['mutual', 'a_to_b', 'b_to_a']);
const ALLOWED_SPATIAL_SCOPES = new Set(['localized', 'general', 'unspecified']);
const ALLOWED_TIME_PRECISION = new Set([
  'year_event',
  'month_event',
  'exact_date',
  'approx_span',
  'year_start_only',
  'undated'
]);
const ALLOWED_KNOWLEDGE_STATES = new Set(['known', 'incomplete', 'unknown']);
const ALLOWED_CONFIDENCE = new Set(['high', 'medium', 'low', '']);
const ALLOWED_COMMAND_SCOPES = new Set(['demonstrated', 'unverified', 'not_applicable']);
const ALLOWED_CONTINUITY_STATUS = new Set([
  'not_reviewed',
  'insufficient',
  'reviewed_no_contradiction',
  'contradicted',
  'conflicted'
]);
const ALLOWED_EVIDENCE_ROLES = new Set([
  'primary_document',
  'scholarly_evaluation',
  'chronicle',
  'counter_evidence'
]);

const ALLOWED_RESEARCH_STAGES = new Set([
  'not_researched',
  'sources_identified',
  'evidence_reviewed'
]);

const ALLOWED_COVERAGE_KNOWLEDGE_STATES = new Set([
  'documented',
  'incomplete',
  'unknown',
  'no_relation_found'
]);


function validateDiplomacy(options = {}) {
  const checkSample = options.checkSample || false;
  console.log('=== 外交・従属関係レイヤー 参照整合性チェック開始 ===\n');

  // 1. 共通マスターのロード
  const actors = indexBy(parseCsv(path.join(dataDir, 'actors.csv'), 'actors.csv'), 'actor_id', 'actors.csv');
  const places = indexBy(parseCsv(path.join(dataDir, 'places.csv'), 'places.csv'), 'place_id', 'places.csv');
  const sources = indexBy(parseCsv(path.join(dataDir, 'sources.csv'), 'sources.csv'), 'source_id', 'sources.csv');
  const evidence = indexBy(parseCsv(path.join(dataDir, 'evidence_1560.csv'), 'evidence_1560.csv'), 'evidence_id', 'evidence_1560.csv');

  console.log(`共通マスター読み込み完了: actors=${actors.size}, places=${places.size}, sources=${sources.size}, evidence=${evidence.size}`);

  // 2. 本番関係データのロード
  const relationsRows = parseCsv(path.join(diplomacyDir, 'actor_relations_1560.csv'), 'actor_relations_1560.csv');
  const relations = indexBy(relationsRows, 'relation_id', 'actor_relations_1560.csv');
  const relationSources = parseCsv(path.join(diplomacyDir, 'actor_relation_sources.csv'), 'actor_relation_sources.csv');
  const relationEvidence = parseCsv(path.join(diplomacyDir, 'actor_relation_evidence.csv'), 'actor_relation_evidence.csv');

  const errors = [];

  // 3. actor_relations_1560.csv の詳細検証
  let blankValidFromCount = 0;
  let blankValidToCount = 0;
  const spatialCounts = { localized: 0, general: 0, unspecified: 0 };
  const timePrecisionCounts = {};
  let blankScopeReviewCount = 0;

  for (const rel of relations.values()) {
    const id = rel.relation_id;

    // 必須項目チェック
    const requiredCols = [
      'actor_a_id', 'actor_b_id', 'relation_type', 'direction', 'spatial_scope',
      'time_precision', 'knowledge_state', 'command_scope',
      'continuity_review_status', 'relation_note', 'caveat'
    ];
    for (const col of requiredCols) {
      if (!rel[col] || rel[col].trim() === '') {
        errors.push(`${id}: 必須列 '${col}' が空欄です`);
      }
    }

    // 列挙値チェック
    if (!ALLOWED_RELATION_TYPES.has(rel.relation_type)) {
      errors.push(`${id}: 不正な relation_type '${rel.relation_type}'`);
    }
    if (!ALLOWED_DIRECTIONS.has(rel.direction)) {
      errors.push(`${id}: 不正な direction '${rel.direction}'`);
    }
    if (!ALLOWED_SPATIAL_SCOPES.has(rel.spatial_scope)) {
      errors.push(`${id}: 不正な spatial_scope '${rel.spatial_scope}'`);
    } else {
      spatialCounts[rel.spatial_scope] = (spatialCounts[rel.spatial_scope] || 0) + 1;
    }
    if (!ALLOWED_TIME_PRECISION.has(rel.time_precision)) {
      errors.push(`${id}: 不正な time_precision '${rel.time_precision}'`);
    } else {
      timePrecisionCounts[rel.time_precision] = (timePrecisionCounts[rel.time_precision] || 0) + 1;
    }
    if (!ALLOWED_KNOWLEDGE_STATES.has(rel.knowledge_state)) {
      errors.push(`${id}: 不正な knowledge_state '${rel.knowledge_state}'`);
    }
    if (!ALLOWED_CONFIDENCE.has(rel.confidence)) {
      errors.push(`${id}: 不正な confidence '${rel.confidence}'`);
    }
    if (!ALLOWED_COMMAND_SCOPES.has(rel.command_scope)) {
      errors.push(`${id}: 不正な command_scope '${rel.command_scope}'`);
    }
    if (!ALLOWED_CONTINUITY_STATUS.has(rel.continuity_review_status)) {
      errors.push(`${id}: 不正な continuity_review_status '${rel.continuity_review_status}'`);
    }

    // 当事者整合性チェック
    if (rel.actor_a_id === rel.actor_b_id) {
      errors.push(`${id}: actor_a_id と actor_b_id が同一です (自己参照): ${rel.actor_a_id}`);
    }
    if (!actors.has(rel.actor_a_id)) {
      errors.push(`${id}: actor_a_id '${rel.actor_a_id}' が actors.csv に存在しません`);
    }
    if (!actors.has(rel.actor_b_id)) {
      errors.push(`${id}: actor_b_id '${rel.actor_b_id}' が actors.csv に存在しません`);
    }

    // intermediary と target_actor_id の整合性
    if (rel.relation_type === 'intermediary') {
      if (!rel.target_actor_id || rel.target_actor_id.trim() === '') {
        errors.push(`${id}: intermediary 関係では target_actor_id が必須です`);
      } else {
        if (!actors.has(rel.target_actor_id)) {
          errors.push(`${id}: target_actor_id '${rel.target_actor_id}' が actors.csv に存在しません`);
        }
        if (rel.target_actor_id === rel.actor_a_id || rel.target_actor_id === rel.actor_b_id) {
          errors.push(`${id}: target_actor_id は当事者(A, B)と異なる必要があります`);
        }
      }
    } else {
      if (rel.target_actor_id && rel.target_actor_id.trim() !== '') {
        errors.push(`${id}: intermediary 以外の関係で target_actor_id が指定されています: ${rel.target_actor_id}`);
      }
    }

    // 空間範囲（spatial_scope）と place_scope_id の整合性チェック
    if (rel.spatial_scope === 'localized') {
      if (!rel.place_scope_id || rel.place_scope_id.trim() === '') {
        errors.push(`${id}: spatial_scope='localized' ですが place_scope_id が空欄です`);
      } else if (!places.has(rel.place_scope_id)) {
        errors.push(`${id}: place_scope_id '${rel.place_scope_id}' が places.csv に存在しません`);
      }
    } else if (rel.spatial_scope === 'general' || rel.spatial_scope === 'unspecified') {
      if (rel.place_scope_id && rel.place_scope_id.trim() !== '') {
        errors.push(`${id}: spatial_scope='${rel.spatial_scope}' の場合は place_scope_id を空欄にする必要があります (指定値: ${rel.place_scope_id})`);
      }
    }

    // 日付・時期の順序と形式チェック
    const from = rel.valid_from ? rel.valid_from.trim() : '';
    const to = rel.valid_to ? rel.valid_to.trim() : '';
    if (!from) blankValidFromCount++;
    if (!to) blankValidToCount++;

    if (rel.time_precision === 'undated') {
      if (from !== '' || to !== '') {
        errors.push(`${id}: time_precision='undated' ですが valid_from または valid_to が指定されています`);
      }
    } else if (rel.time_precision === 'year_start_only') {
      if (!from) errors.push(`${id}: time_precision='year_start_only' ですが valid_from が空欄です`);
      if (to) errors.push(`${id}: time_precision='year_start_only' ですが valid_to が指定されています (未確認終期は空欄)`);
    }

    if (from && to) {
      if (from > to) {
        errors.push(`${id}: valid_from (${from}) が valid_to (${to}) より未来の日付です`);
      }
    }

    // 継続性レビューのスコープ
    if (!rel.continuity_review_scope || rel.continuity_review_scope.trim() === '') {
      blankScopeReviewCount++;
    }
  }

  // 4. actor_relation_sources.csv の結合整合性
  const sourcesByRel = new Map();
  for (const row of relationSources) {
    const { relation_id, source_id, evidence_role } = row;
    if (!relations.has(relation_id)) {
      errors.push(`actor_relation_sources: 存在しない relation_id '${relation_id}'`);
    }
    if (!sources.has(source_id)) {
      errors.push(`actor_relation_sources (${relation_id}): 存在しない source_id '${source_id}'`);
    }
    if (!evidence_role || !ALLOWED_EVIDENCE_ROLES.has(evidence_role)) {
      errors.push(`actor_relation_sources (${relation_id}, ${source_id}): 不正または未指定の evidence_role '${evidence_role}'`);
    }
    if (!sourcesByRel.has(relation_id)) sourcesByRel.set(relation_id, []);
    sourcesByRel.get(relation_id).push(source_id);
  }

  for (const id of relations.keys()) {
    if (!sourcesByRel.has(id) || sourcesByRel.get(id).length === 0) {
      errors.push(`${id}: actor_relation_sources.csv に対応する出典が存在しません (最低1件必須)`);
    }
  }

  // 5. actor_relation_evidence.csv の結合整合性
  const evidenceByRel = new Map();
  for (const row of relationEvidence) {
    const { relation_id, evidence_id } = row;
    if (!relations.has(relation_id)) {
      errors.push(`actor_relation_evidence: 存在しない relation_id '${relation_id}'`);
    }
    if (!evidence.has(evidence_id)) {
      errors.push(`actor_relation_evidence (${relation_id}): 存在しない evidence_id '${evidence_id}'`);
    }
    if (!evidenceByRel.has(relation_id)) evidenceByRel.set(relation_id, []);
    evidenceByRel.get(relation_id).push(evidence_id);
  }

  if (errors.length > 0) {
    console.error(`\n❌ 検証失敗: ${errors.length}件のエラーが検出されました:`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  console.log('✅ 本番外交データ検証合格');
  console.log(`  - 関係レコード件数: ${relations.size}件 (AR001〜AR${String(relations.size).padStart(3, '0')})`);
  console.log(`  - 出典結合レコード: ${relationSources.length}件 (全関係に出典紐付けあり)`);
  console.log(`  - Evidence結合レコード: ${relationEvidence.length}件 (具体的行動証拠と紐付く関係: ${evidenceByRel.size}件)`);

  console.log('\n[地域範囲 (spatial_scope) の分類集計]');
  console.log(`  - localized (特定地域限定): ${spatialCounts.localized}件 (place_scope_id に場所IDを明記)`);
  console.log(`  - general (地域限定なし・全般): ${spatialCounts.general}件`);
  console.log(`  - unspecified (適用地域未詳・未確定): ${spatialCounts.unspecified}件 (史料未確認のため推測で確定せず保持)`);

  console.log('\n[史料確認時期 (time_precision) および空欄の分類集計]');
  for (const [k, v] of Object.entries(timePrecisionCounts)) {
    console.log(`  - ${k}: ${v}件`);
  }
  console.log(`  - 始期不明 (valid_from 空欄): ${blankValidFromCount}件 / ${relations.size}件 (例: undated 史料)`);
  console.log(`  - 終期未確認 (valid_to 空欄): ${blankValidToCount}件 / ${relations.size}件 (無期限継続と扱わない未確認終期)`);
  console.log(`  - 反証探索スコープ空欄: ${blankScopeReviewCount}件 / ${relations.size}件 (not_reviewed 等)`);

  // 6. coverage_1560.csv のスキーマ・参照整合性検証
  console.log('\n--- 外交カバレッジ管理表検証 (coverage_1560.csv) ---');
  const coveragePath = path.join(diplomacyDir, 'coverage_1560.csv');
  const coverageRows = parseCsv(coveragePath, 'coverage_1560.csv');

  // 対象となる全国70地域（province 68国 + external_region 2地域）を抽出
  const expectedProvinces = new Set();
  for (const p of places.values()) {
    if (p.place_type === 'province' || p.place_type === 'external_region') {
      expectedProvinces.add(p.place_id);
    }
  }

  const coveragePlaceIds = new Set();
  const coverageKnowledgeCounts = { documented: 0, incomplete: 0, unknown: 0, no_relation_found: 0 };
  const coverageStageCounts = { evidence_reviewed: 0, sources_identified: 0, not_researched: 0 };

  for (const row of coverageRows) {
    const { year, place_id, research_stage, knowledge_state, knowledge_reason, note } = row;

    if (year !== '1560') {
      errors.push(`coverage_1560.csv: year は '1560' である必要があります (指定値: ${year})`);
    }
    if (!expectedProvinces.has(place_id)) {
      errors.push(`coverage_1560.csv: 不正または対象外の place_id '${place_id}' (旧国または旧国体系外地域のみ許可)`);
    }
    if (coveragePlaceIds.has(place_id)) {
      errors.push(`coverage_1560.csv: place_id '${place_id}' が重複しています`);
    }
    coveragePlaceIds.add(place_id);

    if (!ALLOWED_RESEARCH_STAGES.has(research_stage)) {
      errors.push(`coverage_1560.csv (${place_id}): 不正な research_stage '${research_stage}'`);
    } else {
      coverageStageCounts[research_stage] = (coverageStageCounts[research_stage] || 0) + 1;
    }

    if (!ALLOWED_COVERAGE_KNOWLEDGE_STATES.has(knowledge_state)) {
      errors.push(`coverage_1560.csv (${place_id}): 不正な knowledge_state '${knowledge_state}'`);
    } else {
      coverageKnowledgeCounts[knowledge_state] = (coverageKnowledgeCounts[knowledge_state] || 0) + 1;
    }

    if (!knowledge_reason || knowledge_reason.trim() === '') {
      errors.push(`coverage_1560.csv (${place_id}): knowledge_reason が空欄です`);
    }
    if (!note || note.trim() === '') {
      errors.push(`coverage_1560.csv (${place_id}): note が空欄です`);
    }
  }

  // 70地域の網羅性チェック
  for (const expectedId of expectedProvinces) {
    if (!coveragePlaceIds.has(expectedId)) {
      errors.push(`coverage_1560.csv: 必須地域 '${expectedId}' (${places.get(expectedId).name}) がカバレッジ表に含まれていません`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n❌ 検証失敗: ${errors.length}件のエラーが検出されました:`);
    for (const err of errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  console.log('✅ 本番外交カバレッジ表検証合格');
  console.log(`  - 登録地域数: ${coverageRows.length}地域 / 対象70地域 (旧国68 + 外部2) を完全網羅`);
  console.log(`  - 調査進捗 (research_stage):`);
  console.log(`    * evidence_reviewed (史料本文・証拠精査済み): ${coverageStageCounts.evidence_reviewed}地域`);
  console.log(`    * sources_identified (候補資料把握): ${coverageStageCounts.sources_identified}地域`);
  console.log(`    * not_researched (未調査): ${coverageStageCounts.not_researched}地域`);
  console.log(`  - 知識状態 (knowledge_state):`);
  console.log(`    * documented (外交関係登録済み): ${coverageKnowledgeCounts.documented}地域`);
  console.log(`    * incomplete (調査中・関係未確定): ${coverageKnowledgeCounts.incomplete}地域`);
  console.log(`    * unknown (未調査・判定不能): ${coverageKnowledgeCounts.unknown}地域`);
  console.log(`    * no_relation_found (調査したが関係未確認): ${coverageKnowledgeCounts.no_relation_found}地域`);

  // 7. オプション: サンプル架空データのスキーマ検証
  if (checkSample) {

    console.log('\n--- 架空サンプルデータ検証 (sample_relations_dummy.csv) ---');
    const samplePath = path.join(diplomacyDir, 'sample_relations_dummy.csv');
    const sampleRows = parseCsv(samplePath, 'sample_relations_dummy.csv');
    console.log(`架空サンプル読み込み: ${sampleRows.length}件`);
    const sampleErrors = [];
    for (const rel of sampleRows) {
      const id = rel.relation_id;
      if (!id.startsWith('DUMMY_')) {
        sampleErrors.push(`${id}: 架空サンプルIDは 'DUMMY_' で始まる必要があります`);
      }
      if (!ALLOWED_RELATION_TYPES.has(rel.relation_type)) {
        sampleErrors.push(`${id}: 不正な relation_type '${rel.relation_type}'`);
      }
      if (!ALLOWED_DIRECTIONS.has(rel.direction)) {
        sampleErrors.push(`${id}: 不正な direction '${rel.direction}'`);
      }
      if (!ALLOWED_SPATIAL_SCOPES.has(rel.spatial_scope)) {
        sampleErrors.push(`${id}: 不正な spatial_scope '${rel.spatial_scope}'`);
      }
      if (!ALLOWED_TIME_PRECISION.has(rel.time_precision)) {
        sampleErrors.push(`${id}: 不正な time_precision '${rel.time_precision}'`);
      }
      if (rel.spatial_scope === 'localized' && (!rel.place_scope_id || rel.place_scope_id.trim() === '')) {
        sampleErrors.push(`${id}: localized ですが place_scope_id が空欄です`);
      }
      if ((rel.spatial_scope === 'general' || rel.spatial_scope === 'unspecified') && rel.place_scope_id && rel.place_scope_id.trim() !== '') {
        sampleErrors.push(`${id}: ${rel.spatial_scope} ですが place_scope_id が指定されています`);
      }
      const from = rel.valid_from ? rel.valid_from.trim() : '';
      const to = rel.valid_to ? rel.valid_to.trim() : '';
      if (from && to && from > to) {
        sampleErrors.push(`${id}: valid_from (${from}) が valid_to (${to}) より未来です`);
      }
    }
    if (sampleErrors.length > 0) {
      console.error(`❌ サンプル検証失敗: ${sampleErrors.length}件のエラー`);
      for (const err of sampleErrors) console.error(`  - ${err}`);
      process.exit(1);
    }
    console.log('✅ 架空サンプルデータスキーマ適合確認済み (本番データとは分離)');
  }

  console.log('\n=== すべての検証が正常に完了しました ===');
}

const args = process.argv.slice(2);
const checkSample = args.includes('--sample');
validateDiplomacy({ checkSample });
