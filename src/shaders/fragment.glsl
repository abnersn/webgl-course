precision highp float;

uniform float time;
uniform sampler2D myTexture;

varying vec2 v_uvs;

void main() {
  vec2 augmented_uvs = v_uvs;

  augmented_uvs.x -= time * 0.001;
  augmented_uvs.x += sin(augmented_uvs.y * 13.0 + time / 3.0) * 0.013 + 0.4;
  augmented_uvs.x += sin(augmented_uvs.y * 17.0 + time / 5.0) * 0.014 + 0.7;
  augmented_uvs.x += sin(augmented_uvs.y * 37.0 + time / 7.0) * 0.015 + 0.3;

  augmented_uvs.y -= time * 0.002;
  augmented_uvs.y += sin(augmented_uvs.x * 27.0 + time / 3.0) * 0.01 + 0.34;
  augmented_uvs.y += sin(augmented_uvs.x * 31.0 + time / 5.0) * 0.01 + 0.22;
  augmented_uvs.y += sin(augmented_uvs.x * 43.0 + time / 7.0) * 0.01 + 0.98;

  augmented_uvs *= 2.0;
  vec4 textureColor = texture2D(myTexture, augmented_uvs);
  gl_FragColor = textureColor;
}