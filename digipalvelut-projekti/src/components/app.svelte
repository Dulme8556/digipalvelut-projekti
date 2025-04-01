<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
    import DownloadFile from "./download-file.svelte";
    import GlobalStyles from "./global-styles.svelte";

    let lists = $state({
        list: [],
        selectedValues: [],
        charts: [],
    });

    setContext("list", lists);
</script>

<div class="website">
    <div class="main__functions">
        <div style='display:flex;'>
            <AddNew />
            {#key lists.list.length}
                <Lines />
            {/key}
        </div>
        <!-- bad way to fix a bug -->
        <!-- Weird bug with charts element where create toolbaar duplicates itelf randomly-->
        {#key `${lists.selectedValues.length}-${lists.charts.length}`}
            <Charts />
        {/key}
    </div>
    <DownloadFile />
</div>

<GlobalStyles />

<style>
    .website {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>
