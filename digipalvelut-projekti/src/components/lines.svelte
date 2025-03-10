<script>
    import { getContext } from "svelte";
    import Line from "./line.svelte";

    let lists = getContext('list')

    lists.list = [];

    let array = [];

    function deleteThis(tämä) {
        // lists.list.forEach(element => {
        //     if (element.id === id) {
                lists.list = lists.list.filter((t) => t.id !== tämä.id);
            // }
            // else {
            //     console.log("different id")
            // }
        // });
        console.log(array)
    }
</script>

{#each lists.list as l}
    <Line id={l.id} name={l.name} target={l.target} start={l.start} end={l.end} unit={l.unit} on:remove={(e) => deleteThis(e.detail)}/>
{/each}

<style>

</style>
