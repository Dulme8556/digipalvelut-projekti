<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
    import GlobalStyles from "./global-styles.svelte";
    import DownloadFile from "./download-file.svelte";

    let lists = $state({
        list: [],
        selectedValues: [],
    });

    setContext("list", lists);

    // temporary function
    function debugging() {
        console.log(lists.selectedValues);
    }
</script>

<div class="website">
    <div class="main__functions">
        <div style='display:flex;'>
            <AddNew />
            {#key lists.list.length}
                <Lines />
            {/key}
        </div>
        {#key lists.selectedValues.length}
            {debugging()}
            <Charts />
        {/key}
    </div>
    <DownloadFile />
</div>

<!-- font is added in here -->
<GlobalStyles />

<style>
    .website {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>
