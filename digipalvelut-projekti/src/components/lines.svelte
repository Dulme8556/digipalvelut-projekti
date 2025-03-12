<script>
    import { getContext, onMount } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext("list");

    let searchQuery = "";
    let test = [];
    let allChecked = false;

    onMount(() => {
        updateList();
    });

    function selectAll() {
        test.forEach((element) => {
            element.checkAll();
        });
        allChecked = true;
    }

    function unSelectAll() {
        test.forEach((element) => {
            element.unCheckAll();
        });
        allChecked = false;
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
    <ul>
        {#each filteredIndicators as line, i}
            <li>
                <Line
                    bind:this={test[i]}
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
</div>

<style>
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .active-lines {
        margin-top: 160px;
        margin-left: 50px;
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
        margin-left: 20px;
        display: flex;
        flex: 4;
    }
</style>
