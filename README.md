# Spain Atlas TopoJSON

This repository provides a simple script to generate TopoJSON files from the [Spanish National Geographic Institute’s](http://www.ign.es/ign/main/index.do) [National Reference Geographic Equipment](http://centrodedescargas.cnig.es/CentroDescargas/equipamiento.do?method=mostrarEquipamiento) vector data.

## Usage

In a browser (using [d3-geo](https://github.com/d3/d3-geo) and SVG):

```html
<!DOCTYPE html>
<svg width="960" height="500"></svg>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/topojson.v3.min.js"></script>
<script src="https://unpkg.com/d3-composite-projections@1.2.0"></script>
<script>

const svg = d3.select("svg");
const projection = d3.geoConicConformalSpain();
const path = d3.geoPath(projection);

d3.json("https://unpkg.com/es-atlas@0.2.0/es/municipalities.json")
  .then(es => {
    svg
      .append('path')
      .attr('d', path(topojson.mesh(es)))
      .attr('fill', 'none')
      .attr('stroke', 'black');

    svg
      .append('path')
      .attr('d', projection.getCompositionBorders())
      .attr('fill', 'none')
      .attr('stroke', 'black');
  })
  .catch(err => console.warn(err));

</script>
```

In Node (using [d3-geo](https://github.com/d3/d3-geo) and [node-canvas](https://github.com/Automattic/node-canvas)):

```js
const fs = require('fs');
const d3_composite = require('d3-composite-projections');
const d3 = require('d3-geo');
const topojson = require('topojson-client');
const Canvas = require('canvas');
const es = require('./node_modules/es-atlas/es/municipalities.json');

const canvas = new Canvas(960, 500);
const context = canvas.getContext('2d');
const projection = d3_composite.geoConicConformalSpain();
const path = d3.geoPath(projection, context);

context.beginPath();
path(topojson.mesh(es));
context.stroke();

canvas.pngStream().pipe(fs.createWriteStream('preview.png'));
```

I highly recommend using Roger Veciana’s [d3-composite-projections](https://github.com/rveciana/d3-composite-projections) with these files. Using a `ConicConformalSpain` projection will ensure that the Canary Islands are painted closer to the mainland and even [add a border](https://github.com/rveciana/d3-composite-projections#usage) to mark the projection zone.

## Generating the files

Clone or download the repo, start a terminal and run `npm install` in the folder. This command will run the script and move the generated files to the `es` folder.

If you need to make further adjustments (simplification, quantization) you can change the `package.json` config and run `npm install` again.

You can also run the script with inline arguments:

```shell
npm run prepare --es-atlas:simplification=1e3
```

### Reference

<a href="#add_names" name="add_names">#</a> <i>add_names</i>

Adds a `name` property to the generated files with the feature name. Set to `false` by default.

<a href="#simplification" name="simplification">#</a> <i>simplification</i>

Removes points to reduce the file size. Set to `1e-4` by default.

<a href="#quantization" name="quantization">#</a> <i>quantization</i>

Removes information by reducing the precision of each coordinate. Set to `1e4` by default.

<a href="#autonomous-regions" name="autonomous-regions">#</a> <i>autonomous-regions</i>

Filters the result by the given [autonomous region](http://www.ine.es/en/daco/daco42/codmun/cod_ccaa_en.htm) `id` separated by comma.

```shell
npm run prepare --es-atlas:autonomous-regions=09,10,14,04
```

## File Reference

<a href="#es/municipalities.json" name="es/municipalities.json">#</a> <b>es/municipalities.json</b> [<>](https://unpkg.com/es-atlas/es/municipalities.json 'Source')

A TopoJSON which contains four objects: _municipalities_, _provinces_, _autonomous regions_ and _border_. Every city, province and region has its corresponding [National Statistics Institute](http://www.ine.es/en/welcome.shtml) identifier, so it's easy to get started.

<a href="#es/municipalities.json_municipalities" name="es/municipalities.json_municipalities">#</a> _es_.objects.<b>municipalities</b>

<img src="https://cloud.githubusercontent.com/assets/1236790/20868824/69a60934-ba65-11e6-8591-ddcc1e93b157.png" width="480" height="auto">

<a href="#es/municipalities.json_provinces" name="es/municipalities.json_provinces">#</a> _es_.objects.<b>provinces</b>

<img src="https://cloud.githubusercontent.com/assets/1236790/20868842/012eb12a-ba66-11e6-80f3-f5b0568664ff.png" width="480" height="auto">

<a href="#es/municipalities.json_autonomous_regions" name="es/municipalities.json_autonomous_regions">#</a> _es_.objects.<b>autonomous_regions</b>

<img src="https://cloud.githubusercontent.com/assets/1236790/20868858/72ad886c-ba66-11e6-95eb-e995fa640fc7.png" width="480" height="auto">

<a href="#es/municipalities.json_border" name="es/municipalities.json_border">#</a> _es_.objects.<b>border</b>

<img src="https://cloud.githubusercontent.com/assets/1236790/20868860/871ab75c-ba66-11e6-8517-a7d6e2d5eac8.png" width="480" height="auto">

<a href="#es/provinces.json" name="es/provinces.json">#</a> <b>es/provinces.json</b> [<>](https://unpkg.com/es-atlas/es/provinces.json 'Source')

This file provides provinces and autonomous regions, to keep a smaller footprint on less detailed maps.

<a href="#es/autonomous_regions.json" name="es/autonomous_regions.json">#</a> <b>es/autonomous_regions.json</b> [<>](https://unpkg.com/es-atlas/es/autonomous_regions.json 'Source')

This file only provides autonomous regions, to keep a smaller footprint on less detailed maps.

### Data license

The shapefiles have a [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) license. You need to accept the [terms](http://www.ign.es/resources/licencia/Condiciones_licenciaUso_IGN.pdf) before using the files.

### Inspiration

The original idea and implementation comes from Mike Bostock’s [us-atlas](https://github.com/topojson/us-atlas) and [world-atlas](https://github.com/topojson/world-atlas).
