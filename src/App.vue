<template>

  <div class="map">
    <MapComponent/>
  </div>
  <div class="sidebar">
    <Sidebar v-on:submit="handleSubmit"/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import Sidebar from "@/components/Sidebar.vue";
import MapComponent from "@/components/MapComponent.vue";

require('graphhopper-js-api-client')

const ghKey = 'fb45b8b2-fdda-4093-ac1a-8b57b4e50add'

@Options({
  components: {
    MapComponent,
    Sidebar
  }
})
export default class App extends Vue {

  private path?: any

  private async handleSubmit(from: [number, number], to: [number, number]) {
    console.log('from: ' + from + ' to: ' + to)

    //const routing = Graphhopper.Routing()
    const routing = new Graphhopper.Routing({
      key: ghKey,
      vehicle: 'car',
      elevation: false
    })

    // routing.addPoint(new Graphhopper.Input(from[0], from[1]))
    // routing.addPoint(new Graphhopper.Input(to[0], to[1]))

    try {
      const result = await routing.doRequest()
      console.log(result)
      if (result.paths.length > 0)
        this.path = result.paths[0]
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<style>

body, html {
  height: 100%;
  padding: 0;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* the #app is created by 'createApp' in main.ts. Don't know where to move this otherwise */
#app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 20rem auto;
  grid-template-rows: 100%
}

.map {
  grid-column: 1 / span 2;
  grid-row: 1 / span 1;
}

.sidebar {
  grid-column: 1 / span 1;
  grid-row: 1 / span 1;
  z-index: 500;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  background-color: white;
  overflow: hidden;
  margin: 0.5rem;
  transition: all 0.2s;
}
</style>
