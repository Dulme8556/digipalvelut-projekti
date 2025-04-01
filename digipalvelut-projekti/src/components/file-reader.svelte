<script>
    import { getContext } from "svelte";
    import { writable } from "svelte/store";
    import * as XLSX from "xlsx";

    let lists = getContext("list");
    let readExcelData = [];

    let fileGiven = false;
    let fileInput;
    const previewStore = writable("");

    async function handleFileChange(file) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        previewStore.set(JSON.stringify(jsonData, null, 2));

        readExcelData = jsonData;

        readExcelData.forEach((element) => {
            let percent;
            let rawValue = (element.End / element.Target) * 100;
            let calculation = rawValue.toFixed(3);

            percent = rawValue.toFixed(0);

            if (calculation % 1 !== 0) {
                percent = "~" + percent;
            }

            let newId = lists.list.length? Math.max(...lists.list.map((t) => t.id)) + 1: 1;
            lists.list = [
                ...lists.list,
                {
                    id: newId,
                    check: true,
                    name: element.Title,
                    target: element.Target,
                    start: element.Start,
                    end: element.End,
                    percent: percent,
                    unit: element.Unit,
                },
            ];
        });

        lists.selectedValues = lists.list;
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
            previewStore.set("");
            fileInput = null;
        }
        fileGiven = !fileGiven;
    }
</script>

<div>
    <input
        type="file"
        accept=".xlsx"
        bind:this={fileInput}
        onchange={handleFileInput}
    />
    <button onclick={fileDialog}>Open file</button>
</div>

<style>
    input {
        display: none;
    }

    button {
        padding: 5px 20px;
        margin-bottom: 10px;
        background-color: #639fc4;
        color: white;
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
        width: 180px;
        height: 50px;
        position: relative;
        overflow: hidden;
    }

    button:hover {
        cursor: pointer;
    }
</style>
