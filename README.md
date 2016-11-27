# Spanish Atlas TopoJSON

This repository provides a simple script to generate TopoJSON files from the [Spanish National Geographic Institute’s](http://www.ign.es/ign/main/index.do) [National Reference Geographic Equipment](http://centrodedescargas.cnig.es/CentroDescargas/equipamiento.do?method=mostrarEquipamiento) vector data.

## Usage

Clone or download the repo, start a terminal and run `npm install` in the folder. This command will run the script and move the generated files to the `es` folder and the build files to the `build` folder.

If you need to adjust the simplification or another parameter you can change the `prepublish` script and run `npm install` again. The TopoJSONs will be generated again.

## File Reference
...

### Inspiration

The original idea and implementation comes from Mike Bostock’s [us-atlas](https://github.com/topojson/us-atlas) and [world-atlas](https://github.com/topojson/world-atlas).