<script>
    import { getContext, onMount } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext("list");

    let searchQuery = "";
    let lines = [];
    let allChecked = false;

    let selectedLines = [];

    let sortByValue = "oldest";
    let sortingOptions = ["oldest", "newest", "highest", "lowest"];

    onMount(() => {
        let filteredIndicators = lists.list;
    });

    function selectAll() {
        allChecked = true;

        let filteredArray = lines.filter((item) => item !== null);

        filteredArray.forEach((element) => {
            element.checkAll();

            let currentLine = lists.list.find((x) => x.id === element.values().id);
            if (currentLine) currentLine.check = true;
        });

        checkSelected();
    }

    function unselectAll() {
        allChecked = false;

        let filteredArray = lines.filter((item) => item !== null);

        filteredArray.forEach((element) => {
            element.uncheckAll();

            let currentLine = lists.list.find((x) => x.id === element.values().id);
            if (currentLine) currentLine.check = false;
        });

        checkSelected();
    }

    async function checkSelected() {
        let saveSearchQuery = searchQuery
        let saveLength = filteredIndicators.length

        console.log("functio done")

        await new Promise((resolve) => {
            // searchQuery = "";
            resolve();
        });


        let count = 0;
        selectedLines = [];

        let filteredArray = lines.filter((item) => item !== null);

        filteredArray.forEach((element) => {
            if (element.selected()) {
                count++;
                selectedLines.push(element.values());
                console.log("selected status: ", element.selected())
            }
        });
        if (count !== saveLength) {
            allChecked = false;
        } else {
            allChecked = true;
        }
        lists.selectedValues = selectedLines;

        // return the searchQuery
        // searchQuery = saveSearchQuery
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

    $: filteredIndicators = JSON.parse(
        JSON.stringify(
            lists.list.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        ),
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

    function debug() {
        console.log(filteredIndicators)
    }
</script>
<button onclick={debug} style="height: 50px; margin-top: 300px">debug</button>
<div class="active-lines">
    <h2>Active indicators</h2>
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
        <input
            id="searchbar"
            class="searchbar"
            bind:value={searchQuery}
            placeholder="Search indicators..."
            type="text"
        />
        <select bind:value={sortByValue} class="selectList">
            {#each sortingOptions as s, i}
                <option value={sortingOptions[i]}>{sortingOptions[i]}</option>
            {/each}
        </select>
    </div>
    {#key `${sortByValue}-${filteredIndicators}`}
        {#if filteredIndicators.length === 0}
            <div class="empty">No data found</div>
        {:else}
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
        {/if}
    {/key}
</div>

<style>
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .active-lines {
        margin-top: 160px;
        margin-left: 40px;
    }

    .actions-bar {
        display: flex;
        flex-direction: row;
        width: 600px;
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

    .searchbar {
        padding: 5px 3px;
        font-size: 15px;
        margin-left: 10px;
        display: flex;
        flex: 4;
    }

    .selectList {
        display: flex;
        flex: 1;
        font-size: 15px;
        margin-left: 10px;
        cursor: pointer;
        font-size: 15px;
    }

    .empty {
        padding: 20px;
        color: gray;
    }
</style>
