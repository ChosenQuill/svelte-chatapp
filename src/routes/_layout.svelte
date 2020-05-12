<script>
  import Nav from "../components/Nav.svelte";

  export let segment;
</script>

<style lang="scss" global>
  html, body, #sapper {
    height: 100%;
  }
  
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
    height: 80%;

    display: flex;
    flex-flow: column;
  }
</style>

<Nav {segment} />

<main>
  <slot />
</main>
