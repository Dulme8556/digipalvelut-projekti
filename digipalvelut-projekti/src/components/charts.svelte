<script>
    import { getContext, onMount } from "svelte";
    import Chart from "./chart.svelte"; // Import the Chart component

    let chartsData = [];
    let chartId = 0;

    let lists = getContext("list");
    let selected = lists.selectedValues;

    let chartName = ""; // Chart name
    let chartNames = []; // Array to hold chart names
    let chartMade = false;

    let datasetDataEnd = [];
    let datasetDataTarget = [];
    let datasetDataStart = [];
    let labels = "";

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

    let test = [];

    onMount(async () => {
        lists.charts = lists.charts.filter((item) => !Array.isArray(item));

        test = lists.charts;
        if (test.length > 0) {
            chartsData = test;
        }
    });

    // all values to arrays
    selected.forEach((element) => {
        datasetDataEnd = [...datasetDataEnd, element.end];
        datasetDataTarget = [...datasetDataTarget, element.target];
        datasetDataStart = [...datasetDataStart, element.start];
        labels = [...labels, element.name];
    });

    let listOfCharts = [
        {
            type: typeOfChart,
            labels: labels,
            data1: {
                label: "start",
                data: datasetDataStart,
                backgroundColor: "yellow",
            },
            data2: {
                label: "end",
                data: datasetDataEnd,
                backgroundColor: "blue",
            },
            data3: {
                label: "target",
                data: datasetDataTarget,
                backgroundColor: "red",
            },
        },
    ];

    function createAllCharts() {
        console.log(listOfChartData);
        let count = 0;
        listOfChartData.forEach((element) => {
            generateCharts(count);
            count++;
        });
    }

    const generateCharts = (i) => {
        if (
            datasetDataEnd.length === 0 ||
            datasetDataTarget.length === 0 ||
            labels.length === 0
        ) {
            alert("Necessary data is missing.");
            return;
        }
        chartsData = [
            ...chartsData,
            {
                type: listOfChartData[i].type,
                labels: [...labels],
                datasets: [
                    { ...listOfChartData[i].data1 },
                    { ...listOfChartData[i].data2 },
                    { ...listOfChartData[i].data3 },
                ],
            },
        ];
        chartId++;
        chartMade = true;
        chartNames = [...chartNames, chartName]; // Save the chart name
        chartName = "";
        lists.charts = chartsData;
    };

    function testi() {
        console.log(JSON.parse(JSON.stringify(chartsData)));
    }
</script>

<button onclick={testi}>ok</button>
<div>
    <div class="toolbar">
        <div class="chartName">
            <input
                style="width: 120px;"
                placeholder="Chart Name"
                bind:value={chartName}
            />
        </div>
        <select bind:value={typeOfChart} class="selectList">
            {#each chartTypes as s, i}
                <option value={chartTypes[i]}> {chartTypes[i]}</option>
            {/each}
        </select>
        <div class="chartButton">
            <button class="chartButton__button" onclick={createAllCharts}>
                Create a chart
            </button>
        </div>
    </div>

    <div>
        {#each chartsData as data, i}
            <div>
                <Chart
                    {data}
                    key={i}
                    {chartMade}
                    chartType={typeOfChart}
                    chartName={chartNames[i]}
                />
            </div>
        {/each}
    </div>
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

    .chartName {
        margin-top: 10px;
        width: auto;
    }

    .chartButton {
        width: auto;
        height: auto;
        margin-left: 10px;
        margin-top: 10px;
    }

    .chartButton__button:hover {
        cursor: pointer;
    }
</style>
