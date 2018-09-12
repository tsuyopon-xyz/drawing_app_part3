## ブログ記事

以下のブログ記事で利用するソースコードをこのレポジトリに用意

https://tsuyopon.xyz/2018/09/14/how-to-create-drawing-app-part3/

## 動作確認

下記ページよりこのレポジトリで作成した「お絵かきアプリ」を利用することが出来ます。

https://tsuyopon-xyz.github.io/drawing_app_part3/

## 前回からの変更点

- HTMLに線の太さを変更できるinput[type=range]要素を追加
- canvas要素を1つ追加
  - マウスの位置を中心として、線の太さを「○」で表現するためのcanvas
- 前回から用意している線の描画用canvasのstyleに「position: absolute;」を追加
  - 2つのcanvasを重ねるため
- 2つのcanvasを小要素に持つ`<span id="layerd-canvas-area">`を追加
  - 前回までは線を描画するためのcanvasにマウスイベントを定義していたが、今回の変更で`<span id="layerd-canvas-area">`に対してマウスイベントを定義するように変更した。
    - 2つのcanvasを同時に描画するため
- 文字の太さの設定・更新を行うためのinitConfigOfLineWidth関数を用意

## 前回のレポジトリ

https://github.com/tsuyopon-xyz/drawing_app_part2