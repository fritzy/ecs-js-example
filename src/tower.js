class Room {
  constructor() {
    this.floorTiles = new Set();
    this.wallTiles = new Set();
  }
}

const STEPS = ['split', 'map', 'delete'];

export default class Tower {

  constructor(display, width, height) {

    this.step = 0;
    this.display = display;
    this.width = width;
    this.height = height;
    //this.rooms = new Set([this.makeRoom(0, 0, width, height, false)]);
    this.rooms = new Set();
    this.minSize = 5;
    this.outerSize = this.minSize + 2;
    this.done = false;
    this.walls = {};
    this.deletedWalls = 0;

    let room = this.makeRoom(0, 0, width, 10, false);
    this.rooms.add(room);
    room = this.makeRoom(0, 9, 10, height - 9, false);
    this.rooms.add(room);
    room = this.makeRoom(9, 9, 5, height - 22, true);
    this.rooms.add(room);
    room = this.makeRoom(9, height - 14, width - 20, 5, true);
    this.rooms.add(room);
    room = this.makeRoom(13, 9, width - 13, height - 22, false);
    this.rooms.add(room);
    room = this.makeRoom(9, height - 10, width - 20, 10, false);
    this.rooms.add(room);
    room = this.makeRoom(width - 12, height - 14, width - 20 - 18, 14, false);
    this.rooms.add(room);
  }

  makeRoom(x, y, w, h, l) {
    return {
      x,
      y,
      w,
      h,
      lock: !!l,
      floor: new Set(),
      wall: new Set()
    };
  }

  work() {

    switch(this.step) {
      case 0:
        this.splitRoom();
        this.render()
        break;
      case 1:
        this.setWalls();
        this.render()
        break;
      case 2:
        this.deleteWallAt(`11x${this.height - 14}`);
        this.step++;
      case 3:
        this.deleteWall();
        this.render()
        break;
      case 4:
        break;
    }
  }

  setWalls() {

    let count = 0;
    for (const room of this.rooms) {
      for (let x = room.x; x < room.x + room.w; x++) {
        for (let y = room.y; y < room.y + room.h; y++) {
          const tileS = `${x}x${y}`;
          count++;
          if (x === room.x || x === room.x + room.w - 1 || y === room.y || y === room.y + room.h - 1) {
            if (!this.walls.hasOwnProperty(tileS)) {
              this.walls[tileS] = new Set();
            }
            this.walls[tileS].add(room);
            room.wall.add(tileS);
          } else {
            room.floor.add(tileS);
          }
        }
      }
    }
    this.step++;
  }

  deleteWall() {

    const room = [...this.rooms][Math.floor(Math.random() * this.rooms.size)];
    const walls = [...room.wall];
    let wall, wallIdx;
    let count = 0;
    do {
      wallIdx = walls[Math.floor(Math.random() * walls.length)];
      wall = this.walls[wallIdx];
      const wallarray = [...wall];
      if (wall.size == 2 && !wallarray[0].lock && !wallarray[1].lock) {
        break;
      }
      count++;
      if (count > 50) {
        this.step++;
        return;
      }
    } while (true);
    this.deleteWallAt(wallIdx);
    this.deletedWalls++;
    if (this.deletedWalls > 35) {
      this.step++;
    }
  }

  deleteWallAt(coord) {
    const wall = this.walls[coord];
    const rooms = [...wall];
    for (const wall of rooms[0].wall) {
      if (rooms[1].wall.has(wall) && this.walls[wall].size === 2) {
        const coord = wall.split('x');
        const x = parseInt(coord[0]);
        const y = parseInt(coord[1]);
        if (x !== 0 && x !== this.width - 1 && y !== 0 && y !== this.height - 1) {
          rooms[1].wall.delete(wall)
          this.walls[wall].delete(rooms[0]);
          this.walls[wall].delete(rooms[1]);
          rooms[0].wall.delete(wall)
          rooms[0].floor.add(wall);
          if (this.walls[wall].size === 0) {
            delete this.walls[wall];
          }
        }
      } else {
      }
    }
    for (const floor of rooms[1].floor) {
      rooms[0].floor.add(floor);
    }
    for (const wall of rooms[1].wall) {
      this.walls[wall].add(rooms[0]);
      rooms[0].wall.add(wall);
      this.walls[wall].delete(rooms[1]);
    }
    this.rooms.delete(rooms[1]);
    return rooms[0];
  }

  splitRoom() {

    //if (this.rooms.length > 100) return;
    const rooms = [...this.rooms].filter(r => (!r.lock && (r.w >= this.minSize * 2 || r.h >= this.minSize * 2)));
    if (rooms.length === 0) {
      this.step++;
      return;
    }
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    const ratio = room.w / room.h;
    let dir = Math.floor(Math.random() * 2);
    if (room.h < this.minSize * 2) {
      dir = 0;
    } else if (room.w < this.minSize * 2) {
      dir = 1;
    } else if (ratio > 3) {
      dir = 0;
    } else if (ratio < .333) {
      dir = 1;
    }
    if (dir === 0) {
      const split = Math.floor(Math.random() * (room.w - this.minSize * 2)) + this.minSize;
      const room2 = this.makeRoom(room.x + split - 1, room.y, room.w - split + 1, room.h);
      this.rooms.add(room2);
      room.w = split;
    } else if (dir === 1) {
      const split = Math.floor(Math.random() * (room.h - this.minSize * 2)) + this.minSize;
      const room2 = this.makeRoom(room.x, room.y + split - 1, room.w, room.h - split + 1);
      this.rooms.add(room2);
      room.h = split;
    }
  }

  render() {

    if (this.step < 2) {
      this.display.clear();
      for (const room of this.rooms) {
        for (let x = room.x; x < room.x + room.w; x++) {
          this.display.draw(x, room.y, '#', 'white');
          this.display.draw(x, room.y + room.h - 1, '#', 'white');
          if (x === room.x || x === room.x + room.w - 1) {
            for (let y = room.y + 1; y < room.y + room.h; y++) {
              this.display.draw(x, y, '#', 'white');
            }
          }
        }
      }
      this.display.draw(0, 0, 'X', 'white');
      this.display.draw(40, 40, 'X', 'white');
    } else {
      this.display.clear();
      for (const tileS of Object.keys(this.walls)) {
        const coord = tileS.split('x');
        //if (this.walls[tileS].size === 4) {
        // this.display.draw(coord[0], coord[1], '#', 'red');
        //} else {
          this.display.draw(coord[0], coord[1], '#', 'white');
        //}
      }
      for (const room of this.rooms) {
        if (room.lock) {
          for (const floor of room.floor) {
            const fcoord = floor.split('x');
            this.display.draw(fcoord[0], fcoord[1], '.', 'white', 'black');
          }
        }
      }
    }
  }

  create(callback) {
  }

}
