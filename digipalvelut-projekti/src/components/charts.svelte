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
    let storeTypes = [];
    let allChecked = false;

    let searchQuery = "";

    onMount(async () => {
        let filteredCharts = lists.charts;
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
            check: false,
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
        let tempStoreChild = storeChildComponents.filter(
            (item) => item !== null,
        );

        if (selected) {
            tempStoreChild.forEach((element) => {
                element.checkAll();
                let currentChart = lists.charts.find(
                    (item) => item.id === element.returnId(),
                );
                if (currentChart) {
                    currentChart.check = true;
                    element.check = true;
                }
            });
            allChecked = true;
        } else {
            tempStoreChild.forEach((element) => {
                element.uncheckAll();
                let currentChart = lists.charts.find(
                    (item) => item.id === element.returnId(),
                );
                if (currentChart) {
                    currentChart.check = false;
                    element.check = false;
                }
            });
            allChecked = false;
        }
    }

    function checkSelected() {
        let tempStoreChild = storeChildComponents.filter(
            (item) => item !== null,
        );

        let count = 0;
        tempStoreChild.forEach((element) => {
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
        storeTypes = [];

        storeChildComponents.forEach((element) => {
            if (element.returnCheck()) {
                storeCanvases.push(element.returnCanvas());
                storeTypes.push(element.returnType());
            }
        });
    }

    function sortCanvases() {
        let everyOtherList = [];
        let small = [];
        let big = [];

        // separate bigger charts (pie and doughnut) from smaller ones
        for (let i = 0; i < storeCanvases.length; i++) {
            let type = storeTypes[i];
            let canvas = storeCanvases[i];
            let item = { canvas, type };

            if (type === "pie" || type === "doughnut") {
                big.push(item);
            } else {
                small.push(item);
            }
        }

        let combined = [];

        while (small.length > 0 || big.length > 0) {
            let counter = 0;

            if (small.length > 0) {
                combined.push(small.shift());
                counter++;
            } else if (big.length > 0) {
                combined.push(big.shift());
                counter++;
            }

            let nextIsNarrow = false;
            while (counter < 5 && (small.length > 0 || big.length > 0)) {
                if (nextIsNarrow && small.length > 0) {
                    combined.push(small.shift());
                    counter++;
                } else if (!nextIsNarrow && big.length > 0) {
                    combined.push(big.shift());
                    counter++;
                } else if (small.length > 0) {
                    combined.push(small.shift());
                    counter++;
                } else if (big.length > 0) {
                    combined.push(big.shift());
                    counter++;
                }

                nextIsNarrow = !nextIsNarrow;
            }
        }

        let page = 1;
        let count = 0;
        let pieCount = 0;
        let finalList = {};

        for (let i = 0; i < storeCanvases.length; i++) {
            if (!finalList[`page${page}`]) {
                finalList[`page${page}`] = [];
            }
            finalList[`page${page}`].push(combined[i].canvas);
            count++;

            if (combined[i].type === "pie" || combined[i].type === "doughnut") {
                pieCount++;
            }
            if (
                count === 5 ||
                (pieCount === 2 && combined[i + 1].type === "pie") ||
                [i].type === "doughnut"
            ) {
                page++;
                count = 0;
                pieCount = 0;
            }
        }
        return finalList;
    }

    async function downloadPDF() {
        let x = 0;
        let y = 0;
        let leftSide = 0;
        let rightSide = 110;
        let leftY = 0;
        let rightY = 20;

        let doc;

        // wait that the searchQueary is cleared so all charts are shown
        await new Promise((resolve) => {
            searchQuery = "";
            resolve();
        });

        storeChartData();
        let sortedChartList = sortCanvases();

        if (sortedChartList.length === 0) {
            alert("No selected charts");
            return;
        }

        doc = new jsPDF("p", "mm");

        let pageKeys = Object.keys(sortedChartList);

        // for (let page in sortedChartList) {
        for (let i = 0; i < pageKeys.length; i++) {
            let page = pageKeys[i];
            let chartSet = sortedChartList[page];

            leftY = 0;
            rightY = 20;

            for (let i = 0; i < chartSet.length; i++) {
                const img = new Image();
                const imgURL = chartSet[i].toDataURL("image/png");
                img.src = imgURL;

                const { height } = await new Promise((resolve) => {
                    img.onload = () => {
                        resolve({ height: img.height });
                    };
                });

                if (height === 200) {
                    x = leftSide;
                    y = leftY;
                    leftY += 60;
                } else {
                    x = rightSide;
                    y = rightY;
                    leftY += 60;
                    rightY += 140;
                }
                doc.addImage(imgURL, "PNG", x, y);
            }

            if (i < pageKeys.length - 1) {
                doc.addPage();
            }
        }

        const filename = "chart.pdf";
        doc.save(filename);
    }

    async function download1PerPage() {
        storeChartData();

        if (storeCanvases.length === 0) {
            alert("No selected charts");
            return;
        }

        let first = storeCanvases[0];
        const doc = new jsPDF("l", "px", [first.width, first.height]);

        for (let i = 0; i < storeCanvases.length; i++) {
            let width = storeCanvases[i].width;
            let height = storeCanvases[i].height;
            const imgData = storeCanvases[i].toDataURL("image/png");

            if (i > 0) {
                doc.addPage([width, height], "l");
            }

            doc.addImage(imgData, "PNG", 0, 0, width, height);
        }

        doc.save("chart.pdf");
    }

    $: filteredCharts = JSON.parse(
        JSON.stringify(
            lists.charts.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        ),
    );
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
        <input
            type="search"
            style="margin-top: 5px;"
            placeholder="Search..."
            bind:value={searchQuery}
        />
        {#if allChecked}
            <button class="toggleButton" onclick={() => toggleSelected(false)}>Unselect all</button>
        {:else}
            <button class="toggleButton" onclick={() => toggleSelected(true)}>Select all</button>
        {/if}
    </div>
    <div class="thirdLine">
        <!-- the 2 buttons should be done in a way that there is only 1 button -->
        <div class="downloadButtons">
            <button class="first_downloadButton" onclick={downloadPDF} style="margin: 5px 0; margin-right: 5px;">
                Download chosen charts
            </button>
            <button onclick={download1PerPage} style="margin: 5px 0;">
                Download 1 chart per page
            </button>
        </div>
    </div>
    {#key filteredCharts}
        <div>
            {#each filteredCharts as data, i}
                <div>
                    <Chart
                        {data}
                        {chartMade}
                        {checkSelected}
                        bind:this={storeChildComponents[i]}
                    />
                </div>
            {/each}
        </div>
    {/key}
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

    .secondLine {
        display: flex;
        flex-direction: row;
    }

    .downloadButtons {
        display: flex;
        flex-direction: row;
    }

    .toggleButton {
        margin-top: 5px;
        margin-left: 10px;
        height: 20px;
    }
</style>
