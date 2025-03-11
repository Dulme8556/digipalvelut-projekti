<script>
    import { getContext } from "svelte";
    import { writable } from "svelte/store";
    import * as XLSX from "xlsx";

    let lists = getContext('list');
    let list = [];

    let fileGiven = false;
    let fileInput;
    const previewStore = writable('');

    async function handleFileChange(file) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, {type: 'array'});
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        previewStore.set(JSON.stringify(jsonData, null, 2));

        list = jsonData

        list.forEach(element => {        
            let newId = lists.list.length ? Math.max(...lists.list.map((t) => t.id)) + 1 : 1;
            lists.list = [
                ...lists.list,
                { id: newId, name: element.Title, target: element.Target, start: element.Start, end: element.End, unit: element.Unit },
            ];
        });
    }

    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
            handleFileChange(file);
        } 
    }

    function fileDialog() {
        if (fileInput) {
            fileInput.value = "";
            fileInput.click();
        }
    }

    function fileFound() {
        if (fileGiven) {
            previewStore.set('');
            fileInput = null;
        }
        fileGiven = !fileGiven;
    }
</script>

<style>
    input {
        display: none;
    }

    button {
        padding: 5px 20px;
        margin-bottom: 10px;
    }
</style>
<div>
    <input type="file" accept=".xlsx" bind:this={fileInput} onchange={handleFileInput}>
    <button onclick={fileDialog}>Open file</button>
</div>