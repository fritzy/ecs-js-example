const ECS = require('@fritzy/ecs');

export default class InputSystem extends ECS.System {

  update(tick, globals) {
    const global = this.ecs.getEntity('global');
    const inputs = global.Global.inputs;
    const player = global.Global.player;
    while (inputs.length) {
      const input = inputs.shift();
      if (player) {
        player.addComponent('Action', {
          action: input
        });
      }
    }
  }
}
InputSystem.query = {
};
