import fragmentShaderSrc from "src/shaders/fragment.glsl";
import vertexShaderSrc from "src/shaders/vertex.glsl";

function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }
  const message = gl.getShaderInfoLog(shader) || "Error creating shader";
  gl.deleteShader(shader);
  throw new Error(message);
}

export function setupShaders(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSrc
  );

  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return {
      program,
      vertexShader,
      fragmentShader,
    };
  }
  const errorMsg = gl.getProgramInfoLog(program) || "Error creating program";
  gl.deleteProgram(program);
  throw new Error(errorMsg);
}
