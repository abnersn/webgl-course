import { setupProgram } from "./utils";

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 512;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

/* Setup canvas element */
canvas.width = CANVAS_WIDTH * devicePixelRatio;
canvas.height = CANVAS_HEIGHT * devicePixelRatio;
canvas.style.setProperty("width", `${CANVAS_WIDTH}px`);
canvas.style.setProperty("height", `${CANVAS_HEIGHT}px`);

const gl = canvas.getContext("webgl")!;

const { program } = setupProgram(gl);

// prettier-ignore
const vertexPositions = new Float32Array([
  -1, -1,
  1, -1,
  1, 1,
  -1, 1,
]);
const vertexBuffer = gl.createBuffer();

// prettier-ignore
const vertexColors = new Float32Array([
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
  0.5, 0.3, 0.2
]);
const colorsBuffer = gl.createBuffer();

// prettier-ignore
const vertexIndices = new Uint16Array([
  1, 2, 0,
  0, 2, 3
])
const indicesBuffer = gl.createBuffer();

const positionAttrib = gl.getAttribLocation(program, "positions");
const colorsAttrib = gl.getAttribLocation(program, "colors");

// Rendering loop
requestAnimationFrame(renderFrame);
function renderFrame() {
  requestAnimationFrame(renderFrame);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0.1, 0.1, 0.1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  {
    // Bind js vertex positions to array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

    // Plug shader's position attribute to array buffer
    gl.enableVertexAttribArray(positionAttrib);

    // Inform about how to consume the data
    gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
  }

  {
    // Bind js colors to array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);

    // Plug shader's colors attribute to array buffer
    gl.enableVertexAttribArray(colorsAttrib);

    // Inform about how to consume the data
    gl.vertexAttribPointer(colorsAttrib, 3, gl.FLOAT, false, 0, 0);
  }

  {
    // Bind js indexes to indices buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);
  }

  gl.useProgram(program);
  gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0);
}
