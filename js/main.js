// https://github.com/tsuyopon-xyz/drawing_app_part2/blob/master/main.js
// 上記のコードを元に以下の追加機能を追加します。
// - 線の太さ変更する機能
//
// 元々書かれてた説明のコメントは削除しました。理由は次のとおりです。
// - 今回の変更差分の説明コメントのみにすることで、どの部分で変更があったかわかりやすくするため
window.addEventListener('load', () => {
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');

  // 現在のマウスの位置を中心に、現在選択している線の太さを「○」で表現するために使用するcanvas
  const canvasForWidthIndicator = document.querySelector('#line-width-indicator');
  const contextForWidthIndicator = canvasForWidthIndicator.getContext('2d');

  const lastPosition = { x: null, y: null };
  let isDrag = false;
  let currentColor = '#000000';

  // 現在の線の太さを記憶する変数
  // <input id="range-selector" type="range"> の値と連動する
  let currentLineWidth = 1;

  function draw(x, y) {
    if(!isDrag) {
      return;
    }
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = currentLineWidth;
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

  // <canvas　id="line-width-indicator"> 上で現在のマウスの位置を中心に
  // 線の太さを表現するための「○」を描画する。
  function showLineWidthIndicator(x, y) {
    contextForWidthIndicator.lineCap = 'round';
    contextForWidthIndicator.lineJoin = 'round';
    contextForWidthIndicator.strokeStyle = currentColor;

    // 「○」の線の太さは細くて良いので1で固定
    contextForWidthIndicator.lineWidth = 1;

    // 過去に描画「○」を削除する。過去の「○」を削除しなかった場合は
    // 過去の「○」が残り続けてします。(以下の画像URLを参照)
    // https://tsuyopon.xyz/wp-content/uploads/2018/09/line-width-indicator-with-bug.gif
    contextForWidthIndicator.clearRect(0, 0, canvasForWidthIndicator.width, canvasForWidthIndicator.height);

    contextForWidthIndicator.beginPath();

    // x, y座標を中心とした円(「○」)を描画する。
    // 第3引数の「currentLineWidth / 2」で、実際に描画する線の太さと同じ大きさになる。
    // ドキュメント: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
    contextForWidthIndicator.arc(x, y, currentLineWidth / 2, 0, 2 * Math.PI);

    contextForWidthIndicator.stroke();
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
    const eraserButton = document.querySelector('#eraser-button');
    clearButton.addEventListener('click', clear);
    eraserButton.addEventListener('click', () => {
      currentColor = '#FFFFFF';
    });

    // layeredCanvasAreaは2つのcanvas要素を保持している。2つのcanvasはそれぞれ以下の役割を持つ
    //
    // 1. 絵を書くためのcanvas
    // 2. 現在のマウスの位置を中心として、太さを「○」の形で表現するためのcanvas
    //
    // 1と2の機能を1つのキャンパスで共存することは出来ない。
    // 共存できない理由は以下の通り。
    //
    // - 1の機能は過去に描画してきた線の保持し続ける
    // - 2の機能は前回描画したものを削除する必要がある。削除しなかった場合は、過去の「○」が残り続けてしまう。(以下の画像URLを参照)
    //   - https://tsuyopon.xyz/wp-content/uploads/2018/09/line-width-indicator-with-bug.gif
    //
    // 上記2つの理由より
    // - 1のときはcontext.clearRectを使うことが出来ず
    // - 2のときはcontextForWidthIndicator.clearRectを使う必要がある
    const layeredCanvasArea = document.querySelector('#layerd-canvas-area');

    // 元々はcanvas.addEventListenerとしていたが、
    // 2つのcanvasを重ねて使うようになったため、親要素である <span id="layerd-canvas-area">に対して
    // イベント処理を定義するようにした。
    layeredCanvasArea.addEventListener('mousedown', dragStart);
    layeredCanvasArea.addEventListener('mouseup', dragEnd);
    layeredCanvasArea.addEventListener('mouseout', dragEnd);
    layeredCanvasArea.addEventListener('mousemove', event => {
      // 2つのcanvasに対する描画処理を行う

      // 実際に線を引くcanvasに描画を行う。(ドラッグ中のみ線の描画を行う)
      draw(event.layerX, event.layerY);

      // 現在のマウスの位置を中心として、線の太さを「○」で表現するためのcanvasに描画を行う
      showLineWidthIndicator(event.layerX, event.layerY);
    });
  }

  function initColorPalette() {
    const joe = colorjoe.rgb('color-palette', currentColor);
    joe.on('done', color => {
      currentColor = color.hex();
    });
  }

  // 文字の太さの設定・更新を行う機能
  function initConfigOfLineWidth() {
    const textForCurrentSize = document.querySelector('#line-width');
    const rangeSelector = document.querySelector('#range-selector');

    // 線の太さを記憶している変数の値を更新する
    currentLineWidth = rangeSelector.value;

    // "input"イベントをセットすることでスライド中の値も取得できるようになる。
    // ドキュメント: https://developer.mozilla.org/ja/docs/Web/HTML/Element/Input/range
    rangeSelector.addEventListener('input', event => {
      const width = event.target.value;

      // 線の太さを記憶している変数の値を更新する
      currentLineWidth = width;

      // 更新した線の太さ値(数値)を<input id="range-selector" type="range">の右側に表示する
      textForCurrentSize.innerText = width;
    });
  }

  initEventHandler();
  initColorPalette();

  // 文字の太さの設定を行う機能を有効にする
  initConfigOfLineWidth();
});