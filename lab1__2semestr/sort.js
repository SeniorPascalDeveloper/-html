/*формируем массив для сортировки по двум уровням вида 
  [
    {column: номер столбца, по которому осуществляется сортировка, 
     direction: порядок сортировки (true по убыванию, false по возрастанию)
    }, 
    ...
   ]
*/
const createSortArr = (data) => {
  let sortArr = [];

  const sortSelects = data.getElementsByTagName('select');

  for (const item of sortSelects) {
    // получаем номер выбранной опции
    const keySort = item.value;
    // в случае, если выбрана опция Нет, заканчиваем формировать массив
    if (keySort == 0) {
      break;
    }
    // получаем порядок сортировки очередного уровня
    // имя флажка сформировано как имя поля SELECT и слова Desc
    const desc = document.getElementById(item.id + 'Desc').checked;
    // очередной элемент массива - по какому столбцу и в каком порядке сортировать 
    sortArr.push(
      {
        column: keySort - 1,
        direction: desc
      }
    );
  }

  return sortArr;
};

// сохраняем строки таблицы до первого применения сортировки
let preSortRows = null;

const sortTable = (idTable, formData) => {
  // формируем управляющий массив для сортировки
  const sortArr = createSortArr(formData);
  console.log({ sortArr })

  //находим нужную таблицу
  let table = document.getElementById(idTable);
  console.log({ table })

  // преобразуем строки таблицы в массив 
  let rowData = Array.from(table.rows).slice(1);
  console.log({ rowData })

  // сохраняем исходный порядок строк перед первой сортировкой
  // удаляем элемент с заголовками таблицы
  const headerRow = table.rows[0]
  console.log({ headerRow })
  
  if (!preSortRows) {
    // preSortRows = [...rowData];
    preSortRows = rowData.map(row => row.cloneNode(true));
  }

  // сортировать таблицу не нужно, во всех полях выбрана опция Нет
  if (sortArr.length === 0) {
    console.log('no sort needed')
    if (preSortRows) {
      console.log('pre sort rows')
      table.innerHTML = "";
      table.append(headerRow);
      let tbody = document.createElement("tbody");
      preSortRows.forEach((item) => tbody.append(item));
      table.append(tbody);
      preSortRows = null;
    }
    return false;
  }

  //сортируем данные по всем уровням сортировки
  rowData.sort((first, second) => {
    for (let { column, direction } of sortArr) {
      const firstCell = first.cells[column].innerHTML;
      const secondCell = second.cells[column].innerHTML;

      let comparison;
      if (column < 4) {
        // используем localeCompare для корректного сравнения
        comparison = firstCell.localeCompare(secondCell);
      }
      else {
        const firstNum = parseFloat(firstCell.replace(',', '.'));
        const secondNum = parseFloat(secondCell.replace(',', '.'));
        comparison = firstNum - secondNum;
      }

      // учитываем направление сортировки
      if (comparison !== 0) {
        return (direction ? -comparison : comparison);
      }
    }
    return 0;
  });

  table.innerHTML = ''
  //выводим отсортированную таблицу на страницу
  table.append(headerRow);
	
	let tbody = document.createElement('tbody');
    rowData.forEach(item => {
        tbody.append(item);
    });
	table.append(tbody);
}

const resetSort = (idTable, data) => {
  // восстанавливаем таблицу до применения сортировки
  if (preSortRows) {
    const table = document.getElementById(idTable);
    // const headerRow = Array.from(table.rows).shift();
    const headerRow = table.rows[0];

    table.innerHTML = "";
    table.append(headerRow);
    const tbody = document.createElement("tbody");
    preSortRows.forEach((item) => tbody.append(item));
    table.append(tbody);
    preSortRows = null;
  }

  // сбрасываем форму сортировки к начальному состоянию (как при загрузке страницы)
  const sortForm = document.getElementById("sort");

  // очищаем все SELECT
  for (const select of sortForm.getElementsByTagName("select")) {
    select.innerHTML = "";
  }

  // снимаем все флажки «по убыванию»
  for (const input of sortForm.getElementsByTagName("input")) {
    if (input.type === "checkbox") input.checked = false;
  }

  // перестраиваем поля со списком как при загрузке страницы
  setSortSelects(data[0], sortForm);
};