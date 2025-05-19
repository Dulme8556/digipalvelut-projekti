<script>
    import { setContext, onMount } from "svelte";
    import { writable } from "svelte/store";

    import AddNew from "./add-new-section/add-new.svelte";
    import Lines from "./lines-section/lines.svelte";
    import Charts from "./charts-section/charts.svelte";
    import GlobalStyles from "./global-styles.svelte";
    import Credit from "./header/credit.svelte";
    import TitleBar from "./header/title-bar.svelte";

    let lists = $state({
        list: [],
        selectedValues: [],
        charts: [],
    });

    setContext("list", lists);

    let scale = writable(1);

    function calculateScale() {
        let dpr = window.devicePixelRatio;

        return dpr > 1.4 ? 0.7 : 1;
    }

    onMount(() => {
        scale.set(calculateScale());

        const update = () => scale.set(calculateScale());
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    });
</script>

<div class="website" style="transform: scale({$scale}); transform-origin: top left; width: calc(100% / {$scale});">
    <Credit />
    <TitleBar />
    <div class="content">
        <div class="main__functions">
            <div class="main__function">
                <AddNew />
            </div>
            {#key lists.list.length}
            <div class="main__function">
                <Lines />
            </div>
            {/key}
            {#key `${lists.selectedValues.length}-${lists.charts.length}`}
            <div class="main__function">
                <Charts />
            </div>    
            {/key}
        </div>
    </div>
</div>

<GlobalStyles />

<style>
    .website {
        display: flex;
        flex-direction: column;
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
