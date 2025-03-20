<script>
    import { getContext, onMount } from "svelte";
    import Chart from "./chart.svelte";

    let chartsData = [];
    let chartId = 0;

    let lists = getContext("list");
    let selected = lists.selectedValues;

    let datasetDataEnd = [];
    let datasetDataTarget = [];
    let datasetDataStart = [];
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

    let test = []

    onMount(async () => {
        lists.charts = lists.charts.filter(item => !Array.isArray(item));

        test = lists.charts
        if (test.length > 0) {
            chartsData = test
            // listOfChartData = test
        }
    });

    // all values to arrays
    selected.forEach((element) => {
        datasetDataEnd = [...datasetDataEnd, element.end];
        datasetDataTarget = [...datasetDataTarget, element.target];
        datasetDataStart = [...datasetDataStart, element.start];
        labels = [...labels, element.name];
    });

    let listOfChartData = [
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
        console.log(listOfChartData)
        let count = 0;
        listOfChartData.forEach(element => {
            generateCharts(count)
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

        lists.charts = [lists.charts, ...chartsData]
    };

    function testi() {
        console.log(JSON.parse(JSON.stringify(chartsData)))
    }
</script>
<button onclick={testi}>ok</button>
<div>
    <div class="toolbar">
        <div class="chartButton">
            <button class="chartButton__button" onclick={createAllCharts}>
                Create a chart
            </button>
        </div>
        <select bind:value={listOfChartData[0].type} class="selectList">
            {#each chartTypes as s, i}
                <option value={chartTypes[i]}> {chartTypes[i]}</option>
            {/each}
        </select>
    </div>

    <div>
        {#each chartsData as data, i}
            <Chart {data} key={i} {chartMade} chartType={chartsData[i].type} />
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
</style>
