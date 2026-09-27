// 1560年軍事Influenceの承認済みAssessmentだけを保守的に投影する。
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const data = path.join(root, 'data');
const output = path.join(data, 'military_influence_1560.json');
const expectedIds = ['C003', 'C004', 'C009', 'C033', 'C037', 'C038', 'C039', 'C040', 'C041', 'C042'];

function csv(name) {
  const raw = fs.readFileSync(path.join(data, name), 'utf8').replace(/^\uFEFF/, '');
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
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (quoted) throw new Error(`${name}: 引用符が閉じていません`);
  if (row.length || field) { row.push(field); rows.push(row); }
  const header = rows.shift();
  if (!header || new Set(header).size !== header.length) throw new Error(`${name}: ヘッダーが不正です`);
  return rows.map((values, index) => {
    if (values.length !== header.length) throw new Error(`${name}:${index + 2}: 列数が不正です`);
    return Object.fromEntries(header.map((key, i) => [key, values[i]]));
  });
}

function indexed(rows, key, name) {
  const result = new Map();
  for (const row of rows) {
    if (!row[key] || result.has(row[key])) throw new Error(`${name}: IDが空欄または重複: ${row[key]}`);
    result.set(row[key], row);
  }
  return result;
}

function requireRef(map, id, label) {
  const value = map.get(id);
  if (!value) throw new Error(`${label}: 参照先がありません: ${id}`);
  return value;
}

const claims = csv('claims_1560.csv');
const actors = indexed(csv('actors.csv'), 'actor_id', 'actors');
const places = indexed(csv('places.csv'), 'place_id', 'places');
const sources = indexed(csv('sources.csv'), 'source_id', 'sources');
const evidence = indexed(csv('evidence_1560.csv'), 'evidence_id', 'evidence');
const claimEvidence = csv('claim_evidence.csv');
const claimSources = csv('claim_sources.csv');
const relations = indexed(csv('actor_relations_1560.csv'), 'relation_id', 'relations');
const relationSources = csv('actor_relation_sources.csv');
const relationEvidence = csv('actor_relation_evidence.csv');
const structures = indexed(csv('region_structure_1560.csv'), 'structure_id', 'structures');
const structureEvidence = csv('structure_evidence.csv');
const coverage = csv('coverage_1560.csv');
const claimMap = indexed(claims, 'claim_id', 'claims');

for (const claim of claims) {
  requireRef(actors, claim.actor_id, claim.claim_id);
  requireRef(places, claim.place_id, claim.claim_id);
  if (claim.basis_relation_id) requireRef(relations, claim.basis_relation_id, claim.claim_id);
}
for (const place of places.values()) if (place.parent_id) requireRef(places, place.parent_id, place.place_id);
for (const item of evidence.values()) {
  requireRef(places, item.place_id, item.evidence_id);
  if (item.actor_id) requireRef(actors, item.actor_id, item.evidence_id);
  requireRef(sources, item.source_id, item.evidence_id);
}
for (const link of claimEvidence) {
  requireRef(claimMap, link.claim_id, 'claim_evidence');
  requireRef(evidence, link.evidence_id, 'claim_evidence');
}
for (const link of claimSources) {
  requireRef(claimMap, link.claim_id, 'claim_sources');
  requireRef(sources, link.source_id, 'claim_sources');
}
for (const relation of relations.values()) {
  requireRef(actors, relation.actor_a_id, relation.relation_id);
  requireRef(actors, relation.actor_b_id, relation.relation_id);
  if (relation.target_actor_id) requireRef(actors, relation.target_actor_id, relation.relation_id);
  if (relation.place_scope_id) requireRef(places, relation.place_scope_id, relation.relation_id);
}
for (const link of relationSources) {
  requireRef(relations, link.relation_id, 'actor_relation_sources');
  requireRef(sources, link.source_id, 'actor_relation_sources');
}
for (const link of relationEvidence) {
  requireRef(relations, link.relation_id, 'actor_relation_evidence');
  requireRef(evidence, link.evidence_id, 'actor_relation_evidence');
}
for (const item of structures.values()) requireRef(places, item.place_id, item.structure_id);
for (const link of structureEvidence) {
  requireRef(structures, link.structure_id, 'structure_evidence');
  requireRef(evidence, link.evidence_id, 'structure_evidence');
}
for (const item of coverage) requireRef(places, item.place_id, 'coverage');

const approved = claims.filter(item => item.atlas_status === 'approved').sort((a, b) => a.claim_id.localeCompare(b.claim_id));
if (claims.length !== 39 || claims.filter(item => item.atlas_status === 'withheld').length !== 29 ||
    approved.map(item => item.claim_id).join(',') !== expectedIds.join(',')) {
  throw new Error('freeze対象のAssessment件数またはapproved IDが基準と異なります');
}
if (approved.some(item => item.year !== '1560' || item.influence_mode !== 'direct' ||
    item.influence_basis !== 'direct_action' || item.basis_relation_id ||
    !['limited', 'influential'].includes(item.influence_status) ||
    !item.spatial_note || !item.time_note)) {
  throw new Error('承認行の年・mode・basis・強度・限定が基準と異なります');
}

const records = approved.map(claim => {
  const links = claimEvidence.filter(link => link.claim_id === claim.claim_id);
  if (!links.length || !links.some(link => requireRef(evidence, link.evidence_id, claim.claim_id).review_status === '本文確認')) {
    throw new Error(`${claim.claim_id}: 本文確認済みEvidenceがありません`);
  }
  return {
    claim_id: claim.claim_id,
    actor: { id: claim.actor_id, label: requireRef(actors, claim.actor_id, claim.claim_id).label },
    place: { id: claim.place_id, name: requireRef(places, claim.place_id, claim.claim_id).name },
    spatial_limitation: claim.spatial_note,
    geometry: null,
    time: { year: 1560, precision: claim.time_precision, valid_from: claim.valid_from || null,
      valid_to: claim.valid_to || null, limitation: claim.time_note },
    influence: { status: claim.influence_status, mode: claim.influence_mode, basis: claim.influence_basis },
    force_group_id: claim.force_group_id || null,
    evidence: links.map(link => {
      const item = requireRef(evidence, link.evidence_id, claim.claim_id);
      return { id: item.evidence_id, role: link.role, source_id: item.source_id,
        locator: item.locator, review_status: item.review_status, caveat: item.caveat };
    }).sort((a, b) => a.id.localeCompare(b.id)),
    caveat: claim.assessment_note,
    inference_note: claim.inference_note,
    relation_note: claim.relation_note
  };
});

const projection = {
  schema: 'military-influence-projection-1560/v1',
  source: 'data/claims_1560.csv',
  semantics: {
    spatial: 'place_idは索引。geometry=nullは境界未確定を表し、親地域へ拡張しない',
    temporal: 'yearは対象年。eventとapprox_spanを通年・年末状態へ変換しない',
    withheld: '未採用・未確定。空白は軍事Influenceの不在を示さない',
    counting: '表示行を戦力数・占有面積として合算しない。空欄force_group_idは独立戦力の証明ではない'
  },
  records
};
const serialized = JSON.stringify(projection, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (fs.readFileSync(output, 'utf8') !== serialized) throw new Error('投影ファイルが原本と一致しません');
  console.log(`整合性確認済み: Assessment ${claims.length}件、approved ${records.length}件、withheld 29件`);
} else {
  fs.writeFileSync(output, serialized, 'utf8');
  console.log(`投影生成: ${records.length}件`);
}
