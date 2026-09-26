# 1560年軍事レイヤーのデータ設計

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

軍事基盤レイヤーはまだ作らない。将来は同じ主体・場所IDで、関係（主従・同盟・対立）と保持（直轄地・一門領・家臣知行・城館）を時期・出典付きで別表にする。勢力圏の**広さ**と内部の**統合度**は別の尺度として評価する。家名の一致や館の所在だけで従属・動員力を決めない。
