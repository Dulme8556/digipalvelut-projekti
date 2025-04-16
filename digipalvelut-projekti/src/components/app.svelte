<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
    import FileReader from "./file-reader.svelte";
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
    <div class="credit">
        <img class="vr4vet_logo" src="./images/VR4VET_LOGO_DOTS_trnsprnt_Turquoise.png" alt="VR4VET">
        <img class="eu_union" src="./images/EN_FundedbytheEU_RGB_POS.png" alt="Funded by the European Union">
    </div>
    <div class="content">
        <div class="main__functions">
            <div style='display:flex; justify-content: space-between;'>
                <AddNew />
                {#key lists.list.length}
                    <Lines />
                {/key}
                {#key `${lists.selectedValues.length}-${lists.charts.length}`}
                    <Charts />
                {/key}
            </div>
        </div>
        <div class="sidebar">
            <DownloadFile />
            <FileReader />
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
        flex: 1;
        padding: 16px;
        display: flex;
        justify-content: space-between;
    }

    .sidebar {
        border-left: 1px solid gray;
        height: 100%;
    }

    .credit,
    .credit * {
        box-sizing: border-box;
    }
    
    .credit {
        width: 100%;
        display: flex;
        align-items: center;
        background: linear-gradient(
            90deg,
            rgba(41, 168, 175, 1) 0%,
            rgba(17, 70, 73, 1) 100%
        );
        height: 130px;
        position: relative;
        flex-shrink: 0;
    }

    .vr4vet_logo {
        width: 220px;
        margin-right: 50px;
        height: 100px;
        object-fit: cover;
        aspect-ratio: 220 / 100;
    }

    .eu_union {
        height: 100px;
        object-fit: cover;
        aspect-ratio: 448.63 / 100;
    }
</style>
