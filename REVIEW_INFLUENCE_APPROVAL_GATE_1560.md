# 1560年軍事Influence初回採用ゲート

監査日：2026年9月27日。対象は前工程でClass Aとした7件だけ。史料本文、既存のEvidence台帳、actor・place・relation・region structureと[freeze済みのModel C](SCHEMA.md)を照合した。全国再調査やClass B/C/Dの再分類は行わない。

## Baseline

開始commitは`800afb5d1b2aef87041ca3b405558f58ab78a819`（`main`、作業ツリー清潔）。Assessmentは39件、Class A候補は7件、`withheld=39`、`approved=0`、`direct=8`、`indirect=0`。Model Cのスキーマと判定規則はfreeze済み。

## Gate結果

YESは当該claimの限定された採用範囲について確認したことを示す。G8のYESは既存資料に採用を妨げる反証がないこと、G9のYESは同一戦力の二重帰属を作らないことを示す。城・寺・戦場の名称を含む地域IDは検索用の容器であり、採用する地理的範囲は各行の`spatial_note`と下表の一文でさらに限定する。

| claim | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 | result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C004 | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS |
| C033 | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS |
| C037 | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS |
| C038 | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS |
| C039 | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS |
| C040 | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS |
| C041 | YES | YES | YES | YES | YES | YES | YES | YES | YES | YES | PASS |

## PASS：7件の採用範囲

| claim | actor + place + time + status + basis | Evidence・ゲート判断 |
| --- | --- | --- |
| C004 | 松平元康勢は法蔵寺で旧暦1560年7月9日の制札発給時点に`limited / direct_action`の軍事Influenceを行使した。 | E006、[岡崎市S23](https://www.city.okazaki.lg.jp/bunka/torikumi_bunka/1004568/1004592/1004699/1004701.html)。陣取禁止を含む軍事的命令の**発給**であり、履行は採用しない。S24の独立時期に関する叙述は、この局地的な発給と矛盾しない。 |
| C033 | 豊州家島津氏勢は1560年を含む確認可能な保持期間に志布志城で`influential / direct_action`の軍事Influenceを行使した。 | E014・E016、[志布志市S32](https://www.city.shibushi.lg.jp/soshiki/22/1520.html)・[S33](https://www.city.shibushi.lg.jp/uploaded/attachment/4479.pdf)。両資料は取得始期に差があるが1560年の保持と1562年の喪失で一致。S32は城を前線拠点とし、1558年以降の肝付氏の反復攻撃を記す。単なる名目所有ではなく、攻撃下で一定期間保持された軍事拠点と評価する。優位を示す`dominant`にはしない。R14の周辺一帯への影響は採用しない。 |
| C037 | 北条氏康勢は久留里城への1560年5月の攻撃時点に`limited / direct_action`の軍事Influenceを行使した。 | E052、[館山市S68](https://www.city.tateyama.chiba.jp/satomi/youyaku/4shou/4shou_2/4shou_2min.html)。A65の攻撃は本文で直接確認。月の暦法は補わず、城取得や上総全体への作用は採用しない。 |
| C038 | 織田信長勢は桶狭間で旧暦1560年5月19日の交戦時点に`limited / direct_action`の軍事Influenceを行使した。 | E001、[広島県史年表S02](https://www.pref.hiroshima.lg.jp/soshiki_file/monjokan/nenpyou/nenpyou-cyusei2.pdf)55頁。戦場での交戦のみ。 |
| C039 | 今川義元勢は桶狭間で旧暦1560年5月19日の交戦時点に`limited / direct_action`の軍事Influenceを行使した。 | E002、同[S02](https://www.pref.hiroshima.lg.jp/soshiki_file/monjokan/nenpyou/nenpyou-cyusei2.pdf)55頁。義元討死後の影響や領域の継続は採用しない。 |
| C040 | 三好長慶勢は1560年内の飯盛城に関わる駆逐・入城時点に`limited / direct_action`の軍事Influenceを行使した。 | E054、[大東市S79](https://www.city.daito.lg.jp/site/history/2761.html)。長慶自身の行動として記される。日付、河内全域の駆逐範囲と年中保持は補わない。 |
| C041 | 長尾景虎勢は1560年内の富山城攻撃時点に`limited / direct_action`の軍事Influenceを行使した。 | E029、[富山市S45](https://www.city.toyama.toyama.jp/etc/maibun/toyamajyo/history/sengoku2.htm)。本文の後世名「上杉謙信勢」は、[新潟県の歴史解説](https://www.pref.niigata.lg.jp/site/kodomo/1356778597824.html)の1561年上杉家相続という年代と照合し、1560年の長尾景虎勢に対応させる。越中全域やその後の保持は採用しない。 |

## HOLD・REJECT

HOLDは0件、REJECTは0件。7件とも原Evidenceが対象の軍事行動または拠点保持を支え、主体・場所・時点・強度を上記の範囲へ限定できる。開始年の競合や月日不詳を推測値で埋めない。

## approvedの意味とCSV修正

`approved`は、そのactorが、そのplaceの**明示された局地**で、そのtimeに、その`influence_status`と`influence_basis`の軍事Influenceを行使したことの採用である。旧国全体の支配、年間を通じた支配、他主体への優勢、地域構造や年末状態、シミュレーション上の支配面積の確定を意味しない。したがって`knowledge_state=incomplete`と`atlas_status=approved`は両立する。

CSVでは7行の`atlas_status`だけを`approved`に変更し、従来の「保留Assessment」という語が矛盾しないよう7行の`assessment_note`を採用範囲へ更新した。C033の`spatial_note`は「志布志城と周辺」から城の拠点保持だけへ絞った。時間精度、強度、basis、confidence、place ID、relation、region structure、Schemaは変更しない。

## 二重計上

C038とC039は同一日の交戦に参加した**敵対する別戦力**である。双方の行動を採用しても、二つの支配領域や面積として合算しない。同一戦力を上位・現地の二主体に帰属させる新規ペアはない。C037の`FG_E052_HOJO`は既存の単一攻撃に対応し、新しいforce groupは作らない。C033の城保持と未採用C034の肝付氏による反復攻撃は敵対する別主体であり、C034を今回計数しない。空欄の`force_group_id`を独立戦力の証明には使わない。

## 判定

最終判定は**A**。7件がPASSし、安全に初回の`approved`を作成した。Model Cの構造的問題は見つからず、freeze再検討は不要。次工程ではClass Bの既定6件を個別調査し、Class C/Dは今回の採用から切り離して保持する。

## 整合性監査

Node.jsで全CSV行の列数、主要IDの重複、actor・place・Evidence・source・relation・structure参照、`atlas_status`の列挙値を検査した。更新後はAssessment 39、`approved=7`、`withheld=32`、`direct=8`、`indirect=0`。approved 7件はそれぞれ1件以上の紐付くEvidenceがあり、本文確認済みEvidenceも含む。`git diff --check`は通過した。
