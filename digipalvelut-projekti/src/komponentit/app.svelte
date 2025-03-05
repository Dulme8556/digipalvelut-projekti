<script>
    import { setContext } from "svelte";
    import AddNew from "./add-new.svelte";
    let list = [
        {index: "test value1", value1:"100", value2:"50"},
        {index: "test value2", value1:"100", value2:"150"}
    ]

    setContext('list', list);
</script>

<style>
    .line{
        display: flex;
        flex-direction: row;
    }

    .component{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 20px;
    }
</style>

<AddNew />

{#each list as l}
    <div class="line">
        <div class="component">
            <h2>index: </h2>
            <div>{l.index}</div>
        </div>
        <div class="component">
            <h2>value1: </h2>
            <div>{l.value1}</div>
        </div>
        <div class="component">
            <h2>value2: </h2>
            <div>{l.value2}</div>
        </div>
    </div>
{/each}