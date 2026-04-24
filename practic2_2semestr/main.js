document.addEventListener("DOMContentLoaded", function() {
    const width = 600;
    const height = 600;      
    const svg = d3.select("svg")
       .attr("width", width)
       .attr("height", height);

    const form = document.getElementById("setting");
    const animatePath = document.getElementById("animatePath");
    const drawBtn = document.getElementById("drawBtn");
    const animateToggle = document.getElementById("animateToggle");
    const hideElements = document.querySelectorAll(".hide");
    
    // ← ДОБАВИТЬ эти две строки:
    const coordinateSpan = document.getElementById("coordinate");
    const pathSpan = document.getElementById("path");

    document.getElementById("drawBtn").addEventListener("click", function(){
        draw(form);
    });

    document.getElementById("clearBtn").addEventListener("click", function(){
        svg.selectAll('*').remove();
    });

    document.getElementById("animateBtn").addEventListener("click", function(){
        runAnimation(form);
    });

    animateToggle.addEventListener("change", function() {
        hideElements.forEach(el => {
            if (this.checked) {
                el.classList.remove("hide");
            } else {
                el.classList.add("hide");
            }
        });

        if (this.checked) {
            drawBtn.classList.add("hide");
        } else {
            drawBtn.classList.remove("hide");
        }

        if (this.checked) {
        } else {
            pathSpan.classList.add("hideSecond");
            coordinateSpan.classList.remove("hideSecond");
            animatePath.checked = false;
        }
    });
    
    animatePath.addEventListener("change", function() {
        if (this.checked) {
            coordinateSpan.classList.add("hideSecond");
            pathSpan.classList.remove("hideSecond");
        } else {
            coordinateSpan.classList.remove("hideSecond");
            pathSpan.classList.add("hideSecond");
        }
    });
});

const draw = (dataForm) => {
    const svg = d3.select("svg");
    let pict = drawSmile(svg);
    let scaleX = dataForm.scaleX.value || 1;
    let scaleY = dataForm.scaleY.value || 1;
    
    pict.attr("transform", `translate(${dataForm.cx.value},
                                      ${dataForm.cy.value}) 
                            scale(${scaleX}, ${scaleY})
                            rotate(${dataForm.angle.value})`);
};



const runAnimation = (dataForm) => {

    const svg = d3.select("svg");
    let pict = drawSmile(svg);

    if (!animatePath.checked){

        
    const x1 = +dataForm.cx.value;
    const y1 = +dataForm.cy.value;
    const angle1 = +dataForm.angle.value || 0;
    const scaleX1 = +dataForm.scaleX.value || 1;
    const scaleY1 = +dataForm.scaleY.value || 1;

    const x2 = +dataForm.cx2.value;
    const y2 = +dataForm.cy2.value;
    const angle2 = +dataForm.angle2.value || 0;
    const scaleX2 = +dataForm.scaleX2.value || 1;
    const scaleY2 = +dataForm.scaleY2.value || 1;

    let easeType;
    switch (dataForm.easeType.value) {
        case "elastic": easeType = d3.easeElastic; break;
        case "bounce":  easeType = d3.easeBounce;  break;
        default:        easeType = d3.easeLinear;
    }

    animatePath.checked = false;

    pict.attr("transform", `translate(${x1}, ${y1}) scale(${scaleX1}, ${scaleY1}) rotate(${angle1})`);

    pict.transition()
        .duration(6000)
        .ease(easeType)
        .attr("transform", `translate(${x2}, ${y2}) scale(${scaleX2}, ${scaleY2}) rotate(${angle2})`);
        
    } else {

    const pathType = +document.getElementById("pathType").value;
    const duration = +document.getElementById("duration").value || 6000;

    let path = drawPath(pathType);

    let easeType;
    switch (dataForm.easeType.value) {
        case "elastic": easeType = d3.easeElastic; break;
        case "bounce":  easeType = d3.easeBounce;  break;
        default:        easeType = d3.easeLinear;
    }

    // берём значения из формы
    const scaleX1 = +dataForm.scaleX.value || 1;
    const scaleY1 = +dataForm.scaleY.value || 1;
    const scaleX2 = +dataForm.scaleX2.value || 1;
    const scaleY2 = +dataForm.scaleY2.value || 1;

    const angle1 = +dataForm.angle.value || 0;
    const angle2 = +dataForm.angle2.value || 0;

    pict.transition()
        .duration(duration)
        .ease(easeType)
        .attrTween('transform', function () {

            const length = path.node().getTotalLength();

            return function (t) {

                const point = path.node().getPointAtLength(t * length);


                const scaleX = scaleX1 + (scaleX2 - scaleX1) * t;
                const scaleY = scaleY1 + (scaleY2 - scaleY1) * t;
                const angle = angle1 + (angle2 - angle1) * t;

                return `translate(${point.x},${point.y})
                        scale(${scaleX}, ${scaleY})
                        rotate(${angle})`;
            };
        });
}
};