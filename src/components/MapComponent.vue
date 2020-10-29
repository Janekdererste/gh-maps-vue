<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

import { Prop, Watch } from "vue-property-decorator";
import Mapbox from "./Mapbox";

export default class MapComponent extends Vue {
  private map!: Mapbox;
  $refs!: {
    mapContainer: HTMLDivElement;
  };

  // expose property to which parent component can bin
  @Prop() private points: any = null;
  @Prop() private bbox: [number, number, number, number] | null = null;

  // watch for changes of points property to manipulate map
  @Watch("points") onPointsChanged(val: any, oldVal: any) {
    this.map.updateGeometry(val);
  }

  @Watch("bbox") onBboxChanged(
    val: [number, number, number, number],
    oldVal: [number, number, number, number]
  ) {
    this.map.fitToExtent(val);
  }

  mounted() {
    this.map = new Mapbox(this.$refs.mapContainer);
  }
}
</script>

<style>
.map {
  height: 100%;
}
</style>
