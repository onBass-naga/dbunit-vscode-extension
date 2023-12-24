# dbunit-vscode-extension 

DBUnitのXMLファイルをテーブル形式のUIで編集できるエディターです。
([English](./README.md))

![user initerface](./docs/images/ui.png)


## 特徴

- Flat XML/XMLの両方の形式をサポートしています
- 異なる形式でエクスポートできます
- datasetの内容をMarkdown形式でクリップボードにコピーできます

## 使い方

XMLファイルを開いた後、右上のテーブルアイコンをクリックするとテーブルUIエディターが開きます。

![Menu icon](./docs/images/menu-icon.png)

また、コマンドパレットの `DBUnit xml editor` からも開けます。

![Command](./docs/images/command-palette.png)

### テーブルの行データ編集

- 編集したいセルをダブルクリックすると値を編集できます
- カーソルが当たっている状態でリターンキーを押下することでも編集モードになります
- データ行にカーソルが当たっている状態で `Clone row` ボタンをクリックすると対象行のコピーがその行の下に追加できます
- データ行にカーソルが当たっている状態で `Delete row` ボタンをクリックすると対象行を削除できます

### テーブル情報の編集

- `Edit table` ボタンをクリックすると編集モータルが開き、テーブル名の変更やカラム名の変更、カラムの並び替えや削除ができます
- `Delete table` ボタンをクリックすると、表示しているテーブルを削除できます
- `Move left`と `Move right` ボタンによりテーブルの表示順を移動できます
- テーブル名タブの横にある `+` ボタンをクリックすると、テーブル追加フォームを表示します

### その他の機能

- `Copy as Markdown` ボタンをクリックすると、XMLの情報をマークダウンのテーブル記述に変換してクリップボードにコピーできます。（※改行コード未対応）
- `Reload` ボタンをクリックすると、ファイルの情報をテーブルUIに反映します。初回読み込み時以外はファイルからUIへ自動で情報を反映しないため、直接ファイルを編集した場合などはReloadしてください。
- 太陽・月のアイコンでdarkモード切り替えができます
- Flat/Standardプルダウンで選択しているほうのXML形式でファイルへ編集内容を書き出します


# License

[MIT](LICENSE)