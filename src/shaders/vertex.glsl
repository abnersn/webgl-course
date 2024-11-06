attribute vec4 position;
attribute vec4 colors;

varying vec4 v_colors;

void main() {
  gl_Position = position;

  v_colors = colors;
}