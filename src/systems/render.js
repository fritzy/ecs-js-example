const ECS = require('@fritzy/ecs');

export default class RenderSystem extends ECS.System {

  constructor(ecs, display) {
    super(ecs);
    this.display = display;
  }

  update(tick, entities) {
    const entities2 = this.query.filter(this.lastTick);
    for (const entity of entities2) {
      this.display.draw(entity.Coordinate.x, entity.Coordinate.y, entity.Renderable.char, entity.Renderable.fg, entity.Renderable.bg);
      if (entity.Floor) {
        for (const item of entity.Floor.items) {
          this.display.draw(item.Coordinate.x, item.Coordinate.y, item.Renderable.char, item.Renderable.fg, item.Renderable.bg);
        }
      }
    }
    const characters = this.ecs.queryEntities({
      has: ['Character', 'Renderable'],
      persist: 'system-render-chars',
      updatedValues: this.lastTick
    });
    for (const entity of characters) {
      this.display.draw(entity.Coordinate.x, entity.Coordinate.y, entity.Renderable.char, entity.Renderable.fg, entity.Renderable.bg);
    }
  }
}
RenderSystem.query = {
  has: ['Tile']
};
