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
    let labels = [];

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

    let modified = false;

    onMount(async () => {
        lists.charts = lists.charts.filter((item) => !Array.isArray(item));

        // detect if selected values have changed
        if (lists.charts.length > 0) {
            chartsData = []; // empty the chart data
            modified = true;

            lists.charts.forEach((element) => {
                listOfChartData = [
                    ...listOfChartData,
                    {
                        title: element.title,
                        type: element.type,
                        labels: element.labels,
                        datasets: element.datasets,
                    },
                ];
            });
            createAllCharts(false);
        }
    });

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
            title: chartName,
            type: typeOfChart,
            labels: labels,
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

    let listOfChartData = [
        {
            title: chartName,
            type: typeOfChart,
            labels: labels,
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

    function createAllCharts(createNew) {
        if (createNew) {
            if (
                datasetDataEnd.length !== 0 ||
                datasetDataTarget.length !== 0 ||
                labels.length !== 0
            ) {
                listOfChartData[0].type = typeOfChart;
                listOfChartData[0].title = chartName;
                listOfChartData.forEach((element) => {
                    generateCharts(element);
                });
                listOfChartData = defaultValues;
            } else {
                alert("Necessary data is missing.");
                return;
            }
        }
        // ^^ createAllCharts is called from Create chart button so it also adds new chart
        // vv else just load the old ones
        else {
            for (let i = 1; i < listOfChartData.length; i++) {
                let element = listOfChartData[i];
                generateCharts(element);
            }
            listOfChartData = defaultValues;
        }
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
                    title: element.title,
                    type: element.type,
                    labels: element.labels,
                    datasets: [
                        { ...element.datasets[0] },
                        { ...element.datasets[1] },
                        { ...element.datasets[2] },
                    ],
                },
            ];
        }

        chartId++;
        chartMade = true;
        chartNames = [...chartNames, chartName];
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
            <button class="chartButton__button" onclick={createAllCharts(true)}>
                Create a chart
            </button>
        </div>
    </div>
    <div>
        {#each chartsData as data, i}
            <div>
                <Chart id={i} {data} {chartMade} />
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
