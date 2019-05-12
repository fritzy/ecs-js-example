import Game from './src/game';

const container = document.getElementById('rlcontainer');
const logdiv = document.getElementById('log');
const tileSet = document.createElement("img");
tileSet.src = require("/assets/tiles.png");

tileSet.onload = () => {

  const game = new Game(container, logdiv, tileSet);
  //require('./src/input')(ecs);
};
