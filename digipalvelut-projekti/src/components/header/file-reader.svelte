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
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            dateNF: "dd-mm-yyyy",
        });
        previewStore.set(JSON.stringify(jsonData, null, 2));

        readExcelData = jsonData;

        readExcelData.forEach((element) => {
            let percent;
            let rawValue = (element.Result / element.Expected) * 100;
            let calculation = rawValue.toFixed(3);

            percent = rawValue.toFixed(0);

            if (calculation % 1 !== 0) {
                percent = "~" + percent;
            }

            console.log("Deadline field raw value:", element.Deadline);

            let newId = lists.list.length? Math.max(...lists.list.map((t) => t.id)) + 1 : 1;
            lists.list = [
                ...lists.list,
                {
                    id: newId,
                    check: false,
                    name: element.Title,
                    expected: element.Expected,
                    start: element.Start,
                    result: element.Result,
                    percent: percent,
                    unit: element.Unit,
                    deadline: element.Deadline,
                },
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
</script>

<div style="text-align: center; padding: 0 10px;">
    <input
        type="file"
        accept=".xlsx"
        bind:this={fileInput}
        onchange={handleFileInput}
    />

    <div class="tooltip-container">
        <button onclick={fileDialog}>Open file</button>
        <span class="tooltip-text">Click to upload<br>an Excel file</span>
    </div>
</div>


<style>
    input {
        display: none;
    }
    
    button {
        padding: 5px 20px;
        margin-bottom: 10px;
        background-color: #30B2B3;
        color: white;
        border-radius: 100px;
        border: 1px solid #000000;
        width: 150px;
        height: 50px;
        font-size: 16px;
    }

    button:hover {
        cursor: pointer;
    }

    .tooltip-container {
        position: relative;
        display: inline-block;
    }

    .tooltip-text {
        visibility: hidden;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 8px;
        border-radius: 4px;
        position: absolute;
        z-index: 1;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 16px;
    }

    .tooltip-container:hover .tooltip-text,
    .tooltip-text:hover {
        visibility: visible;
        opacity: 1;
    }
</style>
