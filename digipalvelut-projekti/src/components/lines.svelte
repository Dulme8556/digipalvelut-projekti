<script>
    import { getContext } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext('list')

    lists.list = [
    ]
</script>

{#each lists.list as l}
    <Line name={l.name} target={l.target} start={l.start} end={l.end} unit={l.unit}/>
{/each}

<style>

</style>
