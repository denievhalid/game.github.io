let targetCell = null;

const cells = document.querySelectorAll(".cell");
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("mousedown", mouseDown, false);
  card.addEventListener("dragstart", dragStart);
});

function mouseDown(e) {
  let element = this;
  let dragged = [];

  if (!element.classList.contains("open")) {
    return;
  }

  while (element) {
    if (element instanceof HTMLElement) {
      const { left, top } = element.getBoundingClientRect();

      const diff = {
        x: e.clientX - left,
        y: e.clientY - top,
      };

      dragged.push({
        el: element,
        cell: this.parentNode,
        diff,
        top: element.style.top,
        left: element.style.left,
      });
    }

    element = element.nextSibling;
  }

  dragged.forEach((drag, i) => {
    drag.el.style.zIndex = 1000 + i;
    document.body.append(drag.el);
  });

  move(e.pageX, e.pageY);

  function move(x, y) {
    dragged.forEach(({ el, cell, diff }, i) => {
      if (i == 0) {
        el.hidden = true;
        targetCell = document.elementFromPoint(x, y);
        el.hidden = false;
      }

      if (
        targetCell instanceof HTMLImageElement &&
        targetCell.parentNode !== cell
      ) {
      } else {
        targetCell = null;
      }

      el.style.left = x - diff.x + "px";
      el.style.top = y - diff.y + "px";
    });
  }

  function mouseMove(e) {
    move(e.pageX, e.pageY);
  }

  document.addEventListener("mousemove", mouseMove);

  this.onmouseup = () => {
    document.removeEventListener("mousemove", mouseMove);

    if (targetCell) {
      dragged.forEach((drag) => {
        console.log(drag.cell);
        drag.cell = targetCell.parentNode;
        console.log(drag.cell);
      });
      targetCell = null;
    }

    dragged.forEach(({ el, cell, top, left }) => {
      cell.append(el);
    });

    cells.forEach((cell) => {
      cell.querySelectorAll(".card").forEach((card, i) => {
        card.style.zIndex = i;
        card.style.top = `${i * 8}px`;
        card.style.left = "0px";
      });
    });
  };
}

function dragStart(e) {
  e.preventDefault();
}
