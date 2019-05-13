export const Tile = {
  properties: {
    passable: false
  }
};

export const Coordinate = {
  properties: {
    x: 0,
    y: 0
  }
}

export const Floor = {
  properties: {
    items: '<EntitySet>',
    character: '<Entity>'
  }
};

export const Wall = {};

export const Door = {
  properties: {
    open: false
  }
};

export const Map = {
  properties: {
    width: 0,
    height: 0,
    map: null,
    tiles: '<EntityObject>'
  }
};

export const Renderable = {
  properties: {
    char: 'X',
    fg: 'white',
    bg: 'black'
  }
};
