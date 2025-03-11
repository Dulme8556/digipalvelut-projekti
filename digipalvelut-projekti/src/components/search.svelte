<script>
    import { getContext } from "svelte";

    let searchQuery = "";

    let lists = getContext("list");

    let items = lists.list.name;

    try {
        filteredNames = items.filter((item) =>
            item.toUpperCase().includes(searchQuery.toUpperCase()),
        );
    } catch {
        console.log("error");
    }
</script>

<input
    type="text"
    bind:value={searchQuery}
    placeholder="Search for names.."
    class="search-input"
/>

<ul class="name-list">
    {#each filteredNames as name}
        <li>
            <Line
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

<style>
    .search-input {
        /* background-image: url("/css/searchicon.png"); */
        background-position: 10px 12px;
        background-repeat: no-repeat;
        width: 300px;
        font-size: 16px;
        padding: 12px 20px 12px 40px;
        border: 1px solid #ddd;
        margin-bottom: 12px;
    }

    .name-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .name-list li a {
        border: 1px solid #ddd;
        margin-top: -1px;
        background-color: #f6f6f6;
        padding: 12px;
        text-decoration: none;
        font-size: 18px;
        color: black;
        display: block;
    }

    .name-list li a:hover:not(.header) {
        background-color: #eee;
    }
</style>
