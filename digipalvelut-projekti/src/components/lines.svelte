<script>
    import { getContext } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext('list')

    lists.list = [
        { index: "test value1", value1: "100", value2: "50" },
        { index: "test value2", value1: "100", value2: "150" },
    ]
</script>

{#each lists.list as l}
    <Line index={l.index} value1={l.value1} value2={l.value2}/>
{/each}

<style>

</style>
