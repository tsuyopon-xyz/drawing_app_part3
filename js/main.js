// https://github.com/tsuyopon-xyz/drawing_app_part2/blob/master/main.js
// 上記のコードを元に以下の追加機能を追加します。
// - 線の太さ変更する機能
//
// 元々書かれてた説明のコメントは削除しました。理由は次のとおりです。
// - 今回の変更差分の説明コメントのみにすることで、どの部分で変更があったかわかりやすくするため
window.addEventListener('load', () => {
  const canvas = document.querySelector('#draw-area');
  const context = canvas.getContext('2d');
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

    canvas.addEventListener('mousedown', dragStart);
    canvas.addEventListener('mouseup', dragEnd);
    canvas.addEventListener('mouseout', dragEnd);
    canvas.addEventListener('mousemove', (event) => {
      draw(event.layerX, event.layerY);
    });
  }

  function initColorPalette() {
    const joe = colorjoe.rgb('color-palette', currentColor);
    joe.on('done', color => {
      currentColor = color.hex();
    });
  }

  // 文字の太さの設定を行う機能
  function initConfigOfLineWidth() {
    const textForCurrentSize = document.querySelector('#line-width');
    const rangeSelector = document.querySelector('#range-selector');

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