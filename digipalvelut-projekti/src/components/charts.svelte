<script>
    import { getContext, onMount } from "svelte";
    import { jsPDF } from "jspdf";

    import Chart from "./chart.svelte";
    import Line from "./chart-config/line.js";

    let lists = getContext("list");
    let selected = lists.selectedValues;

    let chartsData = [];
    $: chartId = lists.charts.length
        ? Math.max(...lists.charts.map((t) => t.id)) + 1
        : 1;

    let chartName = "";
    let chartMade = false;
    let indexAxis = "";

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

    let storeChildComponents = [];
    let storeCanvases = [];
    let allChecked = false;

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
                        indexAxis: element.indexAxis,
                        datasets: element.datasets,
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
        let checkedItems = lists.list.filter((item) => item.check);
        let datasetDataEnd = checkedItems.map((item) => item.end);
        let datasetDataTarget = checkedItems.map((item) => item.target);
        let datasetDataStart = checkedItems.map((item) => item.start);
        let labels = checkedItems.map((item) => item.name);

        if (checkedItems.length === 0) {
            alert("Error: No indicators selected.");
            return;
        }

        const { type, axis } = getTrimmedChartType();

        let chartData = {
            id: chartId,
            title: chartName,
            type: type,
            labels: labels,
            indexAxis: axis,
            datasets: [],
        };

        if (type === "doughnut" || type === "pie") {
            chartData.datasets = [
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
            ];
        } else if (type === "line") {
            let line = new Line();
            line.changeData(
                datasetDataStart,
                datasetDataEnd,
                datasetDataTarget,
                labels,
            );
            chartData.datasets = JSON.parse(
                JSON.stringify(line.getData()),
            ).datasets;
            chartData.labels = JSON.parse(
                JSON.stringify(line.getData()),
            ).labels;
        } else {
            chartData.datasets = [
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
            ];
        }

        listOfChartData = [chartData];
        listOfChartData.forEach((element) => generateCharts(element));
        lists.charts = [...lists.charts, chartData];
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

    const generateCharts = (element) => {
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

    function toggleSelected(selected) {
        if (selected) {
            storeChildComponents.forEach(element => {
                element.checkAll()
            });
            allChecked = true;
        } else {
            storeChildComponents.forEach(element => {
                element.uncheckAll()
            });
            allChecked = false;
        }
    }

    function checkSelected() {
        let count = 0;
        storeChildComponents.forEach(element => {
            if (element.returnCheck()) {
                count++;
            }
        });

        if (count === storeChildComponents.length) {
            allChecked = true;
        } else {
            allChecked = false;
        }
    }

    function storeChartData() {
        storeCanvases = [];
        
        storeChildComponents.forEach((element) => {
            if (element.returnCheck()) {
                storeCanvases.push(element.returnCanvas());
            }
        });
    }

    // download all selected charts
    async function downloadPDF() {
        // get the selected charts
        storeChartData();

        if (storeCanvases.length === 0) {
            alert("No selected charts")
            return;
        }
        const doc = new jsPDF("l", "mm");
        
        let pageWidth = doc.internal.pageSize.getWidth();
        let pageHeight = doc.internal.pageSize.getHeight();

        let margin = 10;
        let columns = Math.min(2, storeCanvases.length);
        let rows = Math.ceil(storeCanvases.length / columns);

        let imgWidth = (pageWidth - (columns + 1) * margin) / columns;
        let imgHeight = (pageHeight - (rows + 1) * margin) / rows;

        for (let i = 0; i < storeCanvases.length; i++) {
            const img = new Image();
            img.src = storeCanvases[i].toDataURL("image/png");

            await new Promise((resolve) => {
                img.onload = () => {
                    const column = i % columns;
                    const row = Math.floor(i / columns);
                    const x = margin + column * (imgWidth + margin);
                    const y = margin + row * (imgHeight + margin);

                    doc.addImage(img, "PNG", x, y, imgWidth, imgHeight);
                    resolve();
                }
            })
        }

        const filename =
            chartName && chartName.trim() !== ""
                ? `${chartName}.pdf`
                : "chart.pdf";

        doc.save(filename);
    }
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
    <div class="secondLine">
        <button onclick={downloadPDF} style="margin: 5px 0;">Download chosen charts</button>
        {#if allChecked}
            <button onclick={() => toggleSelected(false)}>Unselect all</button>
        {:else}
            <button onclick={() => toggleSelected(true)}>Select all</button>
        {/if}
    </div>
    <div>
        {#each chartsData as data, i}
            <div>
                <Chart {data} {chartMade} {checkSelected} bind:this={storeChildComponents[i]} />
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
