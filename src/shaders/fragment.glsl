precision highp float;

uniform sampler2D myTexture;

varying vec2 v_uvs;

void main() {
  vec4 textureColor = texture2D(myTexture, v_uvs);
  gl_FragColor = textureColor;
}