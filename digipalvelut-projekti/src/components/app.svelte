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
    <div class="credit">
        <img class="vr4vet_logo" src="./images/VR4VET_LOGO_DOTS_trnsprnt_Turquoise.png">
        <img class="eu_union" src="./images/EN_FundedbytheEU_RGB_POS.png">
    </div>
    <div class="main__functions">
        <div style='display:flex;'>
            <AddNew />
            {#key lists.list.length}
                <Lines />
            {/key}
            {#key `${lists.selectedValues.length}-${lists.charts.length}`}
                <Charts />
            {/key}
        </div>
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

    .credit,
    .credit * {
      box-sizing: border-box;
    }
    .credit {
      display:flex;
      align-items:center;
      background: linear-gradient(
       90deg,
       rgba(41, 168, 175, 1) 0%,
       rgba(17, 70, 73, 1) 100%
      );
      height: 130px;
      position: relative;
    }

    .vr4vet_logo,
    .vr4vet_logo * {
      box-sizing: border-box;
    }
    .vr4vet_logo {
      width: 220px;
      margin-right:50px;
      height: 100px;
      position: relative;
      object-fit: cover;
      aspect-ratio: 220/100;
    }

    .eu_union,
    .eu_union * {
      box-sizing: border-box;
    }
    .eu_union {
      height: 100px;
      position: relative;
      object-fit: cover;
      aspect-ratio: 448.63/100;
    }
</style>
