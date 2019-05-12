const ECS = require('@fritzy/ecs');

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
            break;
          }
        default:
          this.global.uiMode = 'move';

      }

      entity.removeComponent(action);
    }
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
