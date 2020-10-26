<template>
  <div ref="mapContainer" class="map"></div>
</template>

<script lang="ts">

import {Vue} from "vue-class-component";

// import mapbox like this instead of {Map} from 'mapbox-gl' because otherwise the app is missing some global mapbox state
import * as mapbox from 'mapbox-gl'


export default class MapComponent extends Vue {

  $refs!: {
    mapContainer: HTMLDivElement
  }

  mounted() {
    const map = new mapbox.Map({
      accessToken: 'pk.eyJ1IjoiamFuZWtkZXJlcnN0ZSIsImEiOiJjajd1ZDB6a3A0dnYwMnFtamx6eWJzYW16In0.9vY7vIQAoOuPj7rg1A_pfw',
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 9
    })
  }

}
</script>

<style>
.map {
  height: 100%;
}
</style>