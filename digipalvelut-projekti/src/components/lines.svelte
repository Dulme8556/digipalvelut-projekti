<script>
    import { getContext } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext('list')
</script>

{#each lists.list as l}
    <Line id={l.id} name={l.name} target={l.target} start={l.start} end={l.end} unit={l.unit} on:remove={(e) => deleteThis(e.detail)}/>
{/each}

<style>

</style>
