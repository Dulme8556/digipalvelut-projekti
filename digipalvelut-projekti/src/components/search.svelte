<script>
    import { getContext } from "svelte";

    let searchQuery = '';
    let lists = getContext('list');
    
    let filteredIndicators = lists.list;

    $: filteredIndicators = lists.list.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
</script>

<style>
    
</style>

<div class="container">
    <input 
        id="searchbar" 
        bind:value={searchQuery} 
        placeholder="Search animals..." 
        type="text" 
    />

    <ul id="list">
        {#each filteredIndicators as animal}
            <li>{animal.name}</li>  <!-- Assuming 'name' is the property you want to display -->
        {/each}
    </ul>
</div>
