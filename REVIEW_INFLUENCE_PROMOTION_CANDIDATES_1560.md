# 1560年軍事Influence昇格候補監査

監査日：2026年9月27日。開始時のブランチは`main`、HEADは全国Assessment Phase 1の`4aad194d0ba1cb6daad9c37c25ab84eb0a036db3`、作業ツリーは清潔。Model Cのスキーマ・判定規則はfreeze済み。本レビューは**昇格候補の分類**であり、CSVの`atlas_status`は変更しない。

## Baselineと監査方法

| 指標 | 開始時 | 終了時 |
| --- | ---: | ---: |
| 主体Assessment | 39 | 39 |
| `direct`／`indirect` | 8／0 | 8／0 |
| `withheld`／`approved` | 39／0 | 39／0 |

`claims_1560.csv`の39行を`claim_evidence.csv`、`claim_sources.csv`、Evidenceの本文確認状態、出典の`review_scope`、actor・placeのID、relation、時間精度、`confidence`、`knowledge_state`、`caveat`と照合した。direct 8件は[広島県史年表S02](https://www.pref.hiroshima.lg.jp/soshiki_file/monjokan/nenpyou/nenpyou-cyusei2.pdf)、[岡崎市の制札解説S23](https://www.city.okazaki.lg.jp/bunka/torikumi_bunka/1004568/1004592/1004699/1004701.html)、[志布志市S32](https://www.city.shibushi.lg.jp/soshiki/22/1520.html)・[S33](https://www.city.shibushi.lg.jp/uploaded/attachment/4479.pdf)、[館山市S68](https://www.city.tateyama.chiba.jp/satomi/youyaku/4shou/4shou_2/4shou_2min.html)、[大東市S79](https://www.city.daito.lg.jp/site/history/2761.html)、[富山市S45](https://www.city.toyama.toyama.jp/etc/maibun/toyamajyo/history/sengoku2.htm)、[佐倉市S66](https://www.city.sakura.lg.jp/soshiki/bunkaka/bunkazai/jinbutsu/5732.html)の該当本文を再確認した。Class Aは**当該場所・時点・行動の限定的Influence**だけを候補とする。旧国全体や年末状態を採用する判定ではない。

表の出典記号は`本`＝本文または年表本文確認、`抄`＝検索抄録のみ、`概`＝講座概要、`目`＝目次のみ。複数のEvidenceを結ぶclaimでは、各行の役割を区別する。全行の`atlas_status`は`withheld`である。「追加確認なし」は次工程の採用ゲートで原Evidenceと対象範囲を再照合する通常確認を省く意味ではない。

## 39件全件監査表

| claim | actor・place | 時点 | mode／basis／強度 | Evidence・source | confidence／knowledge | Class | 理由と追加確認 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C003 | A02 今川義元勢／P10 三河 | unknown：桶狭間以前に限定。転換日と終了日は未確定 | —／—／— | E005；S24抄 | low／incomplete | B | 桶狭間前の西三河に限る候補。S24本文で軍事的関与と転換日を確認 |
| C004 | A03 松平元康勢／T02 法蔵寺 | event_anchor：旧暦7月9日の発給時点。成立・終了は未確認 | direct／direct_action／limited | E001・E006；S23本・S24抄・S02本 | medium／incomplete | A | S23本文の制札発給。法蔵寺での陣取禁止命令のみ。履行や岡崎支配は含めない |
| C005 | A04 緒川水野氏／P09 尾張 | unknown：年内の有効期間は未確定 | —／—／— | —；S04概 | low／incomplete | C | 広域講座から1560年のこの場所での行動を特定できない |
| C006 | A05 刈谷水野氏／P10 三河 | unknown：年内の有効期間は未確定 | —／—／— | —；S04概 | low／incomplete | C | 広域講座から1560年のこの場所での行動を特定できない |
| C007 | A06 常滑水野氏／P09 尾張 | unknown：年内の有効期間は未確定 | —／—／— | —；S04概 | low／incomplete | C | 広域講座から1560年のこの場所での行動を特定できない |
| C008 | A07 六角義賢勢／R05 江南 | unknown：年内の有効期間は未確定 | —／—／— | E008；S05本 | medium／incomplete | C | E008は1568年。1560年への遡及不可 |
| C009 | A08 浅井長政勢／R04 江北 | unknown：野良田合戦後。合戦の月日は未確認 | —／—／— | E007；S06本・S25抄 | medium／incomplete | B | S25抄録の局地軍事行動を原本文と年月で確認 |
| C010 | A09 江馬氏勢／P23 飛騨 | unknown：年内の有効期間は未確定 | —／—／— | —；S07本 | medium／incomplete | C | 地域史の広域説明。1560年の軍事行動・到達範囲が不足 |
| C011 | A10 三木氏勢／P23 飛騨 | unknown：年内の有効期間は未確定 | —／—／— | —；S08目 | low／incomplete | D | S08は目次のみ。本文根拠にならないため採用候補から除く |
| C012 | A11 檜山安東氏勢／P28 出羽 | unknown：年内の有効期間は未確定 | —／—／— | —；S09本・S21本 | medium／incomplete | C | 広域史の記述で1560年・当地の行動を特定できない |
| C013 | A12 湊安東氏勢／P28 出羽 | unknown：年内の有効期間は未確定 | —／—／— | —；S09本・S21本 | medium／incomplete | C | 広域史の記述で1560年・当地の行動を特定できない |
| C014 | A13 長尾景虎勢／P34 越後 | unknown：年内の有効期間は未確定 | —／—／— | —；S10本 | medium／incomplete | C | 富山城攻撃E029とは場所が異なる。越中全体へ広げない |
| C015 | A14 尼子晴久・義久勢／P41 出雲 | unknown：年内の有効期間は未確定 | —／—／— | —；S02本・S11本 | medium／incomplete | C | S02の家督継承から出雲の軍事Influenceを直接推定できない |
| C016 | A14 尼子晴久・義久勢／P42 石見 | unknown：年内の有効期間は未確定 | —／—／— | —；S02本 | medium／incomplete | D | 毛利への攻撃命令は尼子の石見到達を証明しない。この経路の推論は棄却 |
| C018 | A15 毛利元就・隆元勢／P49 安芸 | unknown：年内の有効期間は未確定 | —／—／— | —；S02本 | medium／incomplete | D | 祈願・寄進は軍事行動や当地への実力到達を証明しない。この経路の推論は棄却 |
| C019 | A16 長宗我部氏勢／P57 土佐 | unknown：年内の有効期間は未確定 | —／—／— | —；S12本 | low／incomplete | C | 広域沿革。1560年・当地の軍事行動が未特定 |
| C020 | A17 本山氏勢／P57 土佐 | unknown：年内の有効期間は未確定 | —／—／— | —；S12本 | low／incomplete | C | 広域沿革。1560年・当地の軍事行動が未特定 |
| C021 | A18 土佐一条氏勢／P57 土佐 | unknown：年内の有効期間は未確定 | —／—／— | —；S12本 | low／incomplete | C | 広域沿革。1560年・当地の軍事行動が未特定 |
| C022 | A19 土佐安芸氏勢／P57 土佐 | unknown：年内の有効期間は未確定 | —／—／— | —；S12本 | low／incomplete | C | 広域沿革。1560年・当地の軍事行動が未特定 |
| C023 | A20 島津貴久勢／P66 薩摩 | unknown：年内の有効期間は未確定 | —／—／— | —；S13本 | medium／incomplete | C | Eの中心は1550年。1560年への連続を未確認 |
| C024 | A21 菱刈氏勢／R16 菱刈院周辺 | unknown：年内の有効期間は未確定 | —／—／— | E019・E020；S13本・S36本・S37本 | low／incomplete | D | 地理的所属だけでは軍事Influenceを推定できない。この経路の推論は棄却 |
| C025 | A22 北薩渋谷氏勢／P66 薩摩 | unknown：年内の有効期間は未確定 | —／—／— | —；S13本 | low／incomplete | C | 1550年の背景から1560年の作用を推定できない |
| C026 | A23 肝付氏勢／R15 高山城周辺 | unknown：年内の有効期間は未確定 | —／—／— | E022；S13本・S33本 | medium／incomplete | C | 城の拠点性は年代未確定。1560年の軍事使用を未確認 |
| C027 | A24 伊地知氏勢／P65 大隅 | unknown：年内の有効期間は未確定 | —／—／— | —；S13本 | low／incomplete | C | 1550年の背景から1560年の作用を推定できない |
| C028 | A25 日向伊東氏勢／P64 日向 | unknown：年内の有効期間は未確定 | —／—／— | —；S13本 | medium／incomplete | C | 1550年・1577年の事象を1560年に内挿できない |
| C029 | A26 武田晴信勢／R01 甲府周辺 | unknown：1560年の特定日・統合範囲は未確認 | —／—／— | E004；S22本 | medium／incomplete | B | 長期間の居館記述だけでは1560年の軍事機能が不明。S22本文から当年の駐屯・指揮機能を探す |
| C030 | A27 河原田本間氏／R06 河原田周辺 | circa_year：1560年頃。正確な開始・終了は不明 | —／—／— | E010；S27抄 | low／incomplete | B | E010/S27は抄録。PDF本文で主体・年・城の軍事作用を確認 |
| C031 | A28 羽茂本間氏／R07 羽茂周辺 | unknown：1560年の直接確認なし | —／—／— | E009；S26本 | low／incomplete | C | E009は1510～1550年。1560年の行動が未確認 |
| C032 | A29 蠣崎季広勢／R09 上ノ国周辺 | unknown：16世紀の考古学的幅から1560年の日付を特定できない | —／—／— | E011・E012；S28本 | medium／incomplete | C | 城の長期使用と1551年交易は1560年の軍事Influenceに直結しない |
| C033 | A30 豊州家島津氏勢／R14 志布志城周辺 | approx_span：1530年代後半から1562年までの城保持。取得始期に資料差 | direct／direct_action／influential | E014・E016・E023；S32本・S33本・S41本 | medium／incomplete | A | S32/S33は開始年が異なるが1560年の豊州島津氏による志布志城保持で一致。城に限定 |
| C034 | A23 肝付氏勢／R14 志布志城周辺 | approx_span：1558年以降の攻撃のうち1560年の個別戦闘日は未確認 | —／—／limited | E015・E023；S32本・S41本 | medium／incomplete | B | 1558～1562年の反復攻撃を1560年へ機械的に配分できない。1560年の個別攻撃を特定 |
| C035 | A20 島津貴久勢／R13 西大隅・蒲生周辺 | unknown：1560年の拠点保持を直接示す同時代史料は未照合 | —／—／— | E017・E018；S34本・S35本 | low／incomplete | C | E017/E018は1557年・1554年。1560年の作用が未確認 |
| C036 | A31 北郷氏勢／R18 恒吉周辺 | unknown：1558年の交戦を1560年へ延長しない | —／—／— | E021；S38本 | low／incomplete | C | E021は1558年。後年編纂資料から1560年へ延長しない |
| C037 | A65 北条氏康勢／R19 久留里城周辺 | month_event：1560年5月の攻撃事実に限定 | direct／direct_action／limited | E052；S68本 | medium／incomplete | A | S68本文の1560年5月久留里攻撃。上総全体や継続支配は含めない |
| C038 | A01 織田信長勢／R02 桶狭間周辺 | day_event：旧暦1560年5月19日の交戦時点 | direct／direct_action／limited | E001；S02本 | medium／incomplete | A | S02年表の旧暦5月19日桶狭間での交戦。R02の合戦時点のみ |
| C039 | A02 今川義元勢／R02 桶狭間周辺 | day_event：旧暦1560年5月19日の交戦時点 | direct／direct_action／limited | E002；S02本 | medium／incomplete | A | S02年表の旧暦5月19日桶狭間での交戦。敗戦後の今川勢力残存は含めない |
| C040 | A68 三好長慶勢／R20 飯盛城周辺 | year_event：1560年内の時点不明。年中保持を推定しない | direct／direct_action／limited | E054；S79本 | medium／incomplete | A | S79本文の1560年飯盛城入城を伴う軍事行動。河内全域や通年状態は含めない |
| C041 | A13 長尾景虎勢／R21 富山城周辺 | year_event：1560年内の攻城時点。年中継続を推定しない | direct／direct_action／limited | E029；S45本 | medium／incomplete | A | S45本文の1560年富山城攻撃。後称上杉謙信は当年の長尾景虎に対応。越中全体は含めない |
| C042 | A53 正木氏勢／R22 香取周辺 | year_event：1560年の侵攻。別の博物館資料は10月と記すがE051自体は年… | direct／direct_action／limited | E051；S66本 | medium／incomplete | B | S66本文は正木氏の香取侵攻を示すが、A53の枝・指揮主体が未特定。主体同定を追加確認 |

## Class A：次工程で審査する昇格単位

以下は現行Assessmentを直ちに`approved`へ変更する決定ではない。次工程では各単位ごとに原Evidenceと対象範囲を再照合し、軍事的行動の発生時点に限って判定する。全件の`knowledge_state=incomplete`は維持し、周辺地域・年内継続・命令履行を追加推論しない。

| claim | 限定的な昇格単位 | 根拠と境界 |
| --- | --- | --- |
| C004 | 松平元康勢・法蔵寺・旧暦1560年7月9日の制札発給時点・`limited` | E006/S23の陣取禁止命令。命令の履行、岡崎・三河の支配は対象外 |
| C033 | 豊州島津氏・志布志城・1560年を含む城保持期間・`influential` | E014/E016、S32/S33の一致部分。開始年の相違は留保し、志布志周辺へ拡張しない |
| C037 | 北条氏康勢・久留里城・1560年5月の攻撃時点・`limited` | E052/S68。上総全体と攻撃後の保持は対象外 |
| C038 | 織田信長勢・桶狭間・旧暦1560年5月19日の交戦時点・`limited` | E001/S02。戦場の行動に限定 |
| C039 | 今川義元勢・桶狭間・旧暦1560年5月19日の交戦時点・`limited` | E002/S02。敗戦後の支配継続を含めない |
| C040 | 三好長慶勢・飯盛城・1560年の追放・入城時点・`limited` | E054/S79。河内全域や通年保持を含めない |
| C041 | 長尾景虎勢・富山城・1560年の攻城時点・`limited` | E029/S45。出典の後称「上杉謙信」を当年の主体へ対応させ、越中全域は含めない |

## Class B：追加調査を絞る6件

- C003：S24の本文で桶狭間前の西三河における今川勢の軍事的関与と転換時点を確認する。
- C009：S25の抄録が指す原本文を読み、当該主体・場所・1560年の行動を確認する。
- C029：S22の居館史から1560年の駐屯・指揮など軍事機能を特定する。居館の存在だけで昇格しない。
- C030：S27のPDF本文で軍事行動の主体・年・城との関係を確認する。抄録だけでは判断しない。
- C034：S32の反復攻撃のうち1560年に発生した個別事象を日付または当年の記録で特定する。
- C042：S66の「正木氏」の枝・指揮主体を同定し、A53との対応を確認する。香取郡全体の占拠を年内全期間へ延長しない。

Class Cの22件は広域・異年・長期使用・年代不明などの記述を保持する。1560年の該当場所における軍事行動が出ない限り、昇格候補にはしない。Class DのC011・C016・C018・C024は、それぞれ目次のみ、別主体への命令からの飛躍、祈願・寄進からの飛躍、地理的所属からの飛躍という**現行の推論経路**を採用しない。元データの削除や史実の否定ではない。

## indirect候補と二重計上

`indirect`への新規候補は**0件**。従属・同盟・指揮関係を軍事Influenceへ移すには、関係が当該時点・場所で実際に軍事作用を生んだEvidenceが必要である。今回の39件にはその組合せがない。C042の正木氏と里見氏の関係、C033の豊州島津氏と宗家の関係も、関係そのものから主体を追加しない。

C038とC039は同一の桶狭間合戦の対向する二主体であり、同一主体の二重計上ではない。ただし戦場の交戦を二つの独立した支配領域として合算しない。C037のE052は一つの攻撃であり、同じ軍勢を別の地域・時点へ複製しない。C033の城保持とC034の攻撃は行動と主体が異なり、重複するInfluence面積へ変換しない。空欄の`force_group_id`を独立軍勢の証拠とは扱わない。今回、新しいforce groupの作成や既存IDの付け替えは不要。

## 判定

39件の内訳は**A 7件、B 6件、C 22件、D 4件**。Class Aが1件以上あるため全国一括の判定は**A（限定的昇格候補あり）**とする。これは次工程への審査入口であり、今回の`approved`は**0件**のまま。Model Cのfreezeを維持し、スキーマ・判定規則は変更しない。次工程ではAの7単位だけを対象に、原Evidence・時点・場所・主体・force groupの採用ゲートを再確認する。Bは上記6点の追加調査に分け、C/Dは現状のAssessmentとして保持する。
