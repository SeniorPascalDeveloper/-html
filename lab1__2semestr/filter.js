const correspond = {
    "Название": "structure",
    "Жанр":"genre",
    "Год": ["yearFrom", "yearTo"],
    "Рейтинг": ["ratingFrom", "ratingTo"],
    "Статус":"status"
}

/* Структура возвращаемого ассоциативного массива:
{
    input_id: input_value,
    ...
}
*/
const dataFilter = (dataForm) => {
    
    let dictFilter = {};

    // перебираем все элементы формы с фильтрами
    for (const item of dataForm.elements) {
        
        // получаем значение элемента
        let valInput = item.value;

        // если поле типа text - приводим его значение к нижнему регистру
        if (item.type === "text") {
            valInput = valInput.toLowerCase();
        } 

        else if (item.type === 'number'){
            if (valInput !== ""){
                valInput= Number(valInput);
            } else if (item.id.includes("From")){
                valInput = -Infinity;
            } else if (item.id.includes("To")){
                valInput = Infinity;
            }
        }
        dictFilter[item.id] = valInput;
    }       
    return dictFilter;
}


// фильтрация таблицы
const filterTable = (data, idTable, dataForm) =>{
    
    // получаем данные из полей формы
    const datafilter = dataFilter(dataForm);
    
    // выбираем данные соответствующие фильтру и формируем таблицу из них
    let tableFilter = data.filter(item => {

        /* в этой переменной будут "накапливаться" результаты сравнения данных
           с параметрами фильтра */
        let result = true;
        
        // строка соответствует фильтру, если сравнение всех значения из input 
        // со значением ячейки очередной строки - истина
         Object.entries(item).map(([key, val]) => {
            
            // текстовые поля проверяем на вхождение
            if (typeof val == 'string') {
                result &&= val.toLowerCase().includes(datafilter[correspond[key]]) 
            }
            else if (typeof val === 'number') {
                const filterKeys = correspond[key];
                if (Array.isArray(filterKeys)) {
                    const from = datafilter[filterKeys[0]];
                    const to = datafilter[filterKeys[1]];
                    result &&= (val >= from && val <= to);
    }
}
            // САМОСТОЯТЕЛЬНО проверить числовые поля на принадлежность интервалу
         });

         return result;
    });     

    // САМОСТОЯТЕЛЬНО вызвать функцию, которая удаляет все строки таблицы с id=idTable
    clearTable(idTable);
    // показать на странице таблицу с отфильтрованными строками
    createTable(tableFilter, idTable);  
    
    preSortRows = null;
    sortTable(idTable, sort);
}

const clearFilter = (dataForm, idTable) => {
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

  for (const item of dataForm.elements) {
    if (item.type === 'text'){
      item.value = '';
    }

    if (item.type === 'number') {
      item.value = null;
    }
  }

  preSortRows = null;

  const sortForm = document.getElementById("sort");

  // Очищаем все SELECT
  for (const select of sortForm.getElementsByTagName("select")) {
    select.innerHTML = "";
  }

  // Снимаем все флажки «по убыванию»
  for (const input of sortForm.getElementsByTagName("input")) {
    if (input.type === "checkbox") {
      input.checked = false;
    }
  }

  // Перестраиваем поля со списком как при загрузке страницы
  setSortSelects(dramas[0], sortForm);

  clearTable(idTable);
  createTable(dramas, idTable)
}