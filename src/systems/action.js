const ECS = require('@fritzy/ecs');

const ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

export default class ActionSystem extends ECS.System {

  constructor(ecs) {

    super(ecs);
    this.global = this.ecs.getEntity('global').Global;
    this.game = this.global.game;
    this.map = this.global.map;
  }

  update(tick, entities) {
    for (const entity of entities) {
      const actions = [...entity.Action];
      const action = actions[0];
      if (this.global.uiMode === 'equip') {
        if (action.action === '') {
          this.global.uiMode = 'move';
        } else {
          this.equip(entity, action.action);
        }
      } else {
        switch (action.action) {
          case 'up':
          case 'down':
          case 'left':
          case 'right':
            if (this.global.uiMode === 'move') {
              this.move(entity, action.action);
            } else if (this.global.uiMode === 'toggleDoor') {
              this.toggleDoor(entity, action.action);
              this.global.uiMode = 'move';
            }
            break;
          case 'toggleDoor':
            if (this.global.uiMode === 'move') {
              this.global.uiMode = 'toggleDoor';
              this.game.log('Open/close door in which direction?');
            }
            break;
          case 'getItem':
            this.getItem(entity);
            break;
          case 'inventory':
            this.inventory(entity);
            break;
          case 'equip':
            this.global.uiMode = 'equip';
            this.equipList(entity);
            break;
          default:
            this.global.uiMode = 'move';
        }
      }

      entity.removeComponent(action);
    }
  }

  coords(entity) {
    return `${entity.Coordinate.x}x${entity.Coordinate.y}`;
  }

  equipList(entity) {
    this.inventory(entity, 'Equip which item?');
  }

  equip(entity, key) {
    console.log('equip', key);
    const idx = ALPHABET.indexOf(key);
    if (entity.Inventory.slots.size <= idx) {
      this.game.log("Invalid item.");
      this.global.uiMode = 'move';
      return;
    }
    const item = [...entity.Inventory.slots][idx]
    let name = 'an unknown item';
    if (item.Description) name = item.Description.name;
    this.game.log(`Equiping ${name}.`);
    this.global.uiMode = 'move';
  }

  inventory(entity, msg) {
    msg = msg || 'Inventory:';
    if (!entity.Inventory) {
      this.game.log("You don't have an inventory.");
          this.global.uiMode = 'move';
      return;
    }
    const output = [msg];
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
    }
    this.game.log(output.join('\n'));
  }

  getItem(entity) {
    let name = 'You'; if (entity.Description) {
      let name = entity.Description.name;
      name = name.substr(0, 1).toUpperCase() + name.substr(1);
    }
    if (!entity.Inventory || entity.Inventory.max <= entity.Inventory.slots.size) {
      this.game.log(`${name} can't pick anything up because they don't have anywhere to put it!`);
      return;
    }
    const coords = this.coords(entity);
    const tile = this.map.Map.tiles[coords];
    if (!tile.Floor) return;
    if (tile.Floor.items.size === 0) {
      this.game.log(`${name} grope the floor.`);
      return;
    }
    const item = [...tile.Floor.items][0]
    tile.Floor.items.delete(item);
    entity.Inventory.slots.add(item);
    let target = 'a thing';
    if (item.Description) target = item.Description.name;
    this.game.log(`${name} pick up ${target}.`);
  }

  getDirectionCoord(entity, direction) {
    let tx = entity.Coordinate.x;
    let ty = entity.Coordinate.y;
    if (direction === 'up') {
      ty -= 1;
    } else if (direction === 'down') {
      ty += 1;
    } else if (direction === 'left') {
      tx -= 1;
    } else if (direction === 'right') {
      tx += 1;
    }
    return [tx, ty ];
  }

  toggleDoor(entity, direction) {

    const [ x, y ] = this.getDirectionCoord(entity, direction);
    const coords = `${x}x${y}`;
    const tile = this.map.Map.tiles[coords];
    if (tile && tile.Door) {
      if (tile.Door.open) {
        tile.Door.open = false;
        tile.Renderable.fg = 'red';
        tile.Renderable.char = this.game.CHARS.DOOR;
        this.game.log('Closed door.');
      } else {
        tile.Door.open = true;
        tile.Renderable.fg = 'limegreen';
        tile.Renderable.char = this.game.CHARS.DOOROPEN;
        this.game.log('Opened door.');
      }
      return;
    }
    this.game.log('No door in that direction.');
  }

  move(entity, direction) {

    const [ tx, ty ] = this.getDirectionCoord(entity, direction);
    if (ty < 0 || ty >= this.map.Map.height || tx < 0 || tx >= this.map.Map.width) return;
    const coords = `${tx}x${ty}`;
    const oldcoords = `${entity.Coordinate.x}x${entity.Coordinate.y}`;
    const oldtile = this.map.Map.tiles[oldcoords];
    const tile = this.map.Map.tiles[coords];
    if (!tile.Floor || !tile.Tile.passable) return;
    if (tile.Door && !tile.Door.open) {
      this.toggleDoor(entity, direction);
      return;
    }
    if (oldtile.Floor) {
      oldtile.Floor.character = null;
    }
    tile.Floor.character = entity;
    entity.Coordinate.x = tx;
    entity.Coordinate.y = ty;
    for (const item of tile.Floor.items) {
      if (item.Description) {
        this.game.log(`There is a ${item.Description.name} on the floor here.`);
      } else {
        this.game.log(`There is a nondescript item on the floor here.`);
      }
    }
  }

}
ActionSystem.query = {
  has: ['Character', 'Action']
};
