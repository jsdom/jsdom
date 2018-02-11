const SVGPathData = require('svg-pathdata').SVGPathData;

function getPolygonFromPath(pathData) {
  return pathData.commands
    .filter(command => [
      SVGPathData.MOVE_TO,
      SVGPathData.LINE_TO,
      SVGPathData.CLOSE_PATH
    ].indexOf(command.type) >= 0)
    .map(command => {
      switch (command.type) {
        case SVGPathData.MOVE_TO:
        case SVGPathData.LINE_TO:
          return [command.x, command.y];
          break;

        case SVGPathData.CLOSE_PATH:
          return [pathData.commands[0].x, pathData.commands[0].y];
          break;

        default:
          break;
      }
    });
}

exports.getPolygonFromPath = getPolygonFromPath;
