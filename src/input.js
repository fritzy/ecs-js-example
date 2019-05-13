const ROT = require('rot-js');

export default Input = (ecs) => {

  const global = ecs.getEntity('global');

  window.addEventListener('keydown', (e) => {
    let key = '';
    if (global.Global.uiMode === 'equip') {
      switch (e.keyCode) {
        case ROT.KEYS.VK_A:
          key = 'a';
          break;
        case ROT.KEYS.VK_B:
          key = 'b';
          break;
        case ROT.KEYS.VK_C:
          key = 'c';
          break;
        case ROT.KEYS.VK_D:
          key = 'd';
          break;
        case ROT.KEYS.VK_E:
          key = 'e';
          break;
        case ROT.KEYS.VK_F:
          key = 'f';
          break;
        case ROT.KEYS.VK_G:
          key = 'g';
          break;
        case ROT.KEYS.VK_H:
          key = 'h';
          break;
        case ROT.KEYS.VK_I:
          key = 'i';
          break;
        case ROT.KEYS.VK_J:
          key = 'j';
          break;
        case ROT.KEYS.VK_K:
          key = 'k';
          break;
        case ROT.KEYS.VK_L:
          key = 'l';
          break;
        case ROT.KEYS.VK_M:
          key = 'm';
          break;
        case ROT.KEYS.VK_N:
          key = 'n';
          break;
        case ROT.KEYS.VK_O:
          key = 'o';
          break;
        case ROT.KEYS.VK_P:
          key = 'p';
          break;
        case ROT.KEYS.VK_Q:
          key = 'q';
          break;
        case ROT.KEYS.VK_R:
          key = 'r';
          break;
        case ROT.KEYS.VK_S:
          key = 's';
          break;
        case ROT.KEYS.VK_T:
          key = 't';
          break;
        case ROT.KEYS.VK_U:
          key = 'u';
          break;
        case ROT.KEYS.VK_V:
          key = 'v';
          break;
        case ROT.KEYS.VK_W:
          key = 'w';
          break;
        case ROT.KEYS.VK_X:
          key = 'x';
          break;
        case ROT.KEYS.VK_Y:
          key = 'y';
          break;
        case ROT.KEYS.VK_Z:
          key = 'z';
          break;
      }
    } else {
      switch (e.keyCode) {
        case ROT.KEYS.VK_UP:
        case ROT.KEYS.VK_K:
          key = 'up';
          break;
        case ROT.KEYS.VK_DOWN:
        case ROT.KEYS.VK_J:
          key = 'down';
          break;
        case ROT.KEYS.VK_LEFT:
        case ROT.KEYS.VK_H:
          key = 'left';
          break;
        case ROT.KEYS.VK_RIGHT:
        case ROT.KEYS.VK_L:
          key = 'right';
          break;
        case ROT.KEYS.VK_C:
          key = 'toggleDoor';
          break;
        case ROT.KEYS.VK_G:
          key = 'getItem';
          break;
        case ROT.KEYS.VK_I:
          key = 'inventory';
          break;
        case ROT.KEYS.VK_E:
          key = 'equip';
          break;
      }
    }
    if (key) global.Global.inputs.push(key);
  });

};
