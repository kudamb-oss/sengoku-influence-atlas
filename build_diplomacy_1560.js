// 1560年外交・従属関係レイヤーの最小投影スクリプト
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const dataDir = path.join(root, 'data');
const diplomacyDir = path.join(dataDir, 'diplomacy');
const output = path.join(diplomacyDir, 'actor_relations_1560.json');

function csv(filePath, label) {
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

function indexed(rows, key, label) {
  const map = new Map();
  for (const row of rows) {
    const val = row[key];
    if (!val) throw new Error(`${label}: 主キー '${key}' が空欄です`);
    if (map.has(val)) throw new Error(`${label}: 主キー '${key}' が重複しています: ${val}`);
    map.set(val, row);
  }
  return map;
}

function requireRef(map, id, label) {
  const value = map.get(id);
  if (!value) throw new Error(`${label}: 参照先が存在しません: ${id}`);
  return value;
}

function buildProjectionRecords(relations, relationSources, relationEvidence, actors, places, sources, evidence, isSample = false) {
  // ソースとエビデンスを関係IDごとにグループ化
  const sourcesByRel = new Map();
  for (const link of relationSources) {
    if (!sourcesByRel.has(link.relation_id)) sourcesByRel.set(link.relation_id, []);
    sourcesByRel.get(link.relation_id).push(link);
  }

  const evidenceByRel = new Map();
  for (const link of relationEvidence) {
    if (!evidenceByRel.has(link.relation_id)) evidenceByRel.set(link.relation_id, []);
    evidenceByRel.get(link.relation_id).push(link);
  }

  return relations.map(rel => {
    const id = rel.relation_id;

    // 当事者の安全な取得（サンプルの場合は外部キーなしでもフォールバック）
    let actorA, actorB, targetActor = null;
    if (isSample) {
      actorA = { id: rel.actor_a_id, label: actors.has(rel.actor_a_id) ? actors.get(rel.actor_a_id).label : rel.actor_a_id };
      actorB = { id: rel.actor_b_id, label: actors.has(rel.actor_b_id) ? actors.get(rel.actor_b_id).label : rel.actor_b_id };
      if (rel.target_actor_id && rel.target_actor_id.trim() !== '') {
        targetActor = { id: rel.target_actor_id, label: actors.has(rel.target_actor_id) ? actors.get(rel.target_actor_id).label : rel.target_actor_id };
      }
    } else {
      const a = requireRef(actors, rel.actor_a_id, `${id}.actor_a_id`);
      const b = requireRef(actors, rel.actor_b_id, `${id}.actor_b_id`);
      actorA = { id: a.actor_id, label: a.label };
      actorB = { id: b.actor_id, label: b.label };
      if (rel.relation_type === 'intermediary') {
        if (!rel.target_actor_id || rel.target_actor_id.trim() === '') {
          throw new Error(`${id}: intermediary 関係ですが target_actor_id が空欄です`);
        }
        const t = requireRef(actors, rel.target_actor_id, `${id}.target_actor_id`);
        targetActor = { id: t.actor_id, label: t.label };
      }
    }

    // 空間範囲の安全な処理
    let place = null;
    if (rel.spatial_scope === 'localized') {
      if (!rel.place_scope_id || rel.place_scope_id.trim() === '') {
        throw new Error(`${id}: spatial_scope='localized' ですが place_scope_id が空欄です`);
      }
      if (isSample) {
        place = { id: rel.place_scope_id, name: places.has(rel.place_scope_id) ? places.get(rel.place_scope_id).name : rel.place_scope_id };
      } else {
        const p = requireRef(places, rel.place_scope_id, `${id}.place_scope_id`);
        place = { id: p.place_id, name: p.name };
      }
    }

    // 出典の安全な取得
    const sourceLinks = sourcesByRel.get(id) || [];
    const sourceRecords = sourceLinks.map(link => {
      const s = sources.get(link.source_id);
      return {
        source_id: link.source_id,
        title: s ? s.title : null,
        locator: link.locator || null,
        evidence_role: link.evidence_role || null
      };
    }).sort((a, b) => a.source_id.localeCompare(b.source_id));

    // Evidenceの安全な取得
    const evidenceLinks = evidenceByRel.get(id) || [];
    const evidenceRecords = evidenceLinks.map(link => {
      const e = evidence.get(link.evidence_id);
      return {
        evidence_id: link.evidence_id,
        role: link.role || null,
        statement: e ? e.statement : null
      };
    }).sort((a, b) => a.evidence_id.localeCompare(b.evidence_id));

    return {
      relation_id: id,
      relation_type: rel.relation_type,
      direction: rel.direction,
      actors: {
        actor_a: actorA,
        actor_b: actorB,
        target_actor: targetActor
      },
      spatial: {
        scope: rel.spatial_scope,
        place: place
      },
      time: {
        precision: rel.time_precision,
        valid_from: (rel.valid_from && rel.valid_from.trim() !== '') ? rel.valid_from.trim() : null,
        valid_to: (rel.valid_to && rel.valid_to.trim() !== '') ? rel.valid_to.trim() : null
      },
      assessment: {
        knowledge_state: rel.knowledge_state,
        confidence: (rel.confidence && rel.confidence.trim() !== '') ? rel.confidence.trim() : null,
        command_scope: rel.command_scope,
        continuity: {
          status: rel.continuity_review_status,
          scope: (rel.continuity_review_scope && rel.continuity_review_scope.trim() !== '') ? rel.continuity_review_scope.trim() : null
        }
      },
      evidence: evidenceRecords,
      sources: sourceRecords,
      notes: {
        relation_note: rel.relation_note,
        caveat: rel.caveat
      }
    };
  }).sort((a, b) => a.relation_id.localeCompare(b.relation_id));
}

function main() {
  const args = process.argv.slice(2);
  const isCheck = args.includes('--check');
  const isSample = args.includes('--sample');

  // マスターデータのロード
  const actors = indexed(csv(path.join(dataDir, 'actors.csv'), 'actors.csv'), 'actor_id', 'actors.csv');
  const places = indexed(csv(path.join(dataDir, 'places.csv'), 'places.csv'), 'place_id', 'places.csv');
  const sources = indexed(csv(path.join(dataDir, 'sources.csv'), 'sources.csv'), 'source_id', 'sources.csv');
  const evidence = indexed(csv(path.join(dataDir, 'evidence_1560.csv'), 'evidence_1560.csv'), 'evidence_id', 'evidence_1560.csv');

  if (isSample) {
    console.log('=== 架空サンプルデータ投影テスト (--sample) ===');
    const sampleRelations = csv(path.join(diplomacyDir, 'sample_relations_dummy.csv'), 'sample_relations_dummy.csv');
    const records = buildProjectionRecords(sampleRelations, [], [], actors, places, sources, evidence, true);
    console.log(`架空サンプル投影生成成功: ${records.length}件`);
    // 欠損値（null）の検証
    const generalItem = records.find(r => r.spatial.scope === 'general');
    const unspecifiedItem = records.find(r => r.spatial.scope === 'unspecified');
    if (!generalItem || generalItem.spatial.place !== null) throw new Error('general の place が null ではありません');
    if (!unspecifiedItem || unspecifiedItem.spatial.place !== null) throw new Error('unspecified の place が null ではありません');
    console.log('✅ 欠損値（null）契約テスト合格: general/unspecified の place は安全に null');
    console.log('サンプル先頭レコード抜粋:\n', JSON.stringify(records[0], null, 2));
    return;
  }

  // 本番データのロード
  const relationsRows = csv(path.join(diplomacyDir, 'actor_relations_1560.csv'), 'actor_relations_1560.csv');
  const relationSources = csv(path.join(diplomacyDir, 'actor_relation_sources.csv'), 'actor_relation_sources.csv');
  const relationEvidence = csv(path.join(diplomacyDir, 'actor_relation_evidence.csv'), 'actor_relation_evidence.csv');

  const records = buildProjectionRecords(relationsRows, relationSources, relationEvidence, actors, places, sources, evidence, false);

  const projection = {
    schema: 'diplomacy-relations-projection-1560/v1',
    source: 'data/diplomacy/actor_relations_1560.csv',
    semantics: {
      temporal: 'valid_from/valid_toは史料確認時期。空欄はnull（始期不明/終期未確認）。特定日観測を関係終了日と自動断定しない。指定時点での継続が反証探索で裏付けられない場合は「不明」として扱い、継続中や関係なしと断定しない',
      spatial: 'spatial_scope=localizedはplaceによる地域限定。generalは勢力間包括合意（placeはnull）。unspecifiedは適用地域未詳（placeはnull、推測で包括合意と断定しない）',
      confidence: 'confidenceは関係記述そのものの根拠強度（史料・文献上の確実性）を表し、1560年指定時点での有効性・継続性を表すものではない。指定時点での有効性はtimeとcontinuityによってのみ評価される',
      evidence_role: 'evidence_roleは出典の役割（primary_document: 一次史料・古文書翻刻, scholarly_evaluation: 現代学術研究・自治体史通史解説, chronicle: 後世軍記・編纂物, counter_evidence: 反証史料）を表す。自治体史等の通史記述を一次史料と同一視しない',
      military_boundary: '外交関係（同盟・従属等）から軍事支配・指揮権・兵力投射を自動生成しない。command_scope=unverifiedは軍事実証なしを表す',
      null_contract: '値が不明または未調査の項目はnullとして保持し、架空の補完を行わない。1件の不明が他関係の不在を意味しない'
    },
    records
  };

  const serialized = JSON.stringify(projection, null, 2) + '\n';

  if (isCheck) {
    if (!fs.existsSync(output)) {
      throw new Error(`投影ファイルが存在しません: ${output}`);
    }
    const existing = fs.readFileSync(output, 'utf8');
    if (existing !== serialized) {
      throw new Error('投影ファイルが原本CSVの計算結果と一致しません。node build_diplomacy_1560.js を実行して再生成してください');
    }
    console.log(`整合性確認済み: 外交関係レコード ${records.length}件 (原本と完全一致)`);
  } else {
    fs.writeFileSync(output, serialized, 'utf8');
    console.log(`外交投影生成完了: ${records.length}件 -> ${output}`);
  }
}

main();
