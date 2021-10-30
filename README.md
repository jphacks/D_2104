# サンプル（プロダクト名）

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2021/07/JPHACKS2021_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要

### 背景(製品開発のきっかけ、課題等）
動画共有アプリケーションが普及した現在、動画編集は広く行われるようになりました。動画にはテロップ、画像、効果音、さまざまなアセットが付け足され、無機的な画像列は有機的なエンターテインメントコンテンツとして変容し、視聴者はそれを楽しんでいます。特に効果音は、場面を強調したり、登場人物の気持ちを表したり、場面のムードを伝えたりと、演出効果を担っており、映像に命を与えているといっても過言ではありません。

しかし、動画コンテンツの拡大とともに必要となるアセット数は膨大し、**目的のアセットを記憶・探索することは非常に困難**になってしまいました。
ましてや効果音（音声アセット）となると、視覚的にどのような音なのか確認することができず、探索が困難を極めます。
この作業だけで動画編集者の労力を著しく費やされてしまいます。

そこで私たちは **「効果音（音声アセット）の探索」に注目** し、効果音の**類似度を可視化**することにしました。
これにより**動画・音源編集の負担を減らす価値**を提供できると考えています。

さらに視聴者に継続的かつ高速に動画を提供できれば、エンターテインメント業界全体にさらなる盛り上がりを促すことができるのではないでしょうか？

### 製品説明（具体的な製品の説明）
動画に効果音を当ててみたものの、なんだかしっくりこないことってありますよね？

「Visualize Sounds Core」を使用すれば、自分の所持している音声アセット（効果音）のなかから類似している音声アセットを検索できます！さらに該当した音声アセットの類似度をグラフ上の距離で可視化してくれるので、特に類似している音声アセットが一目でわかります！

#### 使用方法


#### 1. まず、所持している音声アセットを登録しましょう。
* **UIはシンプル**で、フォルダを選択し登録ボタンを押すだけ！
* 登録オプションから**正規表現**に該当するアセットを除外することができます！

![vscore-setting (2)](https://user-images.githubusercontent.com/51479912/139514310-d296e342-3c39-4c31-91d7-0ab0701dcded.jpg)

#### 2. 類似する音声アセットを見つけよう。
* こちらも**UIはシンプル**！検索メニューから検索したいアセットを選択し、検索するだけ！
* 結果として、類似するアセットがグラフに表示されます！
* グラフのアセットから再検索することもできます！

＝＝＝＝＝＝＝＝＝＝画像入れよう＝＝＝＝＝＝＝＝＝＝

### 特長
#### 1. 自分の所持しているアセットの中から探索できる新規性
類似する楽曲を検索してくれるサービスはすでにありますが、自分の所持しているものから検索するサービスはありません。
「Visualize Sounds Core」では、動画編集者をターゲットとしており、「所持している音声アセットから見つけたい」という要望、ユースケースに最適化されたシステムを提供しています。

#### 2. 類似度の可視化
「Visualize Sounds Core」では、ただ類似している音声アセットを羅列するのではなく、グラフ上に可視化しています。グラフ上の各項目間の距離で類似度を表すことで、視覚的にどの音声アセットが似ているのかを表現しています。これらの技術は独自に開発し、唯一無二の機能となっています。

#### 3. PC性能を最大限に生かし高速
動画編集や音楽等のクリエイターの方で、並列度の高いPCを持っているのに、ソフトウェアがPCの性能を引き出せず、もったいない思いをしたことがことがあるはずです。その点「Visualize Sounds Core」は安心！ネイティブ実装&最大限並列化によって、あなたのPCの性能を限界まで引き出します。

### 解決出来ること
**動画編集時間の削減に貢献**

冒頭で述べた通り、音声アセットの探索は非常に困難で大量の時間を要してしまい、動画編集者にはストレスが過剰にかかってしまいます。我々の開発した「Visualize Sounds Core」を使用することで、その時間を削減し編集者の負担を大幅に減らすことが可能になります。

**動画視聴者のUXを向上できる**

「動画編集に時間がかかってしまう＝視聴者への動画の提供が遅くなる」、この関係は明らかあり、動画提供が遅れてしまうと視聴者のUXは下がってしまいます。「Visualize Sounds Core」を使用することで、前述した編集時間の削減が可能で、それにより視聴者のUXの向上が期待できます。

### 今後の展望
現在の実装では、時変化やイコライザー等の影響を考えていません。しかし、音声ファイルを統計的に処理をすれば理論上可能なので、さまざまなエフェクトに対しても解析し、対応していきたいです。

### 注力したこと（こだわり等）
* 音声アセットの類似度算出
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
* RapidJson
* muFFT
* libnyquist
* rtaudio


#### デバイス
* デスクトップ

![vscore_architecture](https://user-images.githubusercontent.com/51479912/139445955-4c0d859a-acc8-419f-b6e2-10040b9b7e16.png)


### 独自技術
#### ハッカソンで開発した独自機能・技術
* 音声アセットの特徴量抽出
  * 非常に注力し、多数の工夫をしたので別紙として[こちら](/out/technology.pdf)にまとめました。よければご覧ください。

* 音声アセットの特徴空間削減
  * 音声アセットの約100次元の特徴ベクトルの分布を最も近似する2次元の部分空間に変換。[次元削減(主成分分析)](https://github.com/jphacks/D_2104/blob/57aef468b853a304d37efa688cb8c303e62c6f6d/src/lib/nodesParser.js#L13)を適用。

* グラフ上の音声アセットの[一意的な色付け](https://github.com/jphacks/D_2104/blob/49106ca1efa81ff5a0f8fcf63ffd1a2982112478/src/pages/result.jsx#L17)
  * 音声アセットを一意に示す文字列をmd5にハッシュし、頭6桁をカラーコードとして使用することで一意的な色付けを実現しました。


#### 製品に取り入れた研究内容（データ・ソフトウェアなど）（※アカデミック部門の場合のみ提出必須）
* [音声の音響分析の「いろは」](https://www.gavo.t.u-tokyo.ac.jp/~mine/japanese/nlp+slp/I-RO-HA.pdf)
* [音楽のパーツ表現](http://sap.ist.i.kyoto-u.ac.jp/members/yoshii/slides/sigmus-2016-2-yoshii-slides.pdf)
