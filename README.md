# サンプル（プロダクト名）

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2021/07/JPHACKS2021_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要

### 背景(製品開発のきっかけ、課題等）
動画共有アプリケーションが普及した現在、動画編集は広く行われるようになりました。動画にはテロップ、画像、効果音、さまざまなアセットが付け足され、無機的な画像列は有機的なエンターテインメントコンテンツとして変容し、視聴者はそれを楽しんでいます。特に効果音は、場面を強調したり、登場人物の気持ちを表したり、場面のムードを伝えたりと、演出効果を担っており、映像に命を与えているといっても過言ではありません。

しかし、動画コンテンツの拡大とともに必要となるアセット数は膨大し、**目的のアセットを記憶・探索することは非常に困難**になってしまいました。
ましてや効果音（音声アセット）となると、視覚的にどのような音なのか確認することができず、探索が困難を極めます。
この作業だけで動画編集者の労力を著しく費やされてしまいます。

そこで私たちは **「効果音（音声アセット）の探索」に注目** し、効果音の**類似度を可視化**することにしました。
これにより**動画編集の負担を減らす価値**を提供できると考えています。

さらに視聴者に継続的かつ高速に動画を提供できれば、エンターテインメント業界全体にさらなる盛り上がりを促すことができるのではないでしょうか？

### 製品説明（具体的な製品の説明）
動画に効果音を当ててみたものの、なんだかしっくりこないことってありますよね？

「Visualize Sounds Core」を使用すれば、自分の所持している音声アセット（効果音）のなかから類似している音声アセットを検索してくれます！さらに該当した音声アセットの類似度をグラフ上の距離で可視化してくれるので、特に類似している音声アセットが一目瞭然です。

#### 使用方法

#### 1. まず、所持している音声アセットを登録しましょう。
* **UIはシンプル**で、フォルダを選択し登録ボタンを押すだけ！
* 検索オプションから**正規表現**に該当するアセットだけに絞ることができます！

＝＝＝＝＝＝＝＝＝＝画像入れよう＝＝＝＝＝＝＝＝＝＝
#### 2. 類似する音声アセットを見つけよう。
* こちらも**UIはシンプル**！検索メニューから検索したいアセットを選択し、検索するだけ！
* 結果として、類似するアセットがグラフに表示されます！
* グラフのアセットから再検索することもできます！

＝＝＝＝＝＝＝＝＝＝画像入れよう＝＝＝＝＝＝＝＝＝＝

### 特長
#### 1. 自分の所持しているアセットの中から探索できる新規性
類似する楽曲を検索してくれるサービスはすでにありますが、自分の所持しているものから検索するサービスはありません。
「Visualize Sounds Core」では、動画編集者をターゲットとしており、そのユースケースに最適化されたシステムを提供しています。

#### 2. 類似度の可視化
「Visualize Sounds Core」では、ただ類似している音声アセットを羅列するのではなく、グラフ上に可視化しています。グラフ上の各項目間の距離で類似度を表すことで、視覚的にどの音声アセットが似ているのかを表現しています。

#### 3. くまちゃんさんの実装周り
高速化とか？

### 解決出来ること
**動画編集時間の削減に貢献**

冒頭で述べた通り、音声アセットの探索は非常に困難で大量の時間を要してしまい、動画編集者にはストレスが過剰にかかってしまいます。我々の開発した「Visualize Sounds Core」を使用することで、その時間を削減し編集者の負担を大幅に減らすことが可能になります。

**動画視聴者のUXを向上できる**

「動画編集に時間がかかってしまう＝視聴者への動画の提供が遅くなる」、この関係は明らかあり、動画提供が遅れてしまうと視聴者のUXは下がってしまいます。「Visualize Sounds Core」を使用することで、前述した編集時間の削減が可能で、それにより視聴者のUXの向上が期待できます。

### 今後の展望

### 注力したこと（こだわり等）
* 音声アセットの類似度算出（くまちゃんさんのこだわりアルゴリズ等あれば！）
* 主成分分析を用い、音声アセットの特徴空間削減を実現しました。
* グラフ描画をライブラリを使用せずに1から開発しました。（仮）

## 開発技術
### 活用した技術

#### フレームワーク・ライブラリ・モジュール
* electron
* react
* material-ui
* cmake.js
* vis (グラフ表示)
* くまちゃんさん側のC++関連

＝＝＝＝＝＝＝＝＝＝アーキテクチャの画像入れよう＝＝＝＝＝＝＝＝＝＝

#### デバイス
* デスクトップ

### 独自技術
#### ハッカソンで開発した独自機能・技術
* くまちゃんさん周り

* 音声アセットの特徴空間削減
  * 音声アセットの約100次元の特徴ベクトルの分布を最も近似する2次元の部分空間に変換。[次元削減(主成分分析)](https://github.com/jphacks/D_2104/blob/57aef468b853a304d37efa688cb8c303e62c6f6d/src/lib/nodesParser.js#L13)を適用。

* もちくん周り

* 独自で開発したものの内容をこちらに記載してください
* 特に力を入れた部分をファイルリンク、またはcommit_idを記載してください。

#### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* 
* 
