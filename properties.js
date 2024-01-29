const shapefile = require("shapefile");

// https://github.com/topojson/us-atlas/blob/master/properties.js
Promise.all([
  parseInput(),
  shapefile.read(
    "build/recintos_autonomicas_inspire_canarias_regcan95.shp",
    "build/recintos_autonomicas_inspire_canarias_regcan95.dbf",
    { encoding: 'utf8' }
  ),
  shapefile.read(
    "build/recintos_autonomicas_inspire_peninbal_etrs89.shp",
    "build/recintos_autonomicas_inspire_peninbal_etrs89.dbf",
    { encoding: 'utf8' }
  ),
  shapefile.read(
    "build/recintos_provinciales_inspire_canarias_regcan95.shp",
    "build/recintos_provinciales_inspire_canarias_regcan95.dbf",
    { encoding: 'utf8' }
  ),
  shapefile.read(
    "build/recintos_provinciales_inspire_peninbal_etrs89.shp",
    "build/recintos_provinciales_inspire_peninbal_etrs89.dbf",
    { encoding: 'utf8' }
  ),
]).then(output);

function parseInput() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin
        .on("data", chunk => chunks.push(chunk))
        .on("end", () => {
          try { resolve(JSON.parse(chunks.join(""))); }
          catch (error) { reject(error); }
        })
        .setEncoding("utf8");
  });
}

function output([
  topology,
  autonomousRegionsCanaries,
  autonomousRegionsPeninsula,
  provincesCanaries,
  provincesPeninsula,
]) {
  const autonomousRegions = autonomousRegionsCanaries.features.concat(autonomousRegionsPeninsula.features);
  const provinces = provincesCanaries.features.concat(provincesPeninsula.features);

  const autonomousRegionsMap = new Map(autonomousRegions.map(d => [d.properties.NATCODE.slice(2, 4), d.properties]));
  const provincesMap = new Map(provinces.map(d => [d.properties.NATCODE.slice(4, 6), d.properties]));

  for (const autonomousRegion of topology.objects.autonomous_regions.geometries) {
    autonomousRegion.properties = {
      name: autonomousRegionsMap.get(autonomousRegion.id).NAMEUNIT
    };
  }

  if (topology.objects.provinces) {
    for (const province of topology.objects.provinces.geometries) {
      province.properties = {
        name: provincesMap.get(province.id).NAMEUNIT
      };
    }
  }

  if (topology.objects.municipalities) {
    for (const municipality of topology.objects.municipalities.geometries) {
      municipality.properties = {
        name: municipality.properties.NAMEUNIT
      };
    }
  }

  for (const border of topology.objects.border.geometries) {
    border.properties = {};
  }

  process.stdout.write(JSON.stringify(topology));
  process.stdout.write("\n");
}