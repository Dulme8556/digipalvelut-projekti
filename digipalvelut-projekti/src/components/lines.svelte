<script>
    import { getContext, onMount } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext("list");

    let searchQuery = "";
    let lines = [];
    let allChecked = true;

    let selectedLines = [];

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
    </div>
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
        width: 500px;
    }

    .button-group {
        display: flex;
        flex: 1;
    }

    .select__button {
        cursor: pointer;
        padding: 5px 3px;
        font-size: 15px;
    }

    .searchbar {
        padding: 5px 3px;
        font-size: 15px;
        margin-left: 10px;
        display: flex;
        flex: 4;
    }

    .empty {
        padding: 20px;
        color: gray;
    }
</style>
