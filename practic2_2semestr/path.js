// создаем массив точек буквой "Г"
function createPathG() {
    const svg = d3.select("svg");
    const width = svg.attr("width");
    const height = svg.attr("height");

    let data = [];
    const padding = 100;

    let posX = padding;
    let posY = height - padding;
    const h = 5;

    // вверх
    while (posY > padding) {
        data.push({ x: posX, y: posY });
        posY -= h;
    }

    // вправо
    while (posX < width - padding) {
        data.push({ x: posX, y: posY });
        posX += h;
    }

    return data;
}


// создаем массив точек по кругу
function createPathCircle() {
    const svg = d3.select("svg");
    const width = svg.attr("width");
    const height = svg.attr("height");

    let data = [];

    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
        data.push({
            x: width / 2 + width / 3 * Math.sin(t),
            y: height / 2 + height / 3 * Math.cos(t)
        });
    }

    return data;
}

function createCustomPath() {
    return [
        { x: 100, y: 100 },  

        { x: 500, y: 200 },  

        { x: 100, y: 300 }   
    ];
}

// создаем путь из массива точек
const drawPath = (typePath) => {

    let dataPoints;

    if (typePath == 0) {
        dataPoints = createPathG();
    } else if (typePath == 1) {
        dataPoints = createPathCircle();
    } else {
        dataPoints = createCustomPath(); 
    }

    const line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    const svg = d3.select("svg");

    const path = svg.append("path")
        .attr("d", line(dataPoints))
        .attr("stroke", "none")   
        .attr("fill", "none");

    return path;
};


// функция движения вдоль пути
function translateAlong(path) {

    const length = path.getTotalLength();

    return function () {
        return function (t) {

            const point = path.getPointAtLength(t * length);

            return `translate(${point.x},${point.y})`;
        };
    };
}