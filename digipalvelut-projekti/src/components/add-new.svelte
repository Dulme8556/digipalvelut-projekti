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
    let newId = $state("");
    
    function addNew(event) {
        newId = lists.list.length ? Math.max(...lists.list.map((t) => t.id)) + 1 : 1;

        if (newName === "" && newtarget === "" && newStart === "" && newEnd === "" && newUnit === "") {
            alert("Can't add empty")
        }
        else {
            lists.list = [
                ...lists.list,
                { id: newId, name: newName, target: newtarget, start: newStart, end: newEnd, unit: newUnit },
            ];
            newName = "";
            newtarget = "";
            newStart = "";
            newEnd = "";
            newUnit = "";
        }
    }
</script>

<div style='width:400px;'>
    <h1 class="title">Add an existing chart</h1>
    <div class="import-button">
        <FileReader />
    </div>
    <div class='create-dataset'>
        <h2 class='create-dataset__title'>CREATE A NEW DATASET</h2>
        <div class="input__container">
            <input class="input" type="text" placeholder="Name" bind:value={newName} />
            <input class="input input__number" type="number" placeholder="Target value" bind:value={newtarget} />
            <input class="input input__number" type="number" placeholder="Start value" bind:value={newStart} />
            <input class="input input__number" type="number" placeholder="End value" bind:value={newEnd} />
            <input class="input" type="text" placeholder="Unit" bind:value={newUnit} />
        </div>
        <div class='add-button'>
            <button class="add-button__button" onclick={addNew}>Create dataset</button>
        </div>
    </div>
</div>

<style>

    .create-dataset{
        background-color: rgba(128, 128, 128, 0.289);
        border-radius: 12px;
    }

    .create-dataset__title{
        display:flex;
        justify-content: center;
        padding-top:15px;
        margin-bottom:0;
    }

    .title {
        text-transform: uppercase;
    }

    .import-button {
        display: flex;
        justify-content: center;
    }

    .add-button{
        display:flex;
        padding-bottom:10px;
        padding-left:10px;
        padding-top:10px;
    }

    .add-button__button {
        padding: 5px 10px;
        margin-bottom: 10px;
        margin-right: 10px;
        background: var(--schemes-primary, #639fc4);
        color:white;
        border-radius: 100px;
        border-style: solid;
        border-color: #000000;
        border-width: 1px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 120px;
        height: 50px;
        position: relative;
        overflow: hidden;
    }

    .input__container{
        display:flex;
        flex-direction: column;
    }

    .input::placeholder{
        padding-left:2px;
    }

    .input {
        border: #5757579e solid 2px;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0);
        font-size: 17px;
        padding: 3px 0;
        margin: 15px 15px;
        color: black;
        max-width:396px;
    }

    .input:first-child {
        margin: 35px 15px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    
</style>