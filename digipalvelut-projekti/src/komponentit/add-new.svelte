<script>
    import { getContext } from "svelte";
    let { index, value1, value2 } = $props();

    let list = getContext("list");

    let newIndex = "";
    let newValue1 = "";
    let newValue2 = "";

    function addNew() {
        list = [
            ...list,
            { index: newIndex, value1: newValue1, value2: newValue2 },
        ];
        newIndex = "";
        newValue1 = "";
        newValue2 = "";
    }
</script>

<div>
    <h1>Add new</h1>
    <div>
        <input type="text" placeholder="Name" bind:value={newIndex} />
        <input type="text" placeholder="Value1" bind:value={newValue1} />
        <input type="text" placeholder="Value2" bind:value={newValue2} />
    </div>
    <button onclick={addNew}>Add</button>
</div>
