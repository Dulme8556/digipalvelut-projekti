<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
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
</div>

<!-- font is added in here -->
<GlobalStyles />