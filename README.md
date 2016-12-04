# Spanish Atlas TopoJSON

This repository provides a simple script to generate TopoJSON files from the [Spanish National Geographic Institute’s](http://www.ign.es/ign/main/index.do) [National Reference Geographic Equipment](http://centrodedescargas.cnig.es/CentroDescargas/equipamiento.do?method=mostrarEquipamiento) vector data.

## Usage
In a browser (using [d3-geo](https://github.com/d3/d3-geo) and Canvas):

```html
<!DOCTYPE html>
<canvas width="960" height="500"></canvas>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/topojson.v2.min.js"></script>
<script src="https://unpkg.com/d3-composite-projections@1.0.2"></script>
<script>

var context = d3.select("canvas").node().getContext("2d"),
  projection = d3.geoConicConformalSpain(),
  path = d3.geoPath(projection, context);

d3.json("https://martingonzalez.net/es-municipalities.v1.json", function(error, es) {
  if (error) throw error;

  context.beginPath();
  path(topojson.mesh(es));
  context.stroke();
  
  context.stroke(new Path2D(projection.getCompositionBorders()));
});

</script>

```

In Node (using [d3-geo](https://github.com/d3/d3-geo) and [node-canvas](https://github.com/Automattic/node-canvas)):

```js
var fs = require("fs"),
  d3_composite = require("d3-composite-projections"),
  d3 = require("d3-geo"),
  topojson = require("topojson-client"),
  Canvas = require("canvas"),
  es = require("./node_modules/es-atlas/es/municipalities.json");

var canvas = new Canvas(960, 500),
  context = canvas.getContext("2d"),
  projection = d3_composite.geoConicConformalSpain(),
  path = d3.geoPath(projection, context);

context.beginPath();
path(topojson.mesh(es));
context.stroke();

canvas.pngStream().pipe(fs.createWriteStream("preview.png"));
```

I highly recommend using Roger Veciana’s [d3-composite-projections](https://github.com/rveciana/d3-composite-projections) with these files. Using a `ConicConformalSpain` projection will ensure that the Canary Islands are painted closer to the mainland and even [add a border](https://github.com/rveciana/d3-composite-projections#usage) to mark the projection zone.

## Generating the files
Clone or download the repo, start a terminal and run `npm install` in the folder. This command will run the script and move the generated files to the `es` folder.

If you need to make further adjustments (simplification, quantization) you can change the `prepublish` script and run `npm install` again. 

## File Reference
<a href="#es/municipalities.json" name="es/municipalities.json">#</a> <b>es/municipalities.json</b> [<>](https://martingonzalez.net/es-municipalities.v1.json "Source")

A TopoJSON which contains four objects: *municipalities*, *provinces*, *autonomous regions* and *nation*. Every city, province and region has its corresponding [National Statistics Institute](http://www.ine.es/en/welcome.shtml) identifier, so it's easy to get started. 

<a href="#es/municipalities.json_municipalities" name="es/es_municipalities.json_municipalities">#</a> *es*.objects.<b>municipalities</b>

<img src="https://cloud.githubusercontent.com/assets/1236790/20868824/69a60934-ba65-11e6-8591-ddcc1e93b157.png" width="480" height="auto">

<a href="#es/municipalities.json_provinces" name="es/municipalities.json_provinces">#</a> *es*.objects.<b>provinces</b>

<img src="https://cloud.githubusercontent.com/assets/1236790/20868842/012eb12a-ba66-11e6-80f3-f5b0568664ff.png" width="480" height="auto">

<a href="#es/municipalities.json_autonomous_regions" name="es/municipalities.json_autonomous_regions">#</a> *es*.objects.<b>autonomous_regions</b>

<img src="https://cloud.githubusercontent.com/assets/1236790/20868858/72ad886c-ba66-11e6-95eb-e995fa640fc7.png" width="480" height="auto">

<a href="#es/municipalities.json_nation" name="es/municipalities.json_nation">#</a> *es*.objects.<b>nation</b>

<img src="https://cloud.githubusercontent.com/assets/1236790/20868860/871ab75c-ba66-11e6-8517-a7d6e2d5eac8.png" width="480" height="auto">

<a href="#es/provinces.json" name="es/provinces.json">#</a> <b>es/provinces.json</b> [<>](https://martingonzalez.net/es-provinces.v1.json "Source")

This file provides the same objects except the municipalities, to keep a smaller footprint on less detailed maps.


### Inspiration

The original idea and implementation comes from Mike Bostock’s [us-atlas](https://github.com/topojson/us-atlas) and [world-atlas](https://github.com/topojson/world-atlas).
