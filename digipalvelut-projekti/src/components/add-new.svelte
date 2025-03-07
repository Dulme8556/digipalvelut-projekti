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
    <div class="input__container">
        <input class="input" type="text" accept="string" placeholder="Name" bind:value={newName} />
        <input class="input input__number" type="number" accept="" placeholder="Target value" bind:value={newtarget} />
        <input class="input input__number" type="number" accept="" placeholder="Start value" bind:value={newStart} />
        <input class="input input__number" type="number" accept="" placeholder="End value" bind:value={newEnd} />
        <input class="input" type="text" accept="" placeholder="Unit" bind:value={newUnit} />
    </div>
    <button onclick={addNew}>Add</button>
</div>

<style>
    .title {
        text-transform: uppercase;
    }

    .input {
        border: gray solid 2px;
        border-radius: 5px;
        font-size: 17px;
        padding: 3px 0;
        background-color: #424242;
        color: #B3B3AF;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    
    .input::placeholder {
        color: #B3B3AF;
    }
</style>