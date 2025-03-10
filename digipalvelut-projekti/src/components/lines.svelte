<script>
    import { getContext } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext('list')

    function removeLine(line) {
        lists.list = lists.list.filter((t) => t.id === line.id)
    }
</script>
<ul>
    {#each lists.list as line}
    <li>
        <Line {line}
        id={line.id} 
        name={line.name} 
        target={line.target} 
        start={line.start} 
        end={line.end} 
        unit={line.unit} 
        on:remove={(e) => removeLine(e.detail)}/>
    </li>
    {/each}
</ul>
        
<style>
    ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
</style>
