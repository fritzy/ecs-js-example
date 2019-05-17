const ECS = require('@fritzy/ecs');
const ROT = require('rot-js');
import StayDown from 'staydown'
import * as ComponentExports from './components';
import InputSystem from './systems/input';
import RenderSystem from './systems/render';
import ActionSystem from './systems/action';
import Input from './input';

const options = {
  layout: "tile",
  bg: "black",
  tileWidth: 16,
  tileHeight: 16,
  tileSet: null,
  tileMap: {
  },
  tileColorize: true,
  width: 40,
  height: 40
};

const TICKLENGTH = 1000 / 60;

export default class Game {

  constructor(container, logdiv, tileSet) {

    this.container = container;
    this.logdiv = logdiv;
    this.CHARS = this.constructor.CHARS;
    this.ecs = new ECS.ECS();
    this.toggleHighlight = false;

    this.staydown = new StayDown({
      target: this.logdiv,
      max: 40,
      stickyHeight: 10,
    });

    // load & map tileset
    options.tileSet = tileSet
    let charCode = 0;
    for (let row = 0; row < 256; row += 16) {
      for (let col = 0; col < 256; col += 16) {
        const char = String.fromCharCode(charCode);
        options.tileMap[char] = [col, row]
        charCode++;
      }
    }

    this.registerComponents();

    this.display = new ROT.Display(options);
    this.map = new ROT.Map.Uniform(options.width, options.height)

    this.mapEntity = this.ecs.createEntity({
      id: 'map',
      Map: {
        width: options.width,
        height: options.height,
        map: this.map
      }
    });

    this.global = this.ecs.createEntity({
      id: 'global',
      Global: {
        game: this,
        map: this.mapEntity
      }
    });

    this.player = this.ecs.createEntity({
      Character: {
      },
      Player: {
      },
      Coordinate: {
      },
      Inventory: {
      },
      EquipmentSlot: {
        leftHand: {
          slotType: 'hand'
        },
        rightHand: {
          slotType: 'hand'
        },
        shoulders: {
          slotType: 'shoulders'
        },
        leftRing: {
          slotType: 'ring'
        },
        rightRing: {
          slotType: 'ring'
        },
        legs: {
          slotType: 'legs'
        },
        feet: {
          slotType: 'feet'
        }
      },
      Renderable: {
        char: '@',
        fg: 'limegreen'
      }
    });
    this.global.Global.player = this.player;


    this.createMap();
    Input(this.ecs);

    this.ecs.addSystem('input', InputSystem);
    this.ecs.addSystem('action', ActionSystem);
    this.ecs.addSystem('render', new RenderSystem(this.ecs, this.display));

    this.lastUpdate = performance.now();
    this.tickTime = 0;
    this.log("It's the end of the world as we know it and I feel fine! I'm really not sure how I'm supposed to feel about it though.");
    this.log("It's the end of the world as we know it and I feel fine! I'm really not sure how I'm supposed to feel about it though.");
    this.update(this.lastUpdate);
  }

  createMap() {

    this.map.create((x, y, v) => {
      const tile = this.ecs.createEntity({
        Tile: {
          passable: !!v,
        },
        Coordinate: {
          x,
          y
        },
        Renderable: {
          char: v,
          fg: 'white'
        }
      });
      if (v) {
        tile.addComponent('Wall', {});
        //this.display.draw(x, y, this.CHARS.WALL);
        tile.Renderable.char = this.CHARS.WALL;
      } else {
        tile.addComponent('Floor', {});
        tile.Renderable.char = this.CHARS.FLOOR;
        tile.Renderable.fg = 'gray';
        tile.Tile.passable = true;
      }
      this.mapEntity.Map.tiles[`${x}x${y}`] = tile;
      //display.DEBUG(x, y, v);
    });
    for (const room of this.map.getRooms()) {
      if (this.player.Coordinate.x === 0) {
        const coords = room.getCenter()
        this.player.Coordinate.x = coords[0];
        this.player.Coordinate.y = coords[1];
        this.mapEntity.Map.tiles[`${coords[0]}x${coords[1]}`].Floor.character = this.player;
      }
      room.getDoors((x, y) => {
        const coords = `${x}x${y}`;
        const tile = this.mapEntity.Map.tiles[coords];
        if (!tile.Door) {
          tile.addComponent('Door', {});
          tile.Renderable.char = this.CHARS.DOOR;
          tile.Renderable.fg = 'red';
        }
        //this.display.draw(x, y, this.CHARS.DOOR, 'red');
      });
      if (ROT.RNG.getPercentage() > 49) {
        const count = Math.ceil(ROT.RNG.getUniform() * 2);
        const itemTypes = ['ring', 'sword', 'book'];
        const top = room.getTop();
        const height = room.getBottom() - top;
        const left = room.getLeft();
        const width = room.getRight() - left;
        for (let idx = 0; idx < count; idx++) {
          const type = ROT.RNG.getItem(itemTypes);
          let y = top + Math.floor(ROT.RNG.getUniform() * height)
          let x = left + Math.floor(ROT.RNG.getUniform() * width)
          this.log(`item: ${x}x${y}`);
          const item = this.ecs.createEntity({
            Item: {},
            Description: {
              name: type,
            },
            Coordinate: {
              x,
              y
            },
            Renderable: {
              char: 't'
            }
          });
          if (type === 'ring') {
            item.Renderable.char = 'o';
            item.addComponent('Equipable', {
              slotType: 'ring'
            });
          } else if (type === 'sword') {
            item.Renderable.char = 'T';
            item.addComponent('Equipable', {
              slotType: 'hand'
            });
          } else if (type === 'book') {
            item.Renderable.char = 'B';
          }
          this.mapEntity.Map.tiles[`${x}x${y}`].Floor.items.add(item);
        }
      }
    }
    this.container.appendChild(this.display.getContainer());
  }

  log(msgs) {

    msgs = msgs.split('\n');
    for (const msg of msgs) {
      const p = document.createElement('p');
      const txt = document.createTextNode(msg);
      if (this.toggleHighlight) {
        console.log('highlight!');
        p.setAttribute('class', 'highlight');
      }
      p.appendChild(txt);
      this.staydown.append(p);
      console.log(msg);
    }
    this.toggleHighlight = !this.toggleHighlight;
  }

  registerComponents() {

    this.log('loading components ...');
    for (const name of Object.keys(ComponentExports)) {
      this.log(`registering ${name}`);
      this.ecs.registerComponent(name, ComponentExports[name]);
    }
  }

  update(time) {
    window.requestAnimationFrame(this.update.bind(this));

    const delta = time - this.lastUpdate;
    this.tickTime += delta;
    this.lastUpdate = time;
    this.ecs.runSystemGroup('input');
    if (this.player.Action) {
      this.runTurn();
    }
    if (this.tickTime < TICKLENGTH) {
      return;
    }
    this.tickTime %= TICKLENGTH;
    this.runTick();
    this.ecs.runSystemGroup('render');
  }

  runTick() {

    this.ecs.tick();
  }

  runTurn() {

    this.ecs.runSystemGroup('action');
    this.ecs.runSystemGroup('render');
  }
}

Game.CHARS = {
  WALL: String.fromCharCode(178),
  FLOOR: String.fromCharCode(250),
  DOOR: '-',
  DOOROPEN: '/',
}
