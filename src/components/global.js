
export const Global = {
  properties: {
    game: null,
    player: '<Entity>',
    inputs: [],
    turn: 0,
    map: null,
    uiMode: 'move'
  },
  serialize: {
    skip: ['game']
  }
};
