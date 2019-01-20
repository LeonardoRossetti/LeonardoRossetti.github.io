const el = document.querySelector("#module");

el.addEventListener("mousemove", (e) => {
  el.style.setProperty('--x', -e.offsetX + "px");
  el.style.setProperty('--y', -e.offsetY + "px");
});

