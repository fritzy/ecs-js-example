const ECS = require('@fritzy/ecs');

const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const MODES = new Set(['move', 'select', 'death']);

export default class InputSystem extends ECS.System {

  constructor(ecs) {

    super(ecs);
    this.global = this.ecs.getEntity('global').Global;
    this.player = this.global.player;
    this.game = this.global.game;
    this.item = null;
  }

  update(tick, globals) {

    const inputs = this.global.inputs;
    if (this.global.uiMode && !this.player) {
      this.global.uiMode === 'dead';
    }
    while (inputs.length) {
      const input = inputs.shift();
      if (input === 'esc') {
        this.global.uiMode = 'move';
        continue;
      }
      console.log('uiMode', this.global.uiMode);
      if (this.global.uiMode === 'move') {
        switch (input) {
          case 'k':
          case 'up':
            this.player.addComponent('Action', {
              action: 'moveNorth'
            });
            break;
          case 'j':
          case 'down':
            this.player.addComponent('Action', {
              action: 'moveSouth'
            });
            break;
          case 'h':
          case 'left':
            this.player.addComponent('Action', {
              action: 'moveWest'
            });
            break;
          case 'l':
          case 'right':
            this.player.addComponent('Action', {
              action: 'moveEast'
            });
            break;
          case 'g':
            this.player.addComponent('Action', {
              action: 'getItem'
            });
            break;
          case 'i':
            this.inventory();
            break;
        }
      } else if (this.global.uiMode === 'select') {
        const item = this.selectItem(input);
        if (item) {
          this.describeItem(item);
          this.item = item;
          this.global.uiMode = 'selected';
        } else {
          this.global.uiMode = 'move';
        }
      } else if (this.global.uiMode === 'selected') {
        switch (input) {
          case 'd':
            this.player.addComponent('Action', {
              action: 'drop',
              subject: this.item
            });
            break;
          case 'e':
            this.player.addComponent('Action', {
              action: 'equip',
              subject: this.item
            });
            break;
        }
      }
    }
  }

  describeItem(item) {

    if (item.Description) {
      this.game.log(`${item.Description.name}\n${item.Description.text}`);
    } else {
      this.game.log('This item is a mystery to you.');
    }
    if (item.Equipable) {
      this.game.log('You can equip this item by pressing E.');
    }
    this.game.log('You can drop this item by pressing D.');
    this.game.uiMode = 'selected';
  }

  selectItem(key) {

    const entity = this.player;
    const idx = ALPHABET.indexOf(key);
    if (entity.Inventory.slots.size <= idx) {
      this.game.log("Invalid item.");
      this.global.uiMode = 'move';
      return;
    }
    return [...entity.Inventory.slots][idx]
  }

  inventory() {

    const entity = this.global.player;
    if (!entity.Inventory) {
      this.game.log("You don't have an inventory.");
      this.global.uiMode = 'move';
      return;
    }
    const output = ['Inventory:'];
    let idx = 0;
    for (const item of entity.Inventory.slots) {
      if (item.Description) {
        output.push(`${ALPHABET[idx]}) ${item.Description.name}`);
      } else {
        output.push(`${ALPHABET[idx]}) an unknown item`);
      }
      idx++;
    }
    if (output.length === 1) {
      output.push('  empty');
      this.global.uiMode = 'move';
    } else {
      output.push(' Press letter or ESC.');
      this.global.uiMode = 'select';
    }
    this.game.log(output.join('\n'));
  }
}
InputSystem.query = {
};
