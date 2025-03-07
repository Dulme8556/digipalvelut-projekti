<script>
    import { getContext } from "svelte";
    let { indicator, value1, value2 } = $props();

    let lists = getContext('list');

    let newName = $state("");
    let newtarget = $state("");
    let newStart = $state("");
    let newEnd = $state("");
    let newUnit = $state("");

    function addNew(event) {
        lists.list = [
            ...lists.list,
            { name: newName, target: newtarget, start: newStart, end: newEnd, unit: newUnit },
        ];
        newName = "";
        newtarget = "";
        newStart = "";
        newEnd = "";
        newUnit = "";
    }
</script>

<div>
    <h1 class="title">Add new</h1>
    <div>
        <input type="text" placeholder="Name" bind:value={newName} />
        <input type="text" placeholder="Target value" bind:value={newtarget} />
        <input type="text" placeholder="Start value" bind:value={newStart} />
        <input type="text" placeholder="End value" bind:value={newEnd} />
        <input type="text" placeholder="Unit" bind:value={newUnit} />
    </div>
    <button onclick={addNew}>Add</button>
</div>

<style>
    .title {
        text-transform: uppercase;
    }
</style>