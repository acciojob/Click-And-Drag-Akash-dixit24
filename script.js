// Your code here.
//Your code goes here 

const container = document.querySelector('.items');
const cubes = document.querySelectorAll('.item');

let activeCube = null;
let offsetX = 0;
let offsetY = 0;

// Set all cubes to absolute positioning inside container
cubes.forEach(cube => {
  cube.style.position = "absolute";

  // Give each cube a starting position (grid-like)
  const index = Number(cube.textContent) - 1;
  const col = index % 5;
  const row = Math.floor(index / 5);

  cube.style.left = `${col * 160}px`;
  cube.style.top = `${row * 160}px`;

  cube.addEventListener("mousedown", startDrag);
});

function startDrag(e) {
  activeCube = e.target;

  const rect = activeCube.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
  if (!activeCube) return;

  const containerRect = container.getBoundingClientRect();
  const cubeRect = activeCube.getBoundingClientRect();

  // New position
  let newLeft = e.clientX - containerRect.left - offsetX;
  let newTop = e.clientY - containerRect.top - offsetY;

  // Boundary restrictions
  const maxLeft = containerRect.width - cubeRect.width;
  const maxTop = containerRect.height - cubeRect.height;

  if (newLeft < 0) newLeft = 0;
  if (newTop < 0) newTop = 0;
  if (newLeft > maxLeft) newLeft = maxLeft;
  if (newTop > maxTop) newTop = maxTop;

  activeCube.style.left = `${newLeft}px`;
  activeCube.style.top = `${newTop}px`;
}

function stopDrag() {
  activeCube = null;

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
}
