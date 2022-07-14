<script lang="ts">
  import { region } from '$lib/stores'
</script>

<select bind:value={$region} name="region" id="region">
  <option>Tout</option>
  <option>Québec</option>
  <option>Ontario</option>
  <option>Canada</option>
</select>

<style lang="scss">
  select {
    position: fixed;
    bottom: var(--gutter);
    right: var(--gutter);

    color: var(--dark);
  }
</style>