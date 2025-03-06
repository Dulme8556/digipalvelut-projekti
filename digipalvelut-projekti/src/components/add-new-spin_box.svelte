<script>
    import Line from "./line.svelte";

    let value = $state(1);

    function changeValue() {
        console.log({value})
    }
</script>

<style>

</style>

<div>
    <h1>Add new</h1>
    <input type="number" min="1" max="100" bind:value={value} onchange="{changeValue}">

    {#each {length: value}}
        <Line />
    {/each}
</div>
