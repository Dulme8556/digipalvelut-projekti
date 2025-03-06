<script>
    import { setContext } from "svelte";

    import AddNew from "./add-new.svelte";
    import Lines from "./lines.svelte";
    import Charts from "./charts.svelte";
    import AddNewSpinBox from "./add-new-spin_box.svelte";
    import FileReader from "./file-reader.svelte";

    let lists = $state({
        list: [],
    });

    setContext('list', lists);
</script>

<div>
    <AddNew />
    <Lines />
    <AddNewSpinBox />
    <!-- charts.svelte isn't working and causing errors so commented -->
    <!-- <Charts /> -->
     <FileReader/>
</div>
