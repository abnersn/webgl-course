attribute vec4 positions;
attribute vec2 uvs;

varying vec2 v_uvs;

void main() {
  gl_Position = positions;

  v_uvs = uvs;
}