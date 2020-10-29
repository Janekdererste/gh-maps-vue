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

  // watch for changes of points property to manipulate map
  @Watch("points") onChange(val: any, oldVal: any) {
    console.log("on points changed");
    this.map.updateGeometry(val);
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
