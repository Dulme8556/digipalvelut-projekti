<script>
    import { getContext, onMount } from "svelte";
    import Chart from "./chart.svelte";
    import Line from "./chart-config/line";

    let lists = getContext("list");
    let selected = lists.selectedValues;

    let chartsData = [];
    $: chartId = lists.charts.length
        ? Math.max(...lists.charts.map((t) => t.id)) + 1
        : 1;

    let chartName = "";
    let chartMade = false;
    let indexAxis = "";

    let converted = false;

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
        "doughnut",
    ];

    let subVertical = "(vertical)";
    let subHorizontal = "(horizontal)";

    onMount(async () => {
        lists.charts = lists.charts.filter((item) => !Array.isArray(item));
        console.log(lists.charts)

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
                        indexAxis: element.indexAxis,
                        datasets: element.datasets,
                        converted: element.converted,
                    },
                ];
            });
            loadOldCharts();
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
            id: chartId,
            title: chartName,
            type: typeOfChart,
            labels: labels,
            indexAxis: indexAxis,
            converted: converted,
            datasets: [
                {
                    label: "start",
                    data: datasetDataStart,
                    backgroundColor: "yellow",
                    minBarLength: 4,
                },
                {
                    label: "end",
                    data: datasetDataEnd,
                    backgroundColor: "blue",
                    minBarLength: 4,
                },
                {
                    label: "target",
                    data: datasetDataTarget,
                    backgroundColor: "red",
                    minBarLength: 4,
                },
            ],
        },
    ];

    let listOfChartData = [defaultValues[0]];

    function getTrimmedChartType() {
        let tempType = typeOfChart;
        let axis = "x";

        if (tempType.includes(subVertical)) {
            tempType = tempType.replace(subVertical, "").trim();
        } else if (tempType.includes(subHorizontal)) {
            tempType = tempType.replace(subHorizontal, "").trim();
            axis = "y";
        }

        return { type: tempType, axis };
    }

    function createNewChart() {
        const { type, axis } = getTrimmedChartType();

        if (
            datasetDataEnd.length !== 0 ||
            datasetDataTarget.length !== 0 ||
            labels.length !== 0
        ) {
            let chartData = {
                id: chartId,
                title: chartName,
                type: type,
                labels: [...labels],
                indexAxis: axis,
                converted: converted,
                datasets: [],
            };

            if (type === "doughnut" || type === "pie") {
                chartData.datasets = [
                    {
                        label: "Values",
                        data: [...datasetDataEnd], // Store static data
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                        ],
                    },
                ];
            } else if (chartData.type === "line") {
                let line = new Line();

                if (!chartData.converted) {
                    chartData.converted = true;

                    line.changeData(datasetDataStart, datasetDataEnd, datasetDataTarget, labels);
                    let newLineDataset = JSON.parse(JSON.stringify(line.getData()));

                    chartData.datasets = newLineDataset.datasets;
                    console.log(newLineDataset.datasets)
                    chartData.labels = newLineDataset.labels;
                }
            } else {
                chartData.datasets = [
                    {
                        label: "start",
                        data: [...datasetDataStart],
                        backgroundColor: "yellow",
                        minBarLength: 4,
                    },
                    {
                        label: "end",
                        data: [...datasetDataEnd],
                        backgroundColor: "blue",
                        minBarLength: 4,
                    },
                    {
                        label: "target",
                        data: [...datasetDataTarget],
                        backgroundColor: "red",
                        minBarLength: 4,
                    },
                ];
            }

            listOfChartData = [chartData];
            listOfChartData.forEach((element) => generateCharts(element));
            lists.charts = [...lists.charts, chartData]
        } else {
            alert("Necessary data is missing.");
        }
    }

    // ^^ createChart button is clicked so it adds new chart
    // vv load the old ones in onMount

    function loadOldCharts() {
        for (let i = 1; i < listOfChartData.length; i++) {
            let element = listOfChartData[i];
            generateCharts(element);
        }
        listOfChartData = defaultValues;
    }

    const generateCharts = async (element) => {
        element = JSON.parse(JSON.stringify(element));

        chartsData = [
            ...chartsData,
            {
                id: element.id,
                title: element.title,
                type: element.type,
                labels: element.labels,
                indexAxis: element.indexAxis,
                datasets: element.datasets,
            },
        ];

        chartMade = true;
        chartName = "";
        indexAxis = "x";

        typeOfChart = "bar (vertical)";
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
        width: 120px;
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
