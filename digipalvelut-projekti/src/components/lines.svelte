<script>
    import { getContext, onMount } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext("list");

    let searchQuery = "";
    let lines = [];
    let allChecked = false;

    onMount(() => {
        updateList();
    });

    function selectAll() {
        lines.forEach((element) => {
            element.checkAll();
        });
        allChecked = true;
        checkSelected()
    }

    function unSelectAll() {
        lines.forEach((element) => {
            element.unCheckAll();
        });
        allChecked = false;
        checkSelected()
    }

    function checkSelected() {
        let count = 0;
        lines.forEach(element => {
            if (element.selected()) {
                count++;
            }
        });
        console.log(count)
        if (count === filteredIndicators.length) {
            allChecked = !allChecked;
            console.log("if activated")
        }
        console.log("checkSelected activated")
    }

    function updateList() {
        let filteredIndicators = lists.list;
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
                <button class="select__button" onclick={unSelectAll}
                    >Unselect all</button
                >
            {:else}
                <button class="select__button" onclick={selectAll}
                    >Select all</button
                >
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
        <div class="empty">Add data</div>
    {:else}
        <ul>
            {#each filteredIndicators as line, i}
                <li>
                    <Line
                        bind:this={lines[i]}
                        {line}
                        id={line.id}
                        name={line.name}
                        target={line.target}
                        start={line.start}
                        end={line.end}
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
    }
</style>
