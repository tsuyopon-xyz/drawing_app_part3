// https://github.com/tsuyopon-xyz/drawing_app_part1/blob/master/main.js
// 上記のコードを元に以下の追加機能を追加します。
// - 線の色を変更する機能
// - 消しゴム機能
//
// 元々書かれてた説明のコメントは削除しました。理由は次のとおりです。
// - 今回の変更差分の説明コメントのみにすることで、どの部分で変更があったかわかりやすくするため
window.addEventListener('load', () => {
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');
  const lastPosition = { x: null, y: null };
  let isDrag = false;

  // 現在の線の色を保持する変数(デフォルトは黒(#000000)とする)
  let currentColor = '#000000';

  function draw(x, y) {
    if(!isDrag) {
      return;
    }
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 5;
    context.strokeStyle = currentColor;
    if (lastPosition.x === null || lastPosition.y === null) {
      context.moveTo(x, y);
    } else {
      context.moveTo(lastPosition.x, lastPosition.y);
    }
    context.lineTo(x, y);
    context.stroke();

    lastPosition.x = x;
    lastPosition.y = y;
  }

  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function dragStart(event) {
    context.beginPath();

    isDrag = true;
  }

  function dragEnd(event) {
    context.closePath();
    isDrag = false;
    lastPosition.x = null;
    lastPosition.y = null;
  }

  function initEventHandler() {
    const clearButton = document.querySelector('#clear-button');
    clearButton.addEventListener('click', clear);

    // 消しゴムモードを選択したときの挙動
    const eraserButton = document.querySelector('#eraser-button');
    eraserButton.addEventListener('click', () => {
      // 消しゴムと同等の機能を実装したい場合は現在選択している線の色を
      // 白(#FFFFFF)に変更するだけでよい
      currentColor = '#FFFFFF';
    });

    canvas.addEventListener('mousedown', dragStart);
    canvas.addEventListener('mouseup', dragEnd);
    canvas.addEventListener('mouseout', dragEnd);
    canvas.addEventListener('mousemove', (event) => {
      draw(event.layerX, event.layerY);
    });
  }

  // カラーパレットの設置を行う
  function initColorPalette() {
    const joe = colorjoe.rgb('color-palette', currentColor);

    // 'done'イベントは、カラーパレットから色を選択した時に呼ばれるイベント
    // ドキュメント: https://github.com/bebraw/colorjoe#event-handling
    joe.on('done', color => {
      // コールバック関数の引数からcolorオブジェクトを受け取り、
      // このcolorオブジェクト経由で選択した色情報を取得する

      // color.hex()を実行すると '#FF0000' のような形式で色情報を16進数の形式で受け取れる
      // draw関数の手前で定義されている、線の色を保持する変数に代入して色情報を変更する
      currentColor = color.hex();
    });
  }

  initEventHandler();

  // カラーパレット情報を初期化する
  initColorPalette();
});