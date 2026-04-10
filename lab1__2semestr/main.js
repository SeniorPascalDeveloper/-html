document.addEventListener("DOMContentLoaded", function() {
  createTable(dramas, 'list');
});

const form = document.getElementById('filter');
const sort = document.getElementById('sort');

document.getElementById('find-filtered-items-button').addEventListener('click', function () {
  filterTable(dramas, 'list', form)
});

document.getElementById('clear-filter-button').addEventListener('click', function (event) {
  event.preventDefault();
  clearFilter(form, 'list');
});

// формирование полей элемента списка с заданным текстом и значением

const createOption = (str, val) => {
  let item = document.createElement('option');
  item.text = str;
  item.value = val;
  return item;
}

// формирование поля со списком 
// параметры – массив со значениями элементов списка и элемент select

const setSortSelect = (arr, sortSelect) => {
  
  // создаем OPTION Нет и добавляем ее в SELECT
  sortSelect.append(createOption('Нет', 0));
  // перебираем массив со значениями опций
   arr.forEach((item, index) => {
     // создаем OPTION из очередного ключа и добавляем в SELECT
     // значение атрибута VALUE увеличиваем на 1, так как значение 0 имеет опция Нет
      sortSelect.append(createOption(item, index + 1));
  });
}

// формируем поля со списком для многоуровневой сортировки
const setSortSelects = (data, dataForm) => { 

  // выделяем ключи словаря в массив
  const head = Object.keys(data);

  // находим все SELECT в форме
  const allSelect = dataForm.getElementsByTagName('select');
  
  for(const item of dataForm.elements){
      // формируем очередной SELECT
      setSortSelect(head, item);
  
      // САМОСТОЯТЕЛЬНО все SELECT, кроме первого, сделать неизменяемым
      const allExceptFirst = [...allSelect].slice(1);
      allExceptFirst.forEach(select => select.disabled = true)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setSortSelects(dramas[0], sort)
});


// настраиваем поле для следующего уровня сортировки
const changeNextSelect = (curSelect, nextSelectId) => {
    
  let nextSelect = document.getElementById(nextSelectId);
  
  nextSelect.disabled = false;
  
  // в следующем SELECT выводим те же option, что и в текущем
  nextSelect.innerHTML = curSelect.innerHTML;
  
  // удаляем в следующем SELECT уже выбранную в текущем опцию
  // если это не первая опция - отсутствие сортировки
  if (curSelect.value != 0) {
     nextSelect.remove(curSelect.value);
  } else {
      nextSelect.disabled = true;
  }
}

const sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click', () => {
  sortTable('list', sort);
})

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
  resetSort('list', dramas)
})

fieldsFirst.addEventListener('change', (event) => {
  const second = document.getElementById('fieldsSecond');
  const third = document.getElementById('fieldsThird');

  if (event.target.value == 0) {
    second.disabled = true;
    third.disabled = true;

    second.value = 0;
    third.value = 0;

    return;
  }

  second.disabled = false;
  changeNextSelect(event.currentTarget, 'fieldsSecond');
});

fieldsSecond.addEventListener('change', (event) => {
  const third = document.getElementById('fieldsThird');

  if (event.target.value == 0) {
    third.disabled = true;
    third.value = 0;
    return;
  }

  third.disabled = false;
  changeNextSelect(event.currentTarget, 'fieldsThird');
});