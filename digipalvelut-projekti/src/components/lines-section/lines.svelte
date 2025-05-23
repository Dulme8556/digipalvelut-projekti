<script>
    import { getContext } from "svelte";
    import Line from "./line.svelte";
    import { downloadIndicatorsToExcel } from "./download-toexcel.js"

    let lists = getContext("list");

    function handleExcelDownload() {
        if (lists.selectedValues.length === 0) {
            alert("Error: Please select atleast one indicator to download")
        } else{
        downloadIndicatorsToExcel(lists.selectedValues.length > 0 ? lists.selectedValues : lists.list);
        }
    }

    let searchQuery = "";
    let lines = [];
    let allChecked = false;

    let selectedLines = [];

    let sortByValue = "oldest";
    let sortingOptions = ["oldest", "newest", "highest", "lowest"];

    function selectAll() {
        let filteredArray = lines.filter((item) => item !== null);
        
        filteredArray.forEach((element) => {
            element.checkAll();

            let currentLine = lists.list.find(
                (x) => x.id === element.values().id,
            );
            if (currentLine) currentLine.check = true;
            lists.list = [...lists.list];
        });

        checkSelected();
    }

    function unselectAll() {
        let filteredArray = lines.filter((item) => item !== null);

        filteredArray.forEach((element) => {
            element.uncheckAll();

            let currentLine = lists.list.find(
                (x) => x.id === element.values().id,
            );
            if (currentLine) currentLine.check = false;
            lists.list = [...lists.list];
        });

        checkSelected();
    }

    function checkSelected() {
        let count = 0;
        selectedLines = [];

        for (let i = 0; i < filteredIndicators.length; i++) {
            let current = filteredIndicators[i];
            if (current.check) {
                selectedLines.push(current);
                count++;
            }
        }

        if (count !== filteredIndicators.length) {
            allChecked = false;
        } else {
            allChecked = true;
        }

        lists.selectedValues = selectedLines;
    }

    function updateValues() {
        lists.selectedValues = [];
        setTimeout(() => {
            checkSelected();

            for (let i = 0; i < lists.list.length; i++) {
                let element = lines[i];
                element.check = lists.list[i].check;
            }
        }, 1);
    }

    $: filteredIndicators = lists.list.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    $: sortBy(sortByValue);

    function sortBy(value) {
        let sortedList = lists.list;

        sortedList.forEach((element) => {
            try {
                let rawPercent = element.percent.toString().trim();
                element.isRounded = rawPercent.startsWith("~");
                element.percent = element.percent.replace("~", "").trim();
            } catch {}
            element.percent = Number(element.percent);
        });

        if (value === "oldest") {
            sortedList.sort(({ id: a }, { id: b }) => a - b);
        } else if (value === "newest") {
            sortedList.sort(({ id: a }, { id: b }) => b - a);
        } else if (value === "highest") {
            sortedList.sort(({ percent: a }, { percent: b }) => b - a);
        } else if (value === "lowest") {
            sortedList.sort(({ percent: a }, { percent: b }) => a - b);
        }

        // get '~' symbol back after sorting
        sortedList.forEach((element) => {
            if (element.isRounded) {
                element.percent = `~${element.percent}`;
            } else {
                element.percent = `${element.percent}`;
            }
        });

        // so that charts.svelte gets updated data
        sortedList = lists.selectedValues;
        lists.selectedValues = [];
        setTimeout(() => (lists.selectedValues = sortedList), 1);
    }

    async function saveSelectedLines() {
        await new Promise((resolve) => {
            searchQuery = "";
            resolve();
        });
        checkSelected();
    }

    function addCustomField(index) {
        
        let title = prompt("field name?");
        let value = prompt("field value?");
        if (title && value) {
            if (!filteredIndicators[index].customFields) {
                filteredIndicators[index].customFields = [];
            }
            
            let id = filteredIndicators[index].customFields.length
            ? Math.max(...filteredIndicators[index].customFields.map((t) => t.id)) + 1 : 1;
            
            filteredIndicators[index].customFields = [
                ...filteredIndicators[index].customFields,
                { id, title, value }
            ];
        }
    }

    function deleteCustomField(index) {
        let id = 0;
        let test = JSON.parse(JSON.stringify(lists.list))

        id = lines[index].returnLastEpId()
        test[index].customFields = 
        test[index].customFields.filter((item) => item.id !== id)

        lists.list = test;
    }
</script>

<div>
<div class="active-lines">
    <div class="toolbar">
        <div class="top">
            <div>
                <div class="title__section">
                    <h2>Indicators</h2>
                    <div class="info__wrapper">
                        <div class="lines__info__wrapper">
                            <img
                                class="info__icon"
                                alt="info_icon"
                                src="./images/info.png"
                            />
                            <div class="info__content">
                                <p>
                                    <strong>Searching and sorting</strong>: Indicator data can be search by
                                    their name ("indicator" label) and can be sorted different ways using
                                    the dropdown box below search bar.
                                </p>
                                <p>
                                    <strong>Save button</strong>: If indicator data isn't updated correctly 
                                    when trying to make charts pressing the "Save" button will fix this issue. 
                                    The button isn't needed every time.
                                </p>
                                <p>
                                    <strong>Adding extra points</strong>: Extra points can be added to 
                                    indicators via "+" buttons on each line. The user must provide a label 
                                    (e.g., "result") and a value. Extra points can be deleted when editing. 
                                    Only the last given value can be deleted.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <p style='margin-top: 5px; font-size:14px;'>Create and display indicators</p>
            </div>
            <input
                id="searchbar"
                class="searchbar"
                bind:value={searchQuery}
                placeholder="Search indicators..."
                type="text"
            />
        </div>
        <div class="actions-bar">
            <div class="button-group">
                {#if allChecked}
                    <button class="select__button" onclick={unselectAll}>
                        Unselect all
                    </button>
                {:else}
                    <button class="select__button" onclick={selectAll}>
                        Select all
                    </button>
                {/if}
            </div>
            <select bind:value={sortByValue} class="selectList">
                {#each sortingOptions as s, i}
                    <option value={sortingOptions[i]}>
                        {sortingOptions[i]}
                    </option>
                {/each}
            </select>
            <button onclick={saveSelectedLines} class="saveButton">
                Save
            </button>
        </div>
        {#if filteredIndicators.length > 0}
            <div>
                <p style="font-size:14px; margin-bottom:5px;">Download selected indicators to an excel</p>
                <button style="width:120px;" onclick={handleExcelDownload}>
                    Download
                </button>
            </div>
        {/if}    
    </div>
    {#key `${sortByValue}-${filteredIndicators}`}
        <ul>
            {#each filteredIndicators as line, i}
                <li>
                    <Line
                        bind:this={lines[i]}
                        function={checkSelected}
                        update={updateValues}
                        check={line.check}
                        id={line.id}
                        name={line.name}
                        expected={line.expected}
                        start={line.start}
                        result={line.result}
                        percent={line.percent}
                        unit={line.unit}
                        deadline={line.deadline}
                        responsibility={line.responsibility}
                        customFields={line.customFields}
                        onAddField={() => addCustomField(i)}
                        onDeleteField={() => deleteCustomField(i)}
                        on:remove={(e) => removeLine(e.detail)}
                    />
                </li>
            {/each}
        </ul>
    {/key}
</div>
</div>

<style>
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    h2 {
        margin-top: 0;
        margin-bottom:0;
        min-width: 202px;
    }

    li:first-child {
        margin-top: 25px;
    }

    .active-lines {
        min-width: 770px;
        min-height: 130px;
        padding-left: 5px;
        padding-right: 5px;
        border: 2px solid #b4b4b4;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
    }

    .toolbar {
        padding: 20px;
        padding-bottom:10px;
        padding-top: 15px;
    }

    .actions-bar {
        display: flex;
        flex-direction: row;
    }

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title__section {
        display: flex;
    }

    .info__wrapper {
        position: relative;
        display: inline-block;
        left: -80px;
    }

    .lines__info__wrapper {
        position: relative;
        display: inline-block;
    }

    .lines__info__wrapper:hover .info__content {
        visibility: visible;
        opacity: 1;
    }

    .info__icon {
        width: 28px;
        height: 28px;
        padding-top: 5px;
        margin-left: 10px;
    }

    .info__content {
        visibility: hidden;
        opacity: 0;
        width: 320px;
        background-color: #f9f9f9;
        color: #000;
        text-align: left;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 8px;
        position: absolute;
        z-index: 1;
        top: 50px;
        left: -20px;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease;
    }

    .info__wrapper:hover .info__content {
        visibility: visible;
        opacity: 1;
    }

    .searchbar {
        display: flex;
        width: 250px;
        height: 25px;
        padding: 5px 3px;
        font-size: 15px;
        margin-left: 20px;
        border: 1px solid black;
        border-radius: 3px;
    }

    .button-group {
        display: flex;
        flex: 1;
    }

    .select__button {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 15px;
    }

    .selectList {
        width: 180px;
        font-size: 15px;
        padding: 2px 4px;
        height: 30px;
        margin-left: 10px;
        cursor: pointer;
        box-sizing: border-box;
    }

    .saveButton {
        height: 30px;
        margin-left: 10px;
        cursor: pointer;
    }
</style>
