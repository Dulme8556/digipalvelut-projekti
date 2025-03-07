<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
    import FileReader from "./file-reader.svelte";
    import GlobalStyles from "./global-styles.svelte";

    let lists = $state({
        list: [],
    });

    setContext('list', lists);
</script>

<div>
    <AddNew />
    <Lines />
    <Charts />
    <FileReader/>
</div>

<!-- font is added in here -->
<GlobalStyles />