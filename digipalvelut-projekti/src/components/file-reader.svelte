<script>
    import { getContext } from "svelte";
    import { writable } from "svelte/store";
    import * as XLSX from "xlsx";

    let lists = getContext('list');
    let list = [];

    let fileGiven = false;
    let clickEvent;
    const previewStore = writable('');

    async function handleFileChange(file) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, {type: 'array'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        previewStore.set(JSON.stringify(jsonData, null, 2));

        list = jsonData
        
        // temporary to see useful info
        console.log("Information:")
        console.log(lists.list)
        console.log(list)

        list.forEach(element => {        
            lists.list = [
                ...lists.list,
                { name: element.Name, target: element.Target, start: element.Start, end: element.End, unit: element.Unit },
            ];
        });
    }

    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
            handleFileChange(file);
        } 
    }

    function fileFound() {
        if (fileGiven) {
            lists.list = [];
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
    
    <!-- {#if fileGiven}
        <h2>Stuff inside the file</h2>
        <pre>
            {$previewStore}
        </pre>
    {/if} -->
</div>