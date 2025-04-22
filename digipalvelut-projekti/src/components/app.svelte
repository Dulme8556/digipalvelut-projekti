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
        <img class="eu_union" src="./images/EN_FundedbytheEU_RGB_POS.png" alt="Funded by the European Union">
    </div>
    <div class="s">
        <div class="t">
            <img class="vr4vet_logo" src="./images/VR4VET_LOGO_DOTS_trnsprnt_Turquoise.png" alt="VR4VET">
            <div class="a">impact tool</div>
        </div>
        <div class="h">
            <DownloadFile />
            <FileReader />
        </div>
    </div>
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
        <div class="sidebar">
        </div>
    </div>
</div>

<GlobalStyles />

<style>
    .h {
        display: flex;
        align-items: center;
    }
    .t {
        display: flex;
        flex-direction: row;
        /* padding-top: 30px; */
    }

    .s {
        border-bottom: 1px solid black;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 120px;
    }
    .a {
        font-size: 50px;
        font-weight: 600;
        padding-bottom: 5px;
        padding-top: 5px;
        /* background: linear-gradient(
            90deg,
            rgba(41, 168, 175, 1) 0%,
            rgba(17, 70, 73, 1) 100%
            ); */
            
        }
        .website {
            display: flex;
            flex-direction: column;
            height: 100vh;
            /* background-color: rgba(0, 0, 0, 0.1) */
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
        border-bottom: solid 1px black;
        /* height: 130px; */
        position: relative;
        flex-shrink: 0;
    }

    .vr4vet_logo {
        width: 220px;
        /* margin-right: 50px; */
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
