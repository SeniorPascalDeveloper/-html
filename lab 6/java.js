let keys = `контент, функция, химия, лекция, карго, баскетбол, автомобиль, экзопланета, соревнования, редактор`;

let kod = (prompt(`введите шифр:`) || "").toLowerCase();
let n1 = Number(prompt(`введите строки:`) || 0);
let n2 = Number(prompt(`введите столбцы:`) || 0);

function doubleChar(key){
  let final = ``;
  for (let i = 0; i < key.length; i++){
    if (!final.includes(key[i])) final += key[i];
  }
  return final;
}

function getAlphabet(key){
  let alphabet = `абвгдежзийклмнопрстуфхцчшщъыьэюя`;
  return doubleChar(key + alphabet);
}

function mat(keyWord, a, b){
  let matrix = [];
  let k = 0;

  let shortWord = doubleChar(keyWord);
  let newAlphabet = getAlphabet(shortWord);

  for (let i = 0; i < a; i++) {
    matrix[i] = [];
    for (let j = 0; j < b; j++) {
      matrix[i][j] = newAlphabet[k] || "";
      k++;
    }
  }
  return matrix;
}

function main(kod){
  let final = ``;
  let keyWord = keys.split(`, `);

  for (let p = 0; p < keyWord.length; p++){
    let prefinal = ``;
    let matrix = mat(keyWord[p], n1, n2); 

    for (let e = 0; e < kod.length; e++) {
      for (let q = 0; q < n1; q++) {
        for (let w = 0; w < n2; w++) {
          if (kod[e] === matrix[q][w]) {
            prefinal += (q === n1 - 1) ? matrix[0][w] : matrix[q + 1][w];
          }
        }
      }
    }

    final += prefinal + "\n";
  }
  return final;
}

document.write(`<pre>${main(kod)}</pre>`);
