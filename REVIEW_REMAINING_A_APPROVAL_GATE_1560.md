# 1560年軍事Influence・残存Class A候補の最終採用ゲート

監査日：2026年9月27日。対象はC003・C042の2件のみ。Model Cのfreeze済み規則に従い、既に本文確認したEvidenceが支える採用範囲を審査した。

## Baseline

開始時は`main`、HEAD `1215e86308027492ffc092631604c613a071bdcf`、作業ツリーclean。`git status`、`git branch --show-current`、`git log --oneline -12`で確認した。Assessment 39件、`approved=8`、`withheld=31`、`direct=9`、`indirect=0`。[SCHEMA.md](SCHEMA.md)、[昇格候補監査](REVIEW_INFLUENCE_PROMOTION_CANDIDATES_1560.md)、[初回採用ゲート](REVIEW_INFLUENCE_APPROVAL_GATE_1560.md)、[Class B追加調査](REVIEW_CLASS_B_FOLLOWUP_1560.md)、[第2回採用ゲート](REVIEW_INFLUENCE_APPROVAL_GATE_2_1560.md)、[残存Class B調査](REVIEW_REMAINING_CLASS_B_EVIDENCE_1560.md)および対象CSVを確認した。Model Cはfreeze済み。

## Gate定義

G1主体、G2年・時間、G3場所、G4軍事作用、G5 mode・basis・強度、G6時間境界、G7 Evidence品質、G8反証、G9二重計上、G10一文の採用範囲を個別に判定する。PASSは限定文に対する判定であり、親地域の全面支配や年中継続の承認ではない。

## C003：今川義元勢／岡崎城

| Gate | 判定 | 根拠・限定 |
| --- | --- | --- |
| G1 主体 | PASS | [岡崎市S24](https://www.city.okazaki.lg.jp/_res/projects/default_project/_page_/001/014/630/03-1dai1sho2-20260401.pdf)PDF34頁・印刷46頁は、岡崎城代が今川氏の有力家臣で、義元戦死後に今川勢が城から撤退したと記す。A02は義元**本人**ではなく「今川義元勢」という当主勢力のactorであり、城代を通じた城保持を帰属できる。城代の実名・義元個人の現地行動は主張しない。 |
| G2 年・時間 | PASS | 同頁は城代と今川氏による西三河支配が永禄3年の桶狭間まで続き、戦死後の撤退を記す。採用は1560年内の桶狭間以前の確認可能な保持時点。 |
| G3 場所 | PASS | P10「三河」は過大。R03「岡崎周辺」の下にT12「岡崎城」を追加し、C003・E059をT12へ揃えた。 |
| G4 軍事作用 | PASS | 城代を置いて城を保持した事実を、Model Cの「拠点保持」として評価する。単なる旧国所属・家系・義元本人の出陣とはしない。 |
| G5 mode・basis・強度 | PASS | `direct / direct_action / influential`。S24の城代配置、桶狭間までの今川氏の西三河支配、戦後の岡崎城撤退を合わせ、城という一点での拠点保持を評価する。城代個人の在任期間や岡崎周辺・西三河への優位を確定しない。 |
| G6 時間境界 | PASS | 義元戦死から今川勢撤退までの日数、1560年末の状態、城代配置の開始日を補わない。`valid_from`・`valid_to`は空欄。 |
| G7 Evidence品質 | PASS | S24改版PDFの本文を画像で確認したE059が城代・撤退を支える。E005の広域支配叙述だけに依存しない。 |
| G8 反証 | PASS | 既存C004は義元戦死後、旧暦7月9日に元康勢が法蔵寺で制札を発給した別時点・別場所の行動であり、桶狭間以前の今川方岡崎城保持と矛盾しない。採用文を妨げる反証は確認できない。 |
| G9 二重計上 | PASS | 岡崎城代の個人actorや元康勢への二帰属を作らない。尾張の大高城兵糧入れは本claimに加えない。 |
| G10 採用文 | PASS | 下記一文はactor・場所・時間・軍事作用と強度をE059の範囲に限定する。 |

**最終判定：PASS。今川義元勢は、桶狭間以前の永禄3年（1560）に確認できる保持時点に、岡崎城で城代を通じて`influential / direct_action`の軍事Influenceを行使した。**

城代の具体名・軍令、西三河全域への作用、義元戦死後の撤退日を採用しない。`knowledge_state=incomplete`を維持する。

## C042：正木氏勢／香取領

| Gate | 判定 | 根拠・限定 |
| --- | --- | --- |
| G1 主体 | PASS | [千葉市立郷土博物館S112](https://www.city.chiba.jp/kyodo/katsudo/kenkyuin.html)は永禄3年10月の香取侵攻の主力を「正木氏」と記す。A53「正木氏勢」はこの資料の集合表記に対応する。特定の枝・指揮者を含意しない。 |
| G2 年・時間 | PASS | S112/E058は永禄3年10月を明示。[多古町史S114](https://adeac.jp/tako-town/texthtml/d100010/mp000010-100010/ht000610)/E060は時忠の年内侵入を記すが、10月とは記さない。両者を合成して時忠の10月指揮とはしない。 |
| G3 場所 | PASS | S112の「香取領への侵攻」にR22「香取周辺」を索引として用い、`spatial_note`を侵攻が及んだ範囲へ限定する。領全体・全城郭の占拠は含めない。S114の小見川城を10月作戦の確定地点として付けない。 |
| G4 軍事作用 | PASS | 正木氏を主力とする侵攻は局地への軍事力投射であり、同盟や系譜だけの記述ではない。 |
| G5 mode・basis・強度 | PASS | `direct / direct_action / limited`。侵攻から継続的な保持・優位を推定しない。 |
| G6 時間境界 | PASS | 旧暦10月の侵攻時点のみ。侵攻日、終了日、1560年末と1566年までの占拠範囲は補わない。 |
| G7 Evidence品質 | PASS | E058/S112は博物館研究員の本文確認済み記述。E051/S66も1560年の正木氏侵攻を記す。E060/S114は人物同定の別記事として扱い、10月の主張の根拠にはしない。 |
| G8 反証 | PASS | 資料間で10月主力の個人名は確定しないが、「正木氏が主力」の記述を否定する重大な競合は確認できない。 |
| G9 二重計上 | PASS | A53だけをこの10月侵攻の承認actorとする。時茂・時忠・時定の個人actorを別に作って同じ侵攻を重複計数しない。里見氏への上位帰属も作らない。 |
| G10 採用文 | PASS | 下記一文は集合actorの正木氏勢、旧暦10月、香取領への侵攻時点に限定する。 |

**最終判定：PASS。正木氏勢は、永禄3年（1560）旧暦10月の香取領への侵攻時点に、その侵攻が及んだ場所で`limited / direct_action`の軍事Influenceを行使した。**

A53を集合actorのまま維持するのは、S112が個人名を記さず、S114の時忠を10月の同じ軍勢へ固定できないためである。集合actorの承認は正木諸家を単一の常設軍に統合する意味ではない。小見川城保持はS114が年内に記すが10月への同日化はしない。

## CSV変更

C003はT12を追加して`place_id`をP10からT12へ変更し、E059も同じplaceへ揃えた。`influence_status=influential`、`influence_mode=direct`、`influence_basis=direct_action`、`time_precision=approx_span`、`atlas_status=approved`とし、採用範囲に合わせて時間・空間・判断注記を更新した。C042はA53・R22を維持し、旧暦10月の侵攻に合わせ`time_precision=month_event`、`atlas_status=approved`、時間・空間・判断注記を更新した。新規actor・source・Evidence・relationはない。Schemaとregion structureは変更しない。

## indirect / force group監査

C003の岡崎城保持と元康勢の尾張での兵糧入れは同じ場所・行動の二帰属ではない。C042のS112は「里見氏による侵攻で正木氏が主力」と記すが、館山市の解説には正木氏の強い独立性があり、作戦固有の命令・動員等を確認できない。AR007は1560年5月の出陣要請仲介であり、旧暦10月の香取侵攻に流用しない。`indirect`、`basis_relation_id`、新たな`force_group_id`は設定しない。空欄のgroup IDを独立戦力の証明とせず、二行の支配面積への変換もしない。

## 既承認claimへの影響

今回の本文照合ではC004その他approved claimへの重大な反証を確認しない。C003の桶狭間以前の岡崎城保持とC004の義元戦死後の制札発給は時点・場所・行動を分ける。既承認行の状態は変更しない。

## Model Cへの影響

当主勢力への城代拠点保持の帰属、集合actorの限定的採用、時間・場所の縮小、上位帰属の保留は現行Schemaで表現できる。Evidence不足による個人・上下関係の留保をSchema不足としない。freeze再検討は不要。

## 最終判定

| claim | 判定 | 承認した範囲 |
| --- | --- | --- |
| C003 | **PASS** | 桶狭間以前の1560年の岡崎城代による城保持のみ |
| C042 | **PASS** | 1560年旧暦10月の正木氏勢による香取領侵攻のみ |

整合性監査ではCSV列数、ID重複、actor・place・source・Evidence・claim・relation・structure参照、approved全件のEvidence紐付け、`git diff --check`を確認する。変更後はAssessment 39件、`approved=10`、`withheld=29`、`direct=10`、`indirect=0`。

## 次工程

この2件の採用ゲートは完了。残るC030・C034はClass Cとして停止し、新しい個別の軍事Evidenceが見つかった場合だけ別途再審査する。全国調査やModel Cの再設計には進まない。
