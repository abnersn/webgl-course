attribute vec4 positions;
attribute vec4 colors;

varying vec4 v_colors;

void main() {
  gl_Position = positions;

  v_colors = colors;
}