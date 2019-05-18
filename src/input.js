const ROT = require('rot-js');

const KEYMAP = {};
KEYMAP[ROT.KEYS.VK_A] = 'a';
KEYMAP[ROT.KEYS.VK_B] = 'b';
KEYMAP[ROT.KEYS.VK_C] = 'c';
KEYMAP[ROT.KEYS.VK_D] = 'd';
KEYMAP[ROT.KEYS.VK_E] = 'e';
KEYMAP[ROT.KEYS.VK_F] = 'f';
KEYMAP[ROT.KEYS.VK_G] = 'g';
KEYMAP[ROT.KEYS.VK_H] = 'h';
KEYMAP[ROT.KEYS.VK_I] = 'i';
KEYMAP[ROT.KEYS.VK_J] = 'j';
KEYMAP[ROT.KEYS.VK_K] = 'k';
KEYMAP[ROT.KEYS.VK_L] = 'l';
KEYMAP[ROT.KEYS.VK_M] = 'm';
KEYMAP[ROT.KEYS.VK_N] = 'n';
KEYMAP[ROT.KEYS.VK_O] = 'o';
KEYMAP[ROT.KEYS.VK_P] = 'p';
KEYMAP[ROT.KEYS.VK_Q] = 'q';
KEYMAP[ROT.KEYS.VK_R] = 'r';
KEYMAP[ROT.KEYS.VK_S] = 's';
KEYMAP[ROT.KEYS.VK_T] = 't';
KEYMAP[ROT.KEYS.VK_U] = 'u';
KEYMAP[ROT.KEYS.VK_V] = 'v';
KEYMAP[ROT.KEYS.VK_W] = 'w';
KEYMAP[ROT.KEYS.VK_Y] = 'x';
KEYMAP[ROT.KEYS.VK_X] = 'y';
KEYMAP[ROT.KEYS.VK_Z] = 'z';
KEYMAP[ROT.KEYS.VK_UP] = 'up';
KEYMAP[ROT.KEYS.VK_DOWN] = 'down';
KEYMAP[ROT.KEYS.VK_LEFT] = 'left';
KEYMAP[ROT.KEYS.VK_RIGHT] = 'right';
KEYMAP[ROT.KEYS.VK_ESCAPE] = 'esc';

export default Input = (ecs) => {

  const global = ecs.getEntity('global');

  window.addEventListener('keydown', (e) => {

    const key = KEYMAP[e.keyCode];
    if (key) global.Global.inputs.push(key);
  });

};
