<script>
    import { getContext, onMount } from "svelte";
    import Chart from "./chart.svelte";
    
    let lists = getContext("list");
    let selected = lists.selectedValues;

    let chartsData = [];
    $: chartId = lists.charts.length ? Math.max(...lists.charts.map((t) => t.id)) + 1: 1;

    let chartName = "";
    let chartMade = false;
    let indexAxis = 'x';

    let datasetDataEnd = [];
    let datasetDataTarget = [];
    let datasetDataStart = [];
    let labels = [];

    let typeOfChart = "bar (vertical)";
    let chartTypes = [
        "bar (vertical)",
        "bar (horizontal)",
        "line",
        "pie",
        "bubble",
        "doughnut",
        "polarArea",
        "radar",
        "scatter",
    ];

    let subVertical = "(vertical)"
    let subHorizontal = "(horizontal)"

    onMount(async () => {
        lists.charts = lists.charts.filter((item) => !Array.isArray(item));

        if (lists.charts.length > 0) {
            chartsData = [];

            lists.charts.forEach((element) => {
                listOfChartData = [
                    ...listOfChartData,
                    {
                        id: element.id,
                        title: element.title,
                        type: element.type,
                        labels: element.labels,
                        datasets: element.datasets,
                    },
                ];
            });
            loadOldCharts();
        }
    });

    function trimTypeOfChart() {
        if (typeOfChart.includes(subVertical)) {
            typeOfChart = typeOfChart.replace(subVertical, "").trim();
        } else if (typeOfChart.includes(subHorizontal)) {
            typeOfChart = typeOfChart.replace(subHorizontal, "").trim();
            indexAxis = 'y';
        }
    }

    // all values to arrays
    selected.forEach((element) => {
        datasetDataEnd = [...datasetDataEnd, element.end];
        datasetDataTarget = [...datasetDataTarget, element.target];
        datasetDataStart = [...datasetDataStart, element.start];
        labels = [...labels, element.name];
    });

    // default values for listOfChartData
    let defaultValues = [
        {
            id: chartId,
            title: chartName,
            type: typeOfChart,
            labels: labels,
            indexAxis: indexAxis,
            datasets: [
                {
                    label: "start",
                    data: datasetDataStart,
                    backgroundColor: "yellow",
                },
                {
                    label: "end",
                    data: datasetDataEnd,
                    backgroundColor: "blue",
                },
                {
                    label: "target",
                    data: datasetDataTarget,
                    backgroundColor: "red",
                },
            ],
        },
    ];

    let listOfChartData = [defaultValues[0]];

    function createNewChart() {
        trimTypeOfChart();
        if (
            datasetDataEnd.length !== 0 ||
            datasetDataTarget.length !== 0 ||
            labels.length !== 0
        ) {
            listOfChartData[0].id = chartId;
            listOfChartData[0].title = chartName;
            listOfChartData[0].type = typeOfChart;
            listOfChartData[0].indexAxis = indexAxis;
            listOfChartData.forEach((element) => {
                generateCharts(element);
            });
            listOfChartData = defaultValues;
        } else {
            alert("Necessary data is missing.");
            return;
        }
    }
    // ^^ createChart button is clicked so it adds new chart
    // vv load the old ones in onMount

    function loadOldCharts(createNew) {
        for (let i = 1; i < listOfChartData.length; i++) {
            let element = listOfChartData[i];
            generateCharts(element);
        }
        listOfChartData = defaultValues;
    }

    const generateCharts = (element) => {
        element = JSON.parse(JSON.stringify(element));

        if (element.type === "doughnut") {
            chartsData = [
                ...chartsData,
                {
                    title: element.title,
                    type: "doughnut",
                    labels: labels,
                    datasets: [
                        {
                            label: "Values",
                            data: datasetDataEnd,
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56",
                                "#4BC0C0",
                                "#9966FF",
                            ],
                        },
                    ],
                },
            ];
        } else {
            chartsData = [
                ...chartsData,
                {
                    id: element.id,
                    title: element.title,
                    type: element.type,
                    labels: element.labels,
                    indexAxis: element.indexAxis,
                    datasets: [
                        { ...element.datasets[0] },
                        { ...element.datasets[1] },
                        { ...element.datasets[2] },
                    ],

                },
            ];
        }

        chartMade = true;
        chartName = "";

        lists.charts = chartsData;
    };
</script>

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
                <option value={chartTypes[i]}>{chartTypes[i]}</option>
            {/each}
        </select>
        <div class="chartButton">
            <button class="chartButton__button" onclick={createNewChart}>
                Create a chart
            </button>
        </div>
    </div>
    <div>
        {#each chartsData as data}
            <div>
                <Chart {data} {chartMade} />
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
