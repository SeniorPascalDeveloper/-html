const drawSmile = (svg) => {

    const g = svg.append("g");

    // 1. Основание дома (прямоугольник)
    g.append("rect")
        .attr("x", -50)
        .attr("y", -30)
        .attr("width", 100)
        .attr("height", 60)
        .attr("fill", "pink")
        .attr("stroke", "black");

    // 2. Крыша (треугольник)
    g.append("polygon")
        .attr("points", "-60,-30 0,-80 60,-30")
        .attr("fill", "hotpink");

    // 3. Дверь
    g.append("rect")
        .attr("x", -10)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 30)
        .attr("fill", "deeppink");

    // 4. Окно левое
    g.append("rect")
        .attr("x", -35)
        .attr("y", -15)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "lightblue")
        .attr("stroke", "black");

    // 5. Окно правое
    g.append("rect")
        .attr("x", 20)
        .attr("y", -15)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "lightblue")
        .attr("stroke", "black");



    // 8. Солнце (круг)
    g.append("circle")
        .attr("cx", 0)
        .attr("cy", -50)
        .attr("r", 10)
        .attr("fill", "lightblue");

    return g;
};