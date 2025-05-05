<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
    import GlobalStyles from "./global-styles.svelte";
    import Credit from "./credit.svelte";
    import TitleBar from "./title-bar.svelte";

    let lists = $state({
        list: [],
        selectedValues: [],
        charts: [],
    });

    setContext("list", lists);

</script>

<div class="website">
    <Credit />
    <TitleBar />
    <div class="content">
        <div class="main__functions">
            <AddNew />
            {#key lists.list.length}
                <Lines />
            {/key}
            {#key `${lists.selectedValues.length}-${lists.charts.length}`}
                <Charts />
            {/key}
        </div>
    </div>
</div>

<GlobalStyles />

<style>
    .website {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content {
        display: flex;
        flex: 1;
    }

    .main__functions {
        display: flex;
        justify-content: space-between;
        flex: 1;
        padding: 15px;
        margin: 0 1vw;
        margin-top: 20px;
    }
</style>
