<script>
    import { getContext } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext("list");

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

    async function checkSelected() {
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
</script>

<div>
<div class="active-lines">
    <div class="toolbar">
        <div class="top">
            <h2>Active indicators</h2>
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
                        target={line.target}
                        start={line.start}
                        end={line.end}
                        percent={line.percent}
                        unit={line.unit}
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
        min-width: 202px;
    }

    li:first-child {
        margin-top: 25px;
    }

    .active-lines {
        margin-top: 20px;
        margin-left: 40px;
        border-radius: 10px;
        min-width: 770px;
        min-height: 130px;
        padding-left: 5px;
        padding-right: 5px;
        border: 2px solid #b4b4b4;
        display: flex;
        flex-direction: column;
    }

    .toolbar {
        padding: 20px;
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

    .searchbar {
        display: flex;
        width: 200px;
        height: 25px;
        padding: 5px 3px;
        font-size: 15px;
        margin-left: 20px;
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
        display: flex;
        flex: 1;
        font-size: 15px;
        margin-left: 10px;
        cursor: pointer;
        font-size: 15px;
    }

    .saveButton {
        height: 30px;
        margin-left: 10px;
        cursor: pointer;
    }
</style>
