<script>
    import { getContext, onMount } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext("list");

    let searchQuery = "";
    let test = [];

    onMount(() => {
        updateList();
    })

    function selectAll() {
        test.forEach(element => {
            element.checkboxClick()
        });
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
    <button class="select-all__button" onclick={selectAll}>Select all</button>
    <input
        id="searchbar"
        class="searchbar"
        bind:value={searchQuery}
        placeholder="Search indicators..."
        type="text"
    />
    <ul>
        {#each filteredIndicators as line, i}
            <li>
                <Line bind:this={test[i]}
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

    .select-all__button {
        cursor: pointer;
        padding: 5px 3px;
        font-size: 15px;
    }

    .searchbar {
        padding: 5px 3px;
        font-size: 15px;
    }
</style>
