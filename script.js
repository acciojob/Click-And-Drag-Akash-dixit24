// Your code here.
const container = document.querySelector('.items');
const cubes = Array.from(document.querySelectorAll('.item'));

let activeCube = null;
let startOffsetX = 0;
let startOffsetY = 0;

if (getComputedStyle(container).position === 'static') {
  container.style.position = 'relative';
}

cubes.forEach(cube => {
  cube.style.position = 'absolute';
  cube.style.touchAction = 'none'; // avoid default touch behavior
  // initial grid placement (5 columns)
  const index = Number(cube.textContent) - 1;
  const cols = 5;
  const gapX = 10;
  const gapY = 10;
  const cubeW = 200; // matches CSS .item width
  const cubeH = Math.max(100, (container.clientHeight - 40)); // fallback
  const col = index % cols;
  const row = Math.floor(index / cols);
  cube.style.left = `${col * (cubeW + gapX)}px`;
  cube.style.top = `${row * (160)}px`;
  cube.style.userSelect = 'none';
  cube.style.cursor = 'grab';

  // pointer events
  cube.addEventListener('pointerdown', startDrag);
  cube.addEventListener('mousedown', startDrag); // fallback
});

function getContainerSpace() {
  // inner width/height available for positioning
  return {
    width: container.clientWidth,
    height: container.clientHeight
  };
}

function startDrag(e) {
  e.preventDefault();
  const target = e.target.closest('.item');
  if (!target) return;

  activeCube = target;

  // remove CSS transforms while dragging to avoid offset issues
  activeCube.__savedTransform = activeCube.style.transform || '';
  activeCube.style.transform = 'none';

  // Bring it to front
  activeCube.style.zIndex = 1000;
  activeCube.style.cursor = 'grabbing';

  const cubeRect = activeCube.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // compute pointer coordinates relative to container (account for scroll)
  const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
  const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);

  const relativeX = clientX - containerRect.left + container.scrollLeft;
  const relativeY = clientY - containerRect.top + container.scrollTop;

  // start offsets inside the cube
  startOffsetX = relativeX - (cubeRect.left - containerRect.left + container.scrollLeft);
  startOffsetY = relativeY - (cubeRect.top - containerRect.top + container.scrollTop);

  // attach move/up listeners to window so dragging continues outside container
  window.addEventListener('pointermove', onDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
}

function onDrag(e) {
  if (!activeCube) return;
  e.preventDefault();

  const containerRect = container.getBoundingClientRect();
  const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX);
  const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0].clientY);

  // mouse relative to container left/top (account for scrolling)
  let x = clientX - containerRect.left + container.scrollLeft - startOffsetX;
  let y = clientY - containerRect.top + container.scrollTop - startOffsetY;

  const cw = activeCube.offsetWidth;
  const ch = activeCube.offsetHeight;
  const { width: maxW, height: maxH } = getContainerSpace();

  // boundary constraints - keep inside container
  const maxLeft = Math.max(0, maxW - cw);
  const maxTop  = Math.max(0, maxH - ch);

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxLeft) x = maxLeft;
  if (y > maxTop) y = maxTop;

  activeCube.style.left = `${x}px`;
  activeCube.style.top = `${y}px`;
}

function endDrag(e) {
  if (!activeCube) return;

  // restore transform, cursor and z-index
  activeCube.style.transform = activeCube.__savedTransform || '';
  activeCube.style.cursor = 'grab';
  activeCube.style.zIndex = '';

  // cleanup
  window.removeEventListener('pointermove', onDrag);
  window.removeEventListener('pointerup', endDrag);
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);

  activeCube = null;
}
