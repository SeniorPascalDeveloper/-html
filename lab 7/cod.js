(() => {
  const byId = (id) => document.getElementById(id);

  const modeSelect = byId("mode");
  const showBtn = byId("show");
  const calcBtn = byId("calc");
  const clearBtn = byId("clr");

  const image = byId("img");
  const output = byId("out");
  const findTitle = byId("findTitle");


  const fieldWrap = {
    a: byId("wa"),
    beta: byId("wBeta"),
    h: byId("wh"),
    alpha: byId("wAlpha"),
  };

  const input = {
    a: byId("a"),
    beta: byId("beta"),
    h: byId("h"),
    alpha: byId("alpha"),
  };


  const checkbox = {
    angleBetweenDiagonals: byId("c1"),
    diagonals: byId("c2"),
    perimeter: byId("c3"),
  };


  function toNumber(value) {
    const s = (value || "").trim().replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  }

  function showError(wrapEl, message) {
    wrapEl.classList.add("err");
    wrapEl.querySelector(".e").textContent = message;
  }

  function clearError(wrapEl) {
    wrapEl.classList.remove("err");
    wrapEl.querySelector(".e").textContent = "";
  }


  function clearAllErrors() {
    Object.values(fieldWrap).forEach(clearError);
  }

  const degToRad = (deg) => (deg * Math.PI) / 180;
  const radToDeg = (rad) => (rad * 180) / Math.PI;

  const clamp = (x) => Math.max(-1, Math.min(1, x));

  const fmt = (x) => String(Math.round(x * 1e6) / 1e6);

  function updateFindTitleState() {
    const anySelected =
      checkbox.angleBetweenDiagonals.checked ||
      checkbox.diagonals.checked ||
      checkbox.perimeter.checked;
      if (anySelected) {
        findTitle.classList.remove("bad");
      } else {
        findTitle.classList.add("bad");
      }

  }



 function applyMode() {
  var mode = modeSelect.value;

  if (mode === "m1") {
    fieldWrap.beta.style.display = "none";
    fieldWrap.alpha.style.display = "";

    image.src = "image1.png";
  } else {
    fieldWrap.beta.style.display = "";
    fieldWrap.alpha.style.display = "none";

    image.src = "image2.png";
  }

  output.innerHTML = "";
  clearAllErrors();

  updateFindTitleState();
}



  function clearAll() {
    input.a.value = "";
    input.beta.value = "";
    input.h.value = "";
    input.alpha.value = "";

    output.innerHTML = "";
    clearAllErrors();
    updateFindTitleState();
  }


  function calculate() {
    clearAllErrors();
    output.innerHTML = "";

    if (!updateFindTitleState()) {
      output.innerHTML = "<p>Выберите хотя бы одну характеристику.</p>";
      return;
    }

    const a = toNumber(input.a.value);
    const betaInput = toNumber(input.beta.value);
    const h = toNumber(input.h.value);
    const alphaDeg = toNumber(input.alpha.value);

    let isOk = true;

    if (!(a > 0)) {
      showError(fieldWrap.a, "Введите a > 0");
      isOk = false;
    }
    if (!(h > 0)) {
      showError(fieldWrap.h, "Введите h > 0");
      isOk = false;
    }
    if (!isOk) return;

    const mode = modeSelect.value;
    const isMode1 = mode === "m1";

    let B;        
    let alphaRad; 

    if (isMode1) {

      if (!(alphaDeg > 0 && alphaDeg < 90)) {
        showError(fieldWrap.alpha, "alpha должна быть в (0; 90) градусов");
        return;
      }

      alphaRad = degToRad(alphaDeg);

      const s = Math.sin(alphaRad);
      if (!(s > 0)) {
        showError(fieldWrap.alpha, "sin(alpha) должен быть > 0");
        return;
      }

      B = h / s;
      if (!(B > 0) || !Number.isFinite(B)) {
        showError(fieldWrap.h, "Невозможно вычислить beta по этим данным");
        return;
      }
    } else {

      if (!(betaInput > 0)) {
        showError(fieldWrap.beta, "Введите beta > 0");
        return;
      }

      if (h > betaInput) {
        showError(fieldWrap.h, "h не может быть больше beta");
        return;
      }


      alphaRad = Math.asin(clamp(h / betaInput, 0, 1));


      if (!(alphaRad > 0 && alphaRad < Math.PI / 2)) {
        showError(fieldWrap.h, "Получился угол 0° или 90° (вырождение/прямой угол)");
        return;
      }

      B = betaInput;
    }


    const cosA = Math.cos(alphaRad);

    const d1 = Math.sqrt(a * a + B * B - 2 * a * B * cosA); 
    const d2 = Math.sqrt(a * a + B * B + 2 * a * B * cosA); 


    const P = 2 * (a + B);


    const cosPhi = clamp(Math.abs(a * a - B * B) / (d1 * d2), 0, 1);
    const phiDeg = radToDeg(Math.acos(cosPhi));

 
    let html = "<h4>Результаты</h4><ul>";

    if (checkbox.angleBetweenDiagonals.checked) {
      html += `<li>Угол между диагоналями: <b>${fmt(phiDeg)}°</b></li>`;
    }
    if (checkbox.diagonals.checked) {
      html += `<li>Диагональ d1 (короче): <b>${fmt(d1)}</b></li>`;
      html += `<li>Диагональ d2 (длиннее): <b>${fmt(d2)}</b></li>`;
    }
    if (checkbox.perimeter.checked) {
      html += `<li>Периметр: <b>${fmt(P)}</b></li>`;
    }

    html += "</ul>";
    output.innerHTML = html;
  }


  input.a.addEventListener("input", () => clearError(fieldWrap.a));
  input.beta.addEventListener("input", () => clearError(fieldWrap.beta));
  input.h.addEventListener("input", () => clearError(fieldWrap.h));
  input.alpha.addEventListener("input", () => clearError(fieldWrap.alpha));


  checkbox.angleBetweenDiagonals.addEventListener("change", updateFindTitleState);
  checkbox.diagonals.addEventListener("change", updateFindTitleState);
  checkbox.perimeter.addEventListener("change", updateFindTitleState);

  showBtn.addEventListener("click", applyMode);
  calcBtn.addEventListener("click", calculate);
  clearBtn.addEventListener("click", clearAll);


  applyMode();
})();
