<script>
    import { getContext, onMount } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext("list");

    let searchQuery = "";
    let lines = [];
    let allChecked = true;

    let selectedLines = [];

    let sortByValue = "oldest";
    let sortingOptions = ["oldest", "newest", "highest", "lowest"];

    onMount(() => {
        let filteredIndicators = lists.list;
    });

    function selectAll() {
        lines.forEach((element) => {
            element.checkAll();
        });
        lists.list.forEach((element) => {
            element.check = true;
        });

        allChecked = true;
        checkSelected();
    }

    function unselectAll() {
        lines.forEach((element) => {
            element.uncheckAll();
        });
        lists.list.forEach((element) => {
            element.check = false;
        });

        allChecked = false;
        checkSelected();
    }

    function checkSelected() {
        let count = 0;
        selectedLines = [];
        lines.forEach((element) => {
            if (element.selected()) {
                count++;
                selectedLines.push(element.values());
            }
        });
        if (count !== lines.length) {
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

    $: {
        sortBy(sortByValue);
    }

    function sortBy(value) {
        let sortedList = lists.list;
        if (value === "oldest") {
            sortedList.sort(({ id: a }, { id: b }) => a - b);
        } else if (value === "newest") {
            sortedList.sort(({ id: a }, { id: b }) => b - a);
        } else if (value === "highest") {
            sortedList.sort(({ percent: a }, { percent: b }) => b - a);
        } else if (value === "lowest") {
            sortedList.sort(({ percent: a }, { percent: b }) => a - b);
        }

        // so that charts.svelte gets updated data
        sortedList = lists.selectedValues
        lists.selectedValues = []
        setTimeout(() => (lists.selectedValues = sortedList), 1)
    }
</script>

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
    {#key sortByValue}
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
