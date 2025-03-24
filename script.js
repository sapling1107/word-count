
function isChinese(char) {
  return /[\u4e00-\u9fff]/.test(char);
}
function isPunctuation(char) {
  return /[，。！？、；：「」『』（）《》【】⋯…—·•・,.!?;:'"()\[\]{}]/.test(char);
}
function countWords(text) {
  let chineseCount = 0;
  let englishWords = 0;
  let punctuationCount = 0;
  let wordBuffer = "";

  const SPECIAL_SYMBOLS = {
    "……": 2,
    "——": 2,
    "⋯⋯": 2,
  };

  for (let symbol in SPECIAL_SYMBOLS) {
    let count = text.split(symbol).length - 1;
    punctuationCount += count * SPECIAL_SYMBOLS[symbol];
    text = text.split(symbol).join("");
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

function countCommonWords(text) {
  const commonWords = ["的", "了", "地", "著", "是", "也", "而"];
  const stats = {};
  for (let word of commonWords) {
    const count = (text.split(word).length - 1);
    if (count > 0) stats[word] = count;
  }
  return stats;
}

function updateResult(text) {
  const result = countWords(text);
  const commonWordStats = countCommonWords(text);

  let commonWordsText = "\n====== 常見詞統計 ======\n";
  for (let word in commonWordStats) {
    commonWordsText += `「${word}」：${commonWordStats[word]} 次\n`;
  }

  document.getElementById("result").innerHTML = `
    中文字數：${result.chineseCount}
    英文單字數：${result.englishWords}
    標點符號數：${result.punctuationCount}
    -----------------------------
    總字數：${result.total}
    ${commonWordsText}
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
