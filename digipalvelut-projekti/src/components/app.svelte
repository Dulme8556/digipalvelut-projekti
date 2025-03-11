<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
    import GlobalStyles from "./global-styles.svelte";
    import DownloadFile from "./download-file.svelte";
    import Search from "./search.svelte";

    let lists = $state({
        list: [],
    });
    
    setContext('list', lists);
</script>

<style>
    .website {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .header {
        display: flex;
    }

    .body {
        display: flex;
        flex-direction: column;
    }
</style>

<div class="website">
    <div class="header">
        <Search />
        <DownloadFile />
    </div>
    <div class="body">
        <AddNew />
        <Lines />
        <Charts />
    </div>
</div>


<!-- font is added in here -->
<GlobalStyles />