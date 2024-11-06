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
const vertexIndices = new Uint16Array([
  1, 2, 0,
  0, 2, 3
])
const indicesBuffer = gl.createBuffer();

const positionAttrib = gl.getAttribLocation(program, "positions");
const uvsAttrib = gl.getAttribLocation(program, "uvs");

// Texture
// prettier-ignore
const uvs = new Float32Array([
  0, 0,
  1, 0,
  1, 1,
  0, 1
]);
const uvsBuffer = gl.createBuffer();
const myTexture = gl.createTexture();

// Plug texture unit 0 to the sampler
gl.useProgram(program);
const textureSampler = gl.getUniformLocation(program, "myTexture");
gl.uniform1i(textureSampler, 0);

const image = new Image();
image.onload = () => {
  // Bind texture to the buffer
  gl.bindTexture(gl.TEXTURE_2D, myTexture);

  // Flip UVs
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  // Make texture repeat itself on st (xy)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

  // Interpolation and subsampling
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Supply image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Unset the buffer
  gl.bindTexture(gl.TEXTURE_2D, null);
};
image.src = "/water-texture.png";

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
    // Bind js uvs to array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, uvsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

    // Plug shader's colors attribute to array buffer
    gl.enableVertexAttribArray(uvsAttrib);

    // Inform about how to consume the data
    gl.vertexAttribPointer(uvsAttrib, 2, gl.FLOAT, false, 0, 0);
  }

  {
    // Bind js indexes to indices buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexIndices, gl.STATIC_DRAW);
  }

  if (image.complete) {
    // Activate texture unit 0 and bind myTexture to it
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, myTexture);
  }

  gl.useProgram(program);
  gl.drawElements(gl.TRIANGLES, vertexIndices.length, gl.UNSIGNED_SHORT, 0);
}
