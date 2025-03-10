<script>
    import { getContext } from "svelte";
    import FileReader from "./file-reader.svelte";
    let { indicator, value1, value2 } = $props();

    let lists = getContext('list');

    let newName = $state("");
    let newtarget = $state("");
    let newStart = $state("");
    let newEnd = $state("");
    let newUnit = $state("");

    let id = 0;

    function addNew(event) {
        if (newName === "" && newtarget === "" && newStart === "" && newEnd === "" && newUnit === "") {
            alert("Can't add empty")
        }
        else {
            id += 1;

            lists.list = [
                ...lists.list,
                { id:{id}, name: newName, target: newtarget, start: newStart, end: newEnd, unit: newUnit },
            ];
            newName = "";
            newtarget = "";
            newStart = "";
            newEnd = "";
            newUnit = "";
        }
    }
</script>

<div>
    <h1 class="title">Add new</h1>
    <div class="buttons">
        <button class="add__button" onclick={addNew}>Add</button>
        <FileReader />
    </div>
    <div class="input__container">
        <input class="input" type="text" placeholder="Name" bind:value={newName} />
        <input class="input input__number" type="number" placeholder="Target value" bind:value={newtarget} />
        <input class="input input__number" type="number" placeholder="Start value" bind:value={newStart} />
        <input class="input input__number" type="number" placeholder="End value" bind:value={newEnd} />
        <input class="input" type="text" placeholder="Unit" bind:value={newUnit} />
    </div>
</div>

<style>
    .title {
        text-transform: uppercase;
    }

    .buttons {
        display: flex;
        flex-direction: row;
    }

    .add__button {
        padding: 5px 20px;
        margin-bottom: 10px;
        margin-right: 10px;
    }

    .input {
        border: #575757 solid 2px;
        border-radius: 5px;
        font-size: 17px;
        padding: 3px 0;
        color: black;
    }

    .input::placeholder {
    }

    .input:focus {
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    
</style>