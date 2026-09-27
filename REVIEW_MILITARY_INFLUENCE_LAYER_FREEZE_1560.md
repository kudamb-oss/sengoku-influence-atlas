# 1560年全国軍事Influenceレイヤー初版の最終監査とfreeze

判定日：2026年9月27日。対象は既承認の10件のみ。追加の史料探索、Evidence追加、Assessmentの昇格は行っていない。

## Baseline

開始時は`main`、HEAD `6bd96f3ee44f998a62a79efdb0c6404f405ca87b`、作業ツリーclean。`git log --oneline -12`を確認した。Assessment 39件、`approved=10`、`withheld=29`、`direct=10`、`indirect=0`。Model Cのスキーマと判定規則は既にfreeze済み。[SCHEMA.md](SCHEMA.md)、直近の[第2回採用ゲート](REVIEW_INFLUENCE_APPROVAL_GATE_2_1560.md)と[残存A候補ゲート](REVIEW_REMAINING_A_APPROVAL_GATE_1560.md)、Evidence・place・relation・地域構造の各CSVを確認した。`regions.csv`と既存の生成・可視化コードはなく、地域階層は`places.csv`と`region_structure_1560.csv`で管理されている。

## 投影仕様

`node build_military_influence_1560.js`が`atlas_status=approved`の10行だけから[data/military_influence_1560.json](data/military_influence_1560.json)を生成する。原本は`claims_1560.csv`と`claim_evidence.csv`・`evidence_1560.csv`・`sources.csv`であり、投影JSONは派生物である。`node build_military_influence_1560.js --check`は原本から再計算した結果との完全一致とCSV・ID・参照整合性を検査する。

- **空間**：`place.id`は検索・表示用の索引で、塗る面ではない。`spatial_limitation`を原claimから保存し、`geometry=null`とする。城・寺・戦場・局地侵攻を親region、郡、旧国へ拡張しない。座標と境界は未定義である。
- **時間**：`year=1560`は検討対象年にすぎない。`day_event`、`month_event`、`year_event`、`event_anchor`、`approx_span`を原値のまま保存する。旧暦の月日を現行暦へ換算しない。空欄の`valid_from`・`valid_to`は`null`で、年初・年末や無期限を補わない。年内変化を単一の年末状態にしない。
- **強度・帰属**：`limited`と`influential`、`direct / direct_action`を変更しない。攻撃・勝利・保持から`dominant`を作らず、関係CSVから`indirect`を生成しない。集合actorを個人へ分解しない。
- **計数**：各recordは表示単位であり、独立戦力数、支配面積、支配期間へ換算しない。`force_group_id`を原値で残すが、空欄は独立戦力の証明ではない。敵対両軍の同じ戦場での表示は二つの支配面積を意味しない。
- **空白**：`withheld`は未採用・未確定であり、不在・無支配ではない。JSONに含まれない場所も不在とは判定しない。

地図利用者はplace索引と限定文を提示できるが、この初版だけから塗り分け地図を描いてはならない。実際の地理形状との対応には別の根拠と審査が必要である。

## approved全10件の投影監査

下表のEvidenceは各claimを直接支える主要行。JSONには`claim_evidence.csv`で結ばれた周辺・反証・補足Evidenceも、その`role`、出典ID、locator、review状態、caveat付きで保存する。補足行を単独のInfluence根拠へ昇格しない。

| claim | actor・場所索引 | 投影した範囲と時点 | 強度・mode・basis | 主要Evidence・監査結果 |
| --- | --- | --- | --- | --- |
| C003 | A02 今川義元勢／T12 岡崎城 | 桶狭間以前の確認可能な城保持。撤退日・年末不明、`approx_span` | `influential / direct / direct_action` | E059。城代個人や西三河全域へ拡張しない |
| C004 | A03 松平元康勢／T02 法蔵寺 | 旧暦7月9日の制札発給時点、`event_anchor` | `limited / direct / direct_action` | E006。履行・岡崎全体の支配は含めない |
| C009 | A08 浅井長政勢／R23 野良田表周辺 | 旧暦8月中旬の戦場交戦、`month_event` | `limited / direct / direct_action` | E057。勝利から江北全域の優位を推定しない |
| C033 | A30 豊州家島津氏勢／R14 志布志城周辺 | 1560年内の退去前の城保持、`approx_span` | `influential / direct / direct_action` | E014・E016。終期の1560年説と1562年説を保持し、城周辺全体・年末保持へ拡張しない |
| C037 | A65 北条氏康勢／R19 久留里城周辺 | 1560年5月の城攻撃、`month_event` | `limited / direct / direct_action` | E052。取得・上総全域は含めない。`FG_E052_HOJO`を保持 |
| C038 | A01 織田信長勢／R02 桶狭間周辺 | 旧暦5月19日の交戦、`day_event` | `limited / direct / direct_action` | E001。戦場の行動だけを示す |
| C039 | A02 今川義元勢／R02 桶狭間周辺 | 旧暦5月19日の交戦、`day_event` | `limited / direct / direct_action` | E002。C038の敵対側で、戦後へ延長しない |
| C040 | A68 三好長慶勢／R20 飯盛城周辺 | 1560年内の軍事排除・入城時点、`year_event` | `limited / direct / direct_action` | E054。河内全域や年中保持へ拡張しない |
| C041 | A13 長尾景虎勢／R21 富山城周辺 | 1560年内の攻城時点、`year_event` | `limited / direct / direct_action` | E029。後世名から別actorを作らず、越中全域や城保持へ拡張しない |
| C042 | A53 正木氏勢／R22 香取周辺 | 旧暦10月の侵攻が及んだ範囲と時点、`month_event` | `limited / direct / direct_action` | E058。個人指揮者・香取全域の占拠・里見氏への上位帰属を作らない |

全10件に原claimと1件以上の本文確認済みEvidenceへのリンクがある。C003とC004は時点・場所・行動が異なり、同じ今川方の城保持と元康勢の制札を一つの通年状態にしない。C038/C039は同一交戦の敵対する別主体であり、面積も戦力総数も合算しない。C033の城保持と未採用C034の攻撃候補を一つの実行戦力としない。C042の集合actorを時茂・時忠・時定へ分解せず、A52里見氏の上位`indirect`も作らない。単独のC037のforce groupは重複表示を発生させない。

## 機械的監査と判定

生成プログラムは全CSVの列数、主要IDの一意性、actor・place・source・Evidence・claim・relation・structureの参照、承認10件の本文確認済みEvidenceを検査する。承認IDをfreeze時点の10件と突き合わせ、全件が1560年・`direct / direct_action`で限定注記を持つことを確認する。原本からの再生成一致、`git diff --check`を最終確認する。投影JSONに`geometry`以外の推定座標・面、推定期間、戦力数は存在しない。

**最終判定：FREEZE。** 既承認10件を原本とEvidenceへ追跡可能な局地的軍事Influence初版として固定する。Model Cの変更を要する構造問題、参照切れ、二重計上は見つからなかった。全国の面積網羅、29件の`withheld`解消、実在二帰属の陽性試験はこの版の完了条件ではない。

## 限界・再オープン条件・次工程

境界と座標が未定義なので、この初版はplace索引付きの表示・検索データであり、連続した塗り分け地図や勢力面積の入力には使えない。旧暦の日付と暦法未確定の月記事を混在させて厳密に並べない。本文確認済みの二次資料に依存する行があり、原史料網羅を意味しない。`withheld=29`は不在を示さない。C030・C034は新しい個別軍事Evidenceが自然に得られるまで調査停止を維持する。

軍事レイヤーは原則として閉じる。再オープンは、重要な新Evidenceが自然に得られた場合、他レイヤーとの統合で構造的矛盾が判明した場合、明白な史実誤認・二重計上・Schema不整合が判明した場合に限る。単なる全国coverage拡大は理由にしない。次の独自レイヤーは軍事の空白を「無支配」と解釈せず、軍事claimの採用範囲とEvidence IDを参照しながら、別の評価軸として設計できる。
