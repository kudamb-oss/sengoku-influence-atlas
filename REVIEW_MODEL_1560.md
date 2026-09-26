# 1560年軍事レイヤー：状態分離と大隅追加ケースのレビュー

## 対象と結論

2026年9月26日。全国68旧国の追加入力は行っていない。Evidence → Assessment → Influence の順を保ち、軍事主体の影響度、判定の確信度、研究上の知識状態、地域全体の構造を別軸にした。**大隅国全体の地域構造は `unknown`** とする。日向国諸県郡の志布志城周辺では、豊州家島津氏の在城と肝付氏の反復攻撃が重なり、限定した範囲で `contested` というAssessmentを置ける。ただしアトラス採用は保留する。

前回の実ファイルは、旧国68件のうち `partial` 15件・`unknown` 53件、旧国制外2件のうち蝦夷地 `partial`・琉球 `unknown`、Evidence 13件、Assessment 29件（全件 `status=uncertain`）、採用済みInfluence 0件だった。報告値と一致した。親Gitリポジトリでは `sengoku-influence-atlas/` 全体が未追跡で、追跡済み差分には出ない。

## 変更したスキーマ

| 旧表現 | 問題 | 現表現 |
| --- | --- | --- |
| `claims.status=uncertain` | 解釈の不足と史実の軍事状態が紛れる | `knowledge_state=incomplete`。判定の不足を明示 |
| `claims.influence_status` に「軍事的影響あり」等の自由記述 | 段階値の比較ができず、対象範囲も曖昧 | `dominant / influential / limited / 空欄`。旧記述は `assessment_note` に残す |
| `coverage_status=partial / unknown` | 未調査と調査済み判定不能が同じ `unknown` | `research_stage`、`knowledge_state`、`knowledge_reason` を独立させる |
| 主体別行だけで地域全体の状態を推測 | 複数主体の存在を即座に「競合」と誤読する | `region_structure_1560.csv` と `structure_evidence.csv` を追加 |

`influence_status` は、限定した場所での大部分の軍事的優位を `dominant`、拠点保持や反復的な軍事投射を `influential`、局地的な投射だけを `limited` とする。存在・合戦・官職だけで値を与えない。`confidence` は史料と時空間の適合度で `high / medium / low`、判定不能なら空欄とし、確率や占有率としない。`knowledge_state` は対象限定で材料を十分に検討した `known`、一部を確認した `incomplete`、判定材料が足りない `unknown` とする。調査の進度を `not_researched / sources_identified / evidence_reviewed` で表す。したがって未調査は `unknown + not_researched`、調査済み判定不能は `unknown + evidence_reviewed` と区別できる。理由は `knowledge_reason` に残す。

地域構造は、一勢力または実証された統合連合が大部分で優勢なら `consolidated`、異なる下位地域へ実効圏が分かれるなら `fragmented`、同じ場所に複数勢力が軍事力を投射するなら `contested`、分割と重複の双方を証拠で示せるときだけ `mixed`、それ以外は `unknown` とする。親国の構造を子地域から自動集約しない。今回の11地域Assessmentはそれぞれの `place_id` に対応する範囲だけを主張する。大隅国 `RS007` は `unknown + evidence_reviewed` であり、未調査の旧国（coverageの `unknown + not_researched`）と区別できる。旧29件の段階値はすべて空欄で、候補を機械的に昇格させていない。

## 大隅・隣接日向のEvidenceと解釈

| 範囲 | 確認したEvidence | 今回のAssessmentと留保 |
| --- | --- | --- |
| 西大隅・蒲生周辺 | 姶良市は1554年の岩剣城攻略、1557年の蒲生城攻略を記す（`E017`・`E018`）。[姶良市の概説](https://www.city.aira.lg.jp/hisho/closeup/yoshihirokou_close-up.html) は西大隅の「平定」に言及する。 | 貴久勢の進出候補 `C035` は影響度空欄。1560年の個別城館の保持、動員の範囲、現地勢力の従属を再確認する。 |
| 高山周辺 | [志布志市の考古資料](https://www.city.shibushi.lg.jp/uploaded/attachment/4479.pdf) は高山を肝付氏の本拠と記し、1561年から貴久との本格的な敵対、1562年の志布志取得、1574年の降伏を記す（`E022`）。 | 肝付氏勢 `C026` を高山周辺へ限定。1560年の城主・領域境界は未確定なので段階値空欄。肝付氏の本拠を大隅全域へ拡張しない。 |
| 菱刈院 | [伊佐市](https://www.city.isa.kagoshima.jp/politics/about/gaiyou/) と県の[菱刈関係文書翻刻](https://www.pref.kagoshima.jp/ab23/reimeikan/siroyu/documents/6756_20230112145720-1.pdf) は菱刈を大隅国に置く（`E019`・`E020`）。 | 旧 `C024` の薩摩国 `P66` を大隅国の `R16` へ訂正。ただし地名の確認だけで1560年の軍事影響度は決めない。県の[三州統一概説](https://www.pref.kagoshima.jp/ab23/pr/gaiyou/rekishi/tyuusei/sansyu.html) は菱刈を「北薩」として挙げるため、現代的な地理表現と旧国所属を区別した。 |
| 恒吉周辺 | 県の後代編纂史料は1558年の北郷氏と肝付氏の交戦を記す（`E021`）。 | 北郷氏勢 `C036` は別軍事主体の候補。1560年の関係や軍事範囲へ直接延長しない。原史料を未照合。 |
| **日向国諸県郡・志布志城周辺** | [志布志市の城史](https://www.city.shibushi.lg.jp/soshiki/22/1520.html) は豊州家島津氏の在城と1558年以降の肝付氏による反復攻撃、1562年の落城を記す（`E014`・`E015`）。[同市リーフレット](https://www.city.shibushi.lg.jp/uploaded/attachment/4479.pdf) も1538～1562年の豊州家在城を記す（`E016`）。[鹿児島県教育資料](https://www.edu.pref.kagoshima.jp/curriculum/kyoudo/suisin/kagoshimakenshi.pdf) で旧日向国所属を確認した（`E023`）。 | 豊州家 `C033=influential`、肝付氏 `C034=limited`、同じ城周辺の構造 `RS008=contested` を**採用保留のAssessment**として記録。志布志は大隅国内ではない。肝付氏の隣国への投射事例である。両市資料は豊州家の取得始期を1536年と1538年に分けるが、1560年を挟む保持と1562年の終期は一致する。 |

大隅国の `RS007=unknown` は、個々の拠点と近隣国への投射を確認しても国全体の `fragmented / contested / mixed` を判定するには、同時点の下位地域の範囲・重複・従属関係が足りないためである。志布志の `contested` を大隅へ移すことはできない。西大隅の攻略を `consolidated` へ、高山の本拠を肝付氏の国全体 `dominant` へ拡大しない。

## 島津氏の粒度と政治的権威

島津貴久勢 `A20` と豊州家島津氏勢 `A30` は、`actor_group=島津氏` の下で別 `actor_id` とした。[志布志市リーフレット](https://www.city.shibushi.lg.jp/uploaded/attachment/4479.pdf) は豊州家が1538年に北郷氏・肝付氏と協働して新納氏を攻め、島津本家の相続をめぐって薩州家側に立ったことを記す。志布志の保持と対肝付戦を貴久勢の一元的命令として扱う根拠はない。北郷氏 `A31` も軍事行動を確認できる別主体として置くが、豊州家との養子・協調関係から1560年の統合指揮を推定しない。加治木肝付氏は本宗家との別系統である可能性を確認したが、1560年の独立軍事意思決定を示す資料が足りずID化しない。伊地知氏 `A24` は従来候補のまま保持し、同時点の城館・活動範囲を確認するまで段階値を空欄にする。

[鹿児島県の概説](https://www.pref.kagoshima.jp/ab23/pr/gaiyou/rekishi/tyuusei/sansyu.html) は1363年に大隅国守護職が島津氏久へ譲られ、その後の三国守護職と島津諸家の内紛、1550年頃の貴久勢の限定的な実力、1574年の肝付氏降伏を記す。守護職の歴史と軍事的統一の時期は一致しない（`E024`）。ただし1363年の権原をそのまま1560年の貴久個人の法的地位と推定しない。政治的権原はEvidenceの文脈情報であり、`influence_status` に変換しない。将来の政治レイヤーで同じ場所・主体・時期IDを比較できる。

## 既存5ケースと未解決点

| ケース | 新スキーマでの扱い |
| --- | --- |
| 甲斐 | 甲府の館は拠点候補。武田晴信の甲斐全域での統合範囲は未確認。国構造は `unknown`。 |
| 尾張・三河 | 桶狭間前後の交戦と岡崎の命令権は別時点・別場所。両国の構造は `unknown`。 |
| 近江 | 江北の浅井氏と観音寺城周辺の六角氏は候補。境界と同一地域での競合を確認できず、`fragmented` とも `contested` とも決めない。国構造は `unknown`。 |
| 佐渡 | 河原田・羽茂の本間氏を別IDで維持。1560年の相互指揮・領域は未確認。国構造は `unknown`。 |
| 蝦夷地 | 勝山館・交易協定から全域の軍事統合を推定しない。構造は `unknown`。 |

重要な未読資料は大山智美「戦国大名島津氏の権力形成過程」（`S40`、CiNii書誌・抄録のみ）と鹿屋市『鹿屋風土記』（`S39`、PDF本文を今回取得できず）である。旧レビューに記した佐渡関係の `S17`・`S18`、PDFの `S24`・`S25`・`S27`、水野氏論文 `S29` も本文未読のまま。菱刈氏・伊地知氏・加治木肝付氏の1560年の軍事関係、北郷氏の当年の行動範囲、大隅内の地域構造を示す史料が残る。志布志市の1536年と1538年の取得始期の違いは、攻撃・降伏と領有開始の区別を含め原史料で照合する。

## 採用判断と次工程

今回の登録後はEvidence **24件**（+11）、主体別Assessment **33件**（+4）、地域構造Assessment **11件**（新設）、採用済みInfluence **0件**。旧国の調査段階は未調査53国、出典所在・候補確認8国、Evidence一部確認7国で、68国の全国本格入力は開始していない。影響度を暫定的に付けた `C033`・`C034` も `atlas_status=withheld` であり、Influenceへの昇格は0件。地域構造 `contested` の `RS008` も同じく表示保留。Evidenceの本文確認、時間、対象空間、対抗勢力、独立資料を点検してから昇格する。城への攻撃一件を即時に勢力圏へ変えない。

**A. スキーマをfreezeして全国入力へ進める。** ここでのfreezeは列と値域の研究用暫定固定であり、全国の勢力判定の完成や採用済みInfluenceの増加を意味しない。未調査と調査済みunknown、親国と下位地域、家名と軍事指揮主体、政治的権原と実効軍事活動を区別できた。全国入力時は、書誌探索・Evidence一次入力・`research_stage` と `knowledge_state` の一次更新に軽量モデルを利用し、出典照合を親が確認する。史料解釈、地域構造と主体影響度のAssessment、Influence昇格の判断は高性能モデルで行う。未読本文や原史料の照合は入力と並行して継続する。

Git追跡済み差分は引き続きなし。`sengoku-influence-atlas/` 全体が未追跡のため、今回の変更は同ディレクトリ内のCSVと設計・レビュー文書として確認する。コミット・pushは行わない。
