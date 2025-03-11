<script>
    import { getContext } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext('list')
</script>
<div class='s'>
    <h2>Active graphs</h2>
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
</div>
        
<style>
    ul {
        list-style: none;
        margin: 0;
        padding: 0;

    }
    .s{
        margin-top:160px;
        margin-left:50px;
    }
</style>
