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

    console.log(lists.list)
</script>

<div>
    <AddNew />
    <Lines />
<<<<<<< HEAD
    <Charts />
=======
    <!-- charts.svelte isn't working and causing errors so commented -->
    <!-- <Charts /> -->
     <FileReader/>
>>>>>>> fbe913113d960f7ea3e23d017b88f5682f2b8d80
</div>

<!-- font is added in here -->
<GlobalStyles />