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

        // temporary to see useful info
        console.log(previewStore)
        console.log("Information:")
        console.log(information)
        console.log(information[0].Name)
        console.log(information[1].End)
    }

    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
            handleFileChange(file);
        } 
    }

    function fileFound() {
        if (fileGiven) {
            information = [];
            previewStore.set('');
            clickEvent = '';
        }
        fileGiven = !fileGiven;
    }
</script>

<style>
    input {
        display: none;
    }
</style>
<div>
    <input type="file" accept=".xlsx" bind:this={clickEvent} onchange={handleFileInput}>
    <button onclick={clickEvent.click(), fileFound}>Open file</button>
    
    {#if fileGiven}
        <h2>Stuff inside the file</h2>
        <pre>
            {$previewStore}
        </pre>
    {/if}
</div>