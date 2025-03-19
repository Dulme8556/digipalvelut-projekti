<script>
    import { getContext } from "svelte";
    import Chart from "./chart.svelte";

    let chartsData = [];
    let chartId = 0;

    let lists = getContext("list");
    let selected = lists.selectedValues;

    let datasetDataEnd = [];
    let datasetDataTarget = [];
    let labels = "";
    let chartMade = false;

    let typeOfChart = "bar";
    let chartTypes = [
        "bar",
        "line",
        "pie",
        "bubble",
        "doughnut",
        "polarArea",
        "radar",
        "scatter",
    ];

    // all end values to array
    selected.forEach((element) => {
        datasetDataEnd = [...datasetDataEnd, element.end];
    });

    // all target values to array
    selected.forEach((element) => {
        datasetDataTarget = [...datasetDataTarget, element.target];
    });

    // all name values to array
    selected.forEach((element) => {
        labels = [...labels, element.name];
    });

    let listOfCharts = [
        {
            type: typeOfChart,
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "target",
                        backgroundColor: "red",
                        data: datasetDataTarget,
                    },
                    {
                        label: "end",
                        backgroundColor: "blue",
                        data: datasetDataEnd,
                    },
                ],
            },
        },
    ];

    const generateCharts = () => {
        if (datasetDataEnd.length === 0 || datasetDataTarget.length === 0 || labels.length === 0) {
            alert("Necessary data is missing.");
            return;
        }
        chartsData = [
            ...chartsData,
            {
                labels: labels,
                datasets: [
                    {
                        label: "end",
                        data: datasetDataEnd,
                        borderColor: "red",
                        backgroundColor: "blue",
                        fill: false,
                    },
                    {
                        label: "target",
                        data: datasetDataTarget,
                        borderColor: "blue",
                        backgroundColor: "red",
                        fill: false,
                    },
                ],
            },
        ];
        chartId++;
        chartMade = true;
    };
</script>

<div class="toolbar">
    <div class="chartButton">
        <button class="chartButton__button" onclick={generateCharts}>
            Create a chart
        </button>
    </div>
    <select bind:value={typeOfChart} class="selectList">
        {#each chartTypes as s, i}
            <option value={chartTypes[i]}> {chartTypes[i]}</option>
        {/each}
    </select>
</div>

<div>
    {#each chartsData as data, i}
            <Chart {data} key={i} chartMade={chartMade} chartType={typeOfChart}/>
    {/each}
</div>

<style>
    .toolbar {
        display: flex;
        flex-direction: row;
    }

    .selectList {
        width: 100px;
        margin-top: 12px;
        margin-left: 10px;
    }

    .chartButton {
        width: auto;
        height: auto;
        margin-top: 10px;
    }

    .chartButton__button:hover {
        cursor: pointer;
    }

    .chartButton__button:hover {
        cursor: pointer;
    }

    .chart {
        width: 400px;
        height: 300px;
    }
</style>
