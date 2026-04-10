const clearTable = (idTable) => {
    const table = document.getElementById(idTable);
    if (table) {
        table.innerHTML = '';
    }
};

const createBodyRows = (data) => {
    const tbody = document.createElement('tbody');
    for(let i = 0; i < data.length; i++){
        const tr = document.createElement('tr');
        for (let key in data[i]) {
            const td = document.createElement('td');
            td.innerHTML = data[i][key];
            tr.append(td);
        }
        tbody.append(tr);
    }
    return tbody;
};

const createHeaderRow = (headers) => {
    const tr = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.innerHTML = header;
        tr.append(th);
    });
    return tr;
};

const createTable = (data, idTable) => {
    const table = document.getElementById(idTable);
    const header = Object.keys(data[0]);

    const headerRow = createHeaderRow(header);
    table.append(headerRow);
	

	const bodyRows = createBodyRows(data);
    table.append(bodyRows);
};

