
function isChinese(char) {
  return /[\u4e00-\u9fff]/.test(char);
}
function isPunctuation(char) {
  return /[，。！？、；：「」『』（）《》【】⋯…—,.!?;:'"()\[\]{}]/.test(char);
}
function countWords(text) {
  let chineseCount = 0;
  let englishWords = 0;
  let punctuationCount = 0;
  let wordBuffer = "";

  // 特殊符號處理：省略號、破折號
  const SPECIAL_SYMBOLS = {
    "……": 2,
    "——": 2,
    "⋯⋯": 2,
  };

  for (let symbol in SPECIAL_SYMBOLS) {
    let count = text.split(symbol).length - 1;
    punctuationCount += count * SPECIAL_SYMBOLS[symbol];
    text = text.split(symbol).join(""); // 移除處理過的符號
  }

  for (let char of text) {
    if (isChinese(char)) {
      chineseCount++;
    } else if (/[a-zA-Z]/.test(char)) {
      wordBuffer += char;
    } else {
      if (wordBuffer.length > 0) {
        englishWords++;
        wordBuffer = "";
      }
      if (isPunctuation(char)) {
        punctuationCount++;
      }
    }
  }
  if (wordBuffer.length > 0) englishWords++;
  const total = chineseCount + englishWords + punctuationCount;
  return {
    chineseCount,
    englishWords,
    punctuationCount,
    total,
  };
}

function updateResult(text) {
  const result = countWords(text);
  document.getElementById("result").innerHTML = `
    <p>中文字數：${result.chineseCount}</p>
    <p>英文單字數：${result.englishWords}</p>
    <p>標點符號數：${result.punctuationCount}</p>
    <p><strong>總字數：</strong>${result.total}</p>
  `;
}

document.getElementById("textInput").addEventListener("input", function () {
  updateResult(this.value);
});
document.getElementById("clearButton").addEventListener("click", function () {
  const textInput = document.getElementById("textInput");
  textInput.value = "";
  updateResult("");
});
