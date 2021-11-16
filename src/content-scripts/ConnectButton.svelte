<style>
.hid-button-container {
  display: flex;
  width: 40px;
  height: 40px;
  align-self: center;
}
#hid-button {
  margin: auto;
  padding: 4px;
  background-color: #fff;
  border-radius: 4px;
  border: solid #aaa thin;
  cursor: pointer;
}
#hid-button:active {
  background-color: #ddd;
}
</style>

<script>
import { isConnected } from './stores';
import Icon from 'mdi-svelte';
import { mdiUsb } from '@mdi/js';

export let onButtonClicked;
</script>

<div class="hid-button-container">
  <button id="hid-button" on:click="{onButtonClicked}"
    ><Icon path="{mdiUsb}" color="{$isConnected ? '#2ECC71' : '#5D6D7E'}" /></button>
</div>
