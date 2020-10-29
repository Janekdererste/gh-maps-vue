// import mapbox like this instead of {Map} from 'mapbox-gl' because otherwise the app is missing some global mapbox state
import * as mapbox from "mapbox-gl";
import { LineString, Feature } from "geojson";
import { GeoJSONSource, supported } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const sourceKey = "route";
const lineLayerKey = "lines";
const pointsLayerKey = "points";

export default class Mapbox {
  private map: mapbox.Map;

  constructor(container: HTMLDivElement) {
    this.map = new mapbox.Map({
      accessToken:
        "pk.eyJ1IjoiamFuZWtkZXJlcnN0ZSIsImEiOiJjajd1ZDB6a3A0dnYwMnFtamx6eWJzYW16In0.9vY7vIQAoOuPj7rg1A_pfw",
      container: container,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 9
    });
    this.map.on("load", ev => this.initLineLayer());
  }

  private initLineLayer() {
    this.map.addSource(sourceKey, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: []
        }
      }
    });
    this.map.addLayer({
      id: lineLayerKey,
      type: "line",
      source: sourceKey,
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "#888",
        "line-width": 8
      }
    });

    this.map.addLayer({
      id: pointsLayerKey,
      type: "circle",
      source: sourceKey,
      paint: {
        "circle-radius": 6,
        "circle-color": "#B42222"
      },
      filter: ["==", "$type", "Point"]
    });
  }

  public updateGeometry(points: {
    type: string;
    coordinates: [number, number][];
  }) {
    this.addLine(points);
  }

  private addLine(points: { type: string; coordinates: [number, number][] }) {
    (this.map.getSource(sourceKey) as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: points.coordinates
          }
        },
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "MultiPoint",
            coordinates: [
              points.coordinates[0],
              points.coordinates[points.coordinates.length - 1]
            ]
          }
        }
      ]
    });
  }

  private removeLine() {
    this.map.removeLayer(pointsLayerKey);
    this.map.removeLayer(lineLayerKey);
    this.map.removeSource(sourceKey);
  }
}
