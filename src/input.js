const ROT = require('rot-js');

export default Input = (ecs) => {

  const global = ecs.getEntity('global');

  window.addEventListener('keydown', (e) => {
    let key = '';
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
    }
    if (key) global.Global.inputs.push(key);
  });

};
