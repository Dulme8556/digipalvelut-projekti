<script>
    import { getContext } from "svelte";
    let { indicator, value1, value2 } = $props();

    let lists = getContext('list');

    let newIndicator = $state("");
    let newValue1 = $state("");
    let newValue2 = $state("");

    function addNew(event) {
        lists.list = [
            ...lists.list,
            { indicator: newIndicator, value1: newValue1, value2: newValue2 },
        ];
        newIndicator = "";
        newValue1 = "";
        newValue2 = "";
        console.log("add-new.svelte")
        console.log({lists})
    }
</script>

<div>
    <h1>Add new</h1>
    <div>
        <input type="text" placeholder="Name" bind:value={newIndicator} />
        <input type="text" placeholder="Value1" bind:value={newValue1} />
        <input type="text" placeholder="Value2" bind:value={newValue2} />
    </div>
    <button onclick={addNew}>Add</button>
</div>