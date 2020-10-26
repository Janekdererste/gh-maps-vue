<template>
  <div class="sidebar-container">
    <h1>Directions</h1>
    <label>From</label>
    <input v-model="from" type="text"/>
    <label>To</label>
    <input v-model="to" type="text"/>
    <button v-on:click="onGoClick">Go</button>
  </div>
</template>

<script lang="ts">

import {Vue} from "vue-class-component";
import 'reflect-metadata'
import {Prop} from "vue-property-decorator";

export default class Sidebar extends Vue {

  readonly fromCoord: [number, number] = [47.400905, 8.534317]
  readonly toCoord: [number, number] = [47.394108, 8.538265]

  @Prop() onSubmit!: (from: [number, number], to: [number, number]) => void
  @Prop() path?: any

  private get from() {
    return Sidebar.convertToText(this.fromCoord)
  }

  private get to() {
    return Sidebar.convertToText(this.toCoord)
  }

  private static convertToText(coord: [number, number]) {
    return coord[0] + ', ' + coord[1]
  }

  private onGoClick() {
    this.onSubmit(this.fromCoord, this.toCoord)
  }

}

</script>

<style>

.sidebar-container {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
</style>
