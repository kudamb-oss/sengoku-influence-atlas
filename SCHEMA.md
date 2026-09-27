# 1560年軍事レイヤーのデータ設計

**Model Cスキーマ・判定規則の状態：freeze済み（2026年9月27日）。** 根拠と適用限界は`REVIEW_ASSESSMENT_MODEL_C_FINAL_1560.md`に記す。freezeは全国Assessmentの実施や個別Influenceの`approved`を意味しない。新しい史料による個別判定の更新は許すが、規則の変更は別途レビューする。

## 変更の理由

初版の `claims_1560.csv` は、桶狭間の交戦や石見の合戦停止命令を `confirmed` として軍事的影響の候補と同じ表に置いていた。出来事の確認は、その場所への継続的な軍事力投射や地域支配を証明しない。また、年だけでは桶狭間前後、旧国だけでは江北・江南や佐渡の諸本間、蝦夷地の館と諸集団を区別できない。このため、証拠・評価・アトラス表示を次のように分ける。

| 段階 | 保存先 | 意味 |
| --- | --- | --- |
| Evidence | `data/evidence_1560.csv` | 文献・史料・考古資料から確認した限定的な記述。`review_status` は本文を確認したか、検索抄録のみかを示す。 |
| Assessment | `data/claims_1560.csv` | Evidenceから導いた場所・主体・期間を限定した軍事的影響の候補。複数のEvidenceを `data/claim_evidence.csv` で結ぶ。 |
| Influence | `claims_1560.csv` の `atlas_status=approved` 行のみを読む派生結果 | 研究上の評価をアトラスに採用する段階。現在は0行。別CSVを増やさず、承認までは描画・数値化しない。 |

Evidenceに1件以上の出典を必ず紐付ける。現段階では証拠1行につき主たる `source_id` 1件とし、別資料による独立の確認は別Evidence行にして両方をAssessmentへ結ぶ。Assessmentには既存の `claim_sources.csv` で複数の文献を付けられる。EvidenceとAssessmentの文章は、出典が何を述べるかと本研究が何を推定するかを混ぜない。

旧 `C001`・`C002`・`C017` は、それぞれ `E001`・`E002`・`E003` へ移した。IDを再利用しない。旧版の `confirmed` 3件は**史料上の行動**についての確認で、勢力圏の確定3件ではなかった。旧 `status=uncertain` は研究上の未確定を表すため、`knowledge_state=incomplete` に移した。旧 `influence_status` の日本語自由記述は `assessment_note` に保持し、新しい段階値へ機械的に変換しない。`atlas_status=withheld` は表示保留、`approved` は研究レビューを終えた表示可を表す。

## 独立した四つの判定軸

| 軸 | 場所 | 値と意味 |
| --- | --- | --- |
| 主体の軍事影響度 | `claims_1560.csv` の `influence_status` | `dominant`＝限定した場所の大部分で継続的な軍事上の優位を示す、`influential`＝拠点保持または継続的な軍事力投射を示すが優位の証明はない、`limited`＝局地への軍事力投射を確認できるが継続的保持・優位は示せない。判定できなければ空欄。`unknown` や `uncertain` は入れない。 |
| 確信度 | 両Assessment表の `confidence` | `high`＝複数の独立資料と時空間の一致、`medium`＝読めた公的・学術資料が主張を直接支えるが範囲や日付に留保、`low`＝間接証拠または時点の推定を含む。判定自体ができなければ空欄。確率や支配率ではない。 |
| 研究上の知識 | `knowledge_state` | `known`＝対象を限定して必要な証拠と反証を確認、`incomplete`＝一部確認したが範囲・期間・反証等が残る、`unknown`＝対象について判定材料がないか不足し解釈できない。史実上の分裂・不在を意味しない。 |
| 地域全体の構造 | `region_structure_1560.csv` の `region_structure` | `consolidated`、`fragmented`、`contested`、`mixed`、`unknown`。個々の主体の影響度とは別の地域Assessment。 |

`coverage_1560.csv` の `research_stage` は `not_researched`（未着手）、`sources_identified`（所在・候補を確認）、`evidence_reviewed`（本文・証拠を一部確認）を使う。`knowledge_state=unknown` と `research_stage=not_researched` の組は未調査、`unknown` と `evidence_reviewed` の組は調査したが判定不能を表す。`knowledge_reason` に資料欠落、異説、時点不一致などの理由を書く。`known` でも全旧国の網羅を意味せず、対象場所・主体・時点を限定して用いる。

地域構造は、`consolidated`＝ほぼ一つの軍事指揮主体または実証済みの強い連合が対象地域の大部分で優勢、`fragmented`＝複数勢力の実効圏が異なる下位地域に分かれる、`contested`＝同じ場所に複数勢力が軍事力を投射し単純な分割では表せない、`mixed`＝分割と重なりの双方をそれぞれ証拠で示せる場合、`unknown`＝どれか判定不能、とする。城への攻撃だけを旧国全体の `contested` に拡大しない。`mixed` は未知部分を埋める便宜的な値として使わない。

`region_structure_1560.csv` は `place_id` ごとに構造を記す。ここにも `research_stage` を置き、たとえば `region_structure=unknown / research_stage=evidence_reviewed / knowledge_state=unknown` なら調査済みだが構造判定不能と読める。同じ場所の `coverage_1560.csv` は軍事主体なども含む調査全体の進度なので、知識状態が異なってよい。`structure_evidence.csv` でEvidenceを複数結べる。地域構造もAssessmentなので `atlas_status=approved` まで図に採用しない。下位地域のAssessmentから親国の構造を自動生成しない。`claims_1560.csv` の `influence_status` が空欄でも候補Assessmentは保持でき、段階値を仮置きしても `withheld` の間はInfluence件数に数えない。昇格には直接の軍事Evidence、対象の時空間、対抗勢力、資料の独立性、推論の飛躍を再点検する。

## 時間

`evidence_1560.csv` の `date_start`・`date_end` はその記述が指す時期の両端を表す。`date_precision` と `calendar` を必ず併読する。`japanese_lunisolar` とある月日を現行暦の日付として解釈しない。年だけ、概年、数十年に及ぶ考古編年、始期不明も許す。検索抄録からの年内変化は確実な境界日を補わない。

Assessmentの `valid_from`・`valid_to` は影響の成立・終了が**資料で限定できるときだけ**記入する。片側が空欄なら不明であり、無期限の継続を意味しない。`time_precision` と `time_note` に「合戦後」「1560年頃」などを残す。`year=1560` は検討対象年を示すだけで、年中有効とは読まない。`snapshot_date` は将来の断面を取り出す際の入力日時とし、行に重複保存しない。1560・1565・1570・1575・1580・1582年の粗い断面を基本とし、変化のある場所だけ月日を調べる。

桶狭間の交戦は旧暦1560年5月19日のEvidence、法蔵寺制札は旧暦7月9日のEvidenceとして記録した。したがって1月と12月を同一状態とする年次一色塗りはできない。ただし制札1通から松平氏の三河全域支配や12月までの継続を推定しない。

## 地域と主体

`places.csv` は `JP → province / external_region → historical_region → 必要に応じて郡 → stronghold / site` の親子関係を表す。`historical_region` は江北・江南、河原田周辺、上ノ国周辺など、資料を読むための中間地域である。必ずしも相互排他的な面を覆う区画ではなく、境界線を確定したとみなさない。ひとつの軍事主体が複数地域に影響する場合はAssessmentを複数行に分ける。越境・競合も複数行と `relation_note` で表し、行政境界に切り揃えた領有ポリゴンを推定しない。城・寺社を親国全体の代理にしない。

`external_region` の蝦夷地には道南の地域・館を子として置ける。和人の居住・交易、蠣崎氏の軍事的到達、アイヌ諸集団の活動は別の問いとして扱う。勝山館の遺構・アイヌ墓、1551年の交渉は、蝦夷地全域を蠣崎氏が支配した証拠ではない。ハシタイン・チコモタインは史料上の交渉主体としてEvidenceに記すが、1560年の軍事意思決定を個別に確認できないため `actors.csv` に追加しない。

`actors.csv` の `actor_group` は家名を検索するための分類であり、軍事的統合キーではない。河原田本間氏と羽茂本間氏は別 `actor_id` を持つ。ただし両者の1560年の軍事的自律性は未確認のため `actor_type=地域領主候補`、Assessmentの `knowledge_state` は `incomplete` とする。豊州家島津氏勢と島津貴久勢も別IDとし、島津氏という家名だけで軍事指揮を統合しない。久知・雑太などは文献上の候補としてレビューに記し、年次の裏付けが増えるまで主体IDを増やさない。

## 書誌・調査進捗・将来の軍事基盤

`sources.csv` は全レイヤー共通の書誌マスターである。`review_scope` は本文確認、検索抄録のみ、書誌のみを区別し、未確認の出版年・頁・識別子を補完しない。`claim_sources.csv` はAssessmentと文献を多対多で結び、`claim_evidence.csv` はAssessmentとEvidenceを多対多で結ぶ。直接的証拠のない既存候補はEvidenceリンクなしでも保持するが、`atlas_status=withheld` とする。

`coverage_1560.csv` は旧国・旧国制外地域の**調査進捗**である。旧 `partial` は `sources_identified` または `evidence_reviewed` と `incomplete` に移し、旧 `unknown` は `not_researched` と `unknown` に移した。未調査と調査済み判定不能を分けるため、新たに `research_stage` と `knowledge_reason` を置いた。`absent` は知識状態ではなく、明示的な不在証拠を扱う将来の別判定に限る。

軍事基盤レイヤー本体はまだ作らない。主体間関係の試験台帳を次節で追加するが、直轄地・一門領・家臣知行・城館の保持を網羅する表は作らない。勢力圏の**広さ**と内部の**統合度**は別の尺度として評価する。家名の一致や館の所在だけで従属・動員力を決めない。

## 主体間関係と多層Influenceの試験スキーマ

この節は全国Assessment前の4ケース試験に用いる最小追加である。判定の目的と留保は`REVIEW_ASSESSMENT_MODEL_1560.md`、試験結果は`REVIEW_ASSESSMENT_FREEZE_1560.md`に記す。旧Evidence Baselineの行と既存Assessmentの未判定値は遡及変換しない。

`data/actor_relations_1560.csv`は二つの軍事主体間で**史料が述べる関係**を記録する。`actor_a_id`・`actor_b_id`は`actors.csv`への参照であり、同一家名でも別の軍事意思決定単位を維持する。`direction=a_to_b`はAからBへの権限・働きかけ、`mutual`は相互の同盟・敵対を示す。`place_scope_id`は関係を示した場所の範囲で、空欄は全国一律の関係を意味しない。関係型は`direct_command`、`subordinate`、`semi_autonomous_subordinate`、`branch_family`、`alliance`、`hostile`、`contested_allegiance`、`nominal_authority`、`religious_network`、`intermediary`を候補とする。`intermediary`はAがBを通じて`target_actor_id`の第三者へ働きかけた事実で、命令権を含まない。`target_actor_id`はこの関係型でのみ必須とし、他では空欄にする。史料の文言が細分を支えなければ、より狭い関係型を推定しない。`unknown`は存在する辺として登録しない。

`valid_from`・`valid_to`は関係が**資料で確認できる時点・幅**だけを示し、記録されない期間の継続を意味しない。`time_precision=year_event`・`month_event`はその年・月の出来事、`year_start_only`は成立年だけが判明し終期未確認、`approx_span`は反復記事等の概括的な幅、`undated`は年次未特定とする。始期・終期を推測で補わない。`knowledge_state`と`confidence`は関係記述の知識状態と資料適合度であり、**1560年の軍事指揮の確認度ではない**。`command_scope=demonstrated`は当該場所・時期・行動への実効的な命令・動員等が別に実証されたときだけ、`unverified`は未確認、`not_applicable`は敵対等の非上下関係に使う。被官・代官・分家・同盟・宗教的結合だけで`demonstrated`にしない。関係が変化・離反した場合は新しい関係行を作り、以前の行の終期が判明しないなら空欄のまま留保を付ける。異なる日付精度を現行暦の厳密な順序と誤読しない。

`data/actor_relation_sources.csv`は`relation_id`、`source_id`、`locator`、`evidence_role`で関係の根拠本文を追う。一関係に複数出典を付けられる。`data/actor_relation_evidence.csv`は既存Evidence行が**両端の主体・関係・時期**を実際に支える場合だけ結ぶ。例えばE052は北条氏康勢による里見氏拠点への1560年5月の攻撃を一行で述べる。関係と地域Assessmentの根拠を機械的に共有しない。関係出典が本文未確認の場合、関係の確定根拠としない。

`data/claims_1560.csv`には次の空欄許容列を追加した。既存33行の未判定値は空欄のままとし、代表ケースに限って根拠を確認した行へ記入する。

| 列 | 値・制約 |
| --- | --- |
| `influence_mode` | `direct`、`indirect`、空欄。空欄は判定不能。関係の存在から自動設定しない |
| `influence_basis` | `direct_action`＝主体自身の軍事行動・軍事的強制・拠点保持、`direct_command`＝当該部隊への具体的な指揮、`relation_mediated`＝別主体の行動への実効的介入、または空欄。`direct_action`と`direct_command`は`direct`、`relation_mediated`は`indirect`と組み合わせる |
| `basis_relation_id` | `direct_command`・`relation_mediated`の場合は実証された関係行のIDが必須。`direct_action`では空欄とする。関係行だけでなく、当該行動・対象地域・時期のEvidenceも必要 |
| `force_group_id` | **同一の実行戦力による一つの作戦**を複数主体へ帰属表示するとき、同じIDを共有する。敵対する別戦力は別ID。空欄は独立戦力であるとの証明ではなく、重複可能性の監査対象 |

`direct_command`には指揮者と現地部隊の対応、命令内容、場所・時期を示す本文を要する。`relation_mediated`には単なる従属を超える命令・動員・援軍・補給・撤退・目標変更等の実効的介入と、現地の実行行動の両方を要する。関係の多段経路を自動伝播させない。`basis_relation_id`の関係に`command_scope=unverified`しかなければ、`direct_command`・`relation_mediated`の判定は作れない。強度は現地行動・継続性・対抗勢力を評価して別に決め、上位主体へコピーしない。

集計の最小単位は主体Assessmentの行数ではない。同じ`force_group_id`に属する現地実行と上位の直接指揮・間接介入は、同じ軍事力として1回だけ数える。別陣営は同じ戦闘を扱っても別IDとする。複数行の同一性を確認できない場合は勢力数・兵力・占有面積を数値化せず、`atlas_status=withheld`とする。今回`force_group_id`は単一Evidenceに基づく試験の印としてのみ記入し、作戦台帳や数値集計は実装しない。

## 最終調整：関係継続と年内変化

関係の存在、1560年の関係継続、個別作戦の上位主体への帰属は別々に審査する。直接命令が現存しなくても、直近の同一主体間の軍事的上下関係、当主・権限の継承、対象期間の反証探索、現地主体の行動がそろえば、関係の継続を**限定的な推定**として扱える。被官・守護・代官・同一家・同盟という名称だけからは推定しない。探索は資料名・該当箇所・対象期間・両主体・離反や独立などの探索結果を記録する。単なる検索結果ゼロは反証探索の完了ではない。

`actor_relations_1560.csv`の`continuity_review_status`は、`not_reviewed`（変化未調査）、`insufficient`（調査したが時期・継承・範囲が不足）、`reviewed_no_contradiction`（直近関係と所定範囲の反証探索を確認）、`contradicted`（離反等の反証あり）、`conflicted`（史料競合）とする。`continuity_review_scope`には資料ID、期間、主体、探索内容と限界を簡潔に記す。根拠本文は`actor_relation_sources.csv`へ結ぶ。`reviewed_no_contradiction`も「継続を証明した」ではなく、記録した探索範囲内の暫定判断であり、後出Evidenceで再審査する。空欄や`not_reviewed`を反証なしに読み替えない。現在の関係7行に継続推定適格例はない。既存の`knowledge_state`は関係記述自体の知識、`command_scope`は個別指揮の確認であるため、反証探索の進捗を表すこの1列と探索範囲の1列を別に置く。

`influence_basis`には既存値に加え、`relation_continuity`を認める。`indirect`との組だけに用い、`basis_relation_id`、現地の行動Evidence、関係の直近確認と`continuity_review_status=reviewed_no_contradiction`、時点・場所の整合、反証・当主交代の再点検を必須とする。直接命令の存在を主張せず、上位主体の影響を暫定的に表示する経路であり、原則`confidence=medium`以下とする。古い関係、当主交代、軍事行動との時間差、弱い関係型は`low`または判定不能へ下げる。関係が続いても行動の独自性を示す資料がある場合、その行動の上位帰属は作らない。敵対、離反、処罰、同盟のみ、または探索不足の場合も同様である。`autonomous`・`contradicted`・`unknown`は上位Influenceの根拠値ではないため`influence_basis`へ入れない。現地の独自行動は現地主体の`direct_action`とEvidence、上位帰属の却下理由は関係レビューと`inference_note`に記録し、判断不能の上位claimは空欄・`withheld`に保つ。これらを空欄だけから「独立」と解釈しない。

行動前の命令は当該行動の指揮を示し得る。行動中の共同作戦・援軍・補給は介入を示し得るが、実行主体と上位主体の区別を残す。行動後の戦果報告・感状・褒賞・知行加増・事後承認は、当該行動を上位主体が認知・評価した証拠にはなるが、単独で事前命令を証明しない。独断行動の処罰・制裁は統制権を示し得ても、その行動を上位主体の投射に加算する反証となる。各Evidenceの対象作戦・時期・主体が一致しなければ帰属させない。

年内の変化は旧関係・変化Evidence・新関係を別記し、各行の`valid_from`・`valid_to`は**確認された時点だけ**に限る。最終確認と次の初確認の間は、明示的な継続根拠がない限り`unknown`区間である。月・日不明の1560年離反は年内の順序だけを示し、1月から旧関係または12月まで新関係と埋めない。旧暦と現行暦を混用しない。離反・敵対化のEvidenceは古い継続推定より優先し、旧関係を年全体へ延長しない。

年次アトラスは元の時系列Assessmentを正本とし、断面表示を派生させる。`stable`は対象区間を通じて同じ関係が確認できる場合、`transition`は年内の変化、`contested`は同時点で異なる軍事主体の競合、`unknown`は資料不足または未確認区間を示す**表示上の状態**であり、`region_structure`の新値ではない。`year=1560`だけで年初・年末を補わない。任意時点の単一状態を要求する処理は、確認済みの該当時点だけを返し、それ以外を`unknown`または複数候補として返す。年末・最長期間・最大勢力を無条件に代表値としない。

上位`indirect / relation_continuity`と現地`direct / direct_action`が同一の実行戦力・作戦を表示する場合、両claimに同じ`force_group_id`を付ける。表示行は二つでも独立戦力は一つである。作戦同一性が未確認なら数値集計と上位帰属の昇格を保留し、空欄IDを別戦力として数えない。敵側は別IDとする。`basis_relation_id`は作戦同一性の代用にならない。
