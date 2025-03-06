<script>
    // Currently not working


    import { getContext } from "svelte";
    import { PieChart } from "layerchart";

    let lists = getContext('list')

    let list = lists.list;

//     let data = [
//   {"year": 2019,"basket": 1,"fruit": "apples","value": 3840},
//   {"year": 2019,"basket": 1,"fruit": "bananas","value": 1920},
//   {"year": 2019,"basket": 2,"fruit": "cherries","value": 960},
//   {"year": 2019,"basket": 2,"fruit": "grapes", "value": 400}
// ]
</script>

<style>

</style>
<!-- 
<div class="h-[300px] p-4 border rounded resize overflow-auto">
    <PieChart {data} key="fruit" value="value" />
</div> -->