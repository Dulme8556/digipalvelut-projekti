<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
    import GlobalStyles from "./global-styles.svelte";
    import DownloadFile from "./download-file.svelte";

    let lists = $state({
        list: [],
    });
    
    setContext('list', lists);
</script>

<style>
    .website {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .add__new {
        display: flex;
        flex-direction: column;
    }
</style>

<div class="website">
    <div class="add__new">
        <div style='display:flex;'>
            <AddNew />
            <Lines />
        </div>
        <Charts />
    </div>
    <DownloadFile />
</div>

<!-- font is added in here -->
<GlobalStyles />