<script>
    import { writable } from "svelte/store";
    import * as XLSX from "xlsx";

    let fileGiven = false;
    let clickEvent;
    const previewStore = writable('');

    // temporary will be replaced with widely used list
    let information = [];

    async function handleFileChange(file) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, {type: 'array'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        previewStore.set(JSON.stringify(jsonData, null, 2));

        let information = jsonData;

        // temporary to see previewStore
        console.log(previewStore)
        console.log("Information:")
        console.log(information)
    }

    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) handleFileChange(file);
    }

    function fileFound() {
        fileGiven = true;
    }
</script>

<style>
    input {
        display: none;
    }
</style>
<div>
    <input type="file" accept=".xlsx" bind:this={clickEvent} on:change={handleFileInput}>
    <button on:click={clickEvent.click(), fileFound}>Open file</button>
    
    {#if fileGiven}
        <h2>Stuff inside the file</h2>
        <pre>
            {$previewStore}
        </pre>
    {/if}
</div>