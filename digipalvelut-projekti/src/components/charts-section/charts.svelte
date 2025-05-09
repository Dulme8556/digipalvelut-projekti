<script>
    import { getContext, onMount } from "svelte";
    import { jsPDF } from "jspdf";

    import Chart from "./chart.svelte";
    import Line from "./chart-config/line.js";
    import Pie from "./chart-config/pie-doughnut";

    let lists = getContext("list");
    let selected = lists.selectedValues;

    let addInfo = false;

    let chartsData = [];
    $: chartId = lists.charts.length
        ? Math.max(...lists.charts.map((t) => t.id)) + 1
        : 1;

    let chartName = "";
    let indexAxis = "";
    let chartUnit = "";

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

    let downloadOptionsVisible = false;

    let searchQuery = "";

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
                        chartUnit: element.unit,
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
        datasetDataEnd = [...datasetDataEnd, element.result];
        datasetDataTarget = [...datasetDataTarget, element.expected];
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
            unit: chartUnit,
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
        if (selected.length === 0) {
            alert('Error: No indicators selected. \nIf otherwise pressing the "Save" button may fix this issue.');
            return;
        }
        
        let datasetDataResult = selected.map((item) => item.result);
        let datasetDataExpected = selected.map((item) => item.expected);
        let datasetDataStart = selected.map((item) => item.start);
        let labels = selected.map((item) => item.name);
        let datasetUnit = selected.map((item) => item.unit);
        let datasetCustomFields = selected.map((item) => item.customFields)

        let customFieldsDataset = [];
        let customColors = [
            "#FF9999", "#99CCFF", "#CCFF99", "#FFCC99", "#D9B3FF", "#B3FFFF"
        ];

        
        const { type, axis } = getTrimmedChartType();

        let chartData = {
            id: chartId,
            check: false,
            title: chartName,
            type: type,
            labels: labels,
            unit: datasetUnit,
            indexAxis: axis,
            datasets: [],
            addInfo: addInfo, // Pass the addInfo flag here
        };

        // Create datasets based on chart type
        if (type === "doughnut" || type === "pie") {
            let pie = new Pie();
            pie.changeData(datasetDataStart, datasetDataResult, datasetDataExpected, datasetUnit, labels, datasetCustomFields);
            chartData.datasets = pie.getData();
        } else if (type === "line") {
            let line = new Line();
            line.changeData(datasetDataStart, datasetDataResult, datasetDataExpected, datasetUnit, labels, datasetCustomFields);
            chartData.datasets = JSON.parse(JSON.stringify(line.getData())).datasets;
            chartData.labels = JSON.parse(JSON.stringify(line.getData())).labels;
        } else {
            if (!datasetCustomFields.some(item => item == null)) {
                for (let i = 0; i < datasetCustomFields[0].length; i++) {
                    customFieldsDataset.push({
                        label: datasetCustomFields[0][i].title,
                        data: [datasetCustomFields[0][i].value],
                        backgroundColor: customColors[i % customColors.length],
                        unit:datasetUnit,
                        minBarLength: 4
                    })
                }
            }
            chartData.datasets = [...chartData.datasets,
                {
                    label: "start",
                    data: datasetDataStart,
                    backgroundColor: "#FFCE56",
                    unit: datasetUnit,
                    minBarLength: 4,
                },
                ...customFieldsDataset,
                {
                    label: "end",
                    data: datasetDataResult,
                    backgroundColor: "#36A2EB",
                    unit: datasetUnit,
                    minBarLength: 4,
                },
                {
                    label: "target",
                    data: datasetDataExpected,
                    backgroundColor: "#FF6384",
                    unit: datasetUnit,
                    minBarLength: 4,
                },
            ];
        }

        listOfChartData = [chartData];
        listOfChartData.forEach((element) => generateCharts(element));
        lists.charts = [...lists.charts, chartData];
    }

    function loadOldCharts() {
        listOfChartData.forEach((element) => {
            generateCharts(element);
        });
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

        chartName = "";
        indexAxis = "x";

        typeOfChart = "bar (vertical)";
    };

    function toggleSelected(selected) {
        let tempStoreChild = storeChildComponents.filter(
            (item) => item !== null,
        );

        tempStoreChild.forEach((element) => {
            let chartId = element.returnId();
            let currentChart = lists.charts.find((item) => item.id === chartId);

            if (selected) {
                element.checkAll();
                if (currentChart) {
                    currentChart.check = true;
                }
            } else {
                element.uncheckAll();
                if (currentChart) {
                    currentChart.check = false;
                }
            }
        });

        allChecked = selected;
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

        // combine the two lists in a certain way
        while (small.length > 0 || big.length > 0) {
            let counter = 0;

            if (small.length > 0) {
                combined.push(small.shift());
                counter++;
            } else if (big.length > 0) {
                combined.push(big.shift());
                counter++;
            }

            let nextIsSmall = false;
            while (counter < 5 && (small.length > 0 || big.length > 0)) {
                if (nextIsSmall && small.length > 0) {
                    combined.push(small.shift());
                    counter++;
                } else if (!nextIsSmall && big.length > 0) {
                    combined.push(big.shift());
                    counter++;
                } else if (small.length > 0) {
                    combined.push(small.shift());
                    counter++;
                } else if (big.length > 0) {
                    combined.push(big.shift());
                    counter++;
                }

                nextIsSmall = !nextIsSmall;
            }
        }

        // divide the list into pages
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
                [i + 1].type === "doughnut" // should be combined[i+1].type but for some reason it breaks
            ) {
                page++;
                count = 0;
                pieCount = 0;
            }
        }

        return finalList;
    }

    function toggleDownloadOptions() {
        downloadOptionsVisible = !downloadOptionsVisible;
    }

    function hideDownloadOptions() {
        setTimeout(() => {
            downloadOptionsVisible = false;
        }, 100);
    }

    async function downloadPDF() {
        downloadOptionsVisible = false;

        let x = 0;
        let y = 0;
        let leftSide = 0;
        let rightSide = 110;
        let leftY = 0;
        let rightY = 20;

        let imgScaling = 0.26;
        let imageWidth = 400;
        let smallImageHeight = 200;
        let BigImageHeight = 400;
        let marginOfError = 5;

        let leftSpacing = 60;
        let rightSpacing = 140;

        let doc;

        // wait that the searchQuery is cleared so all charts are shown
        await new Promise((resolve) => {
            searchQuery = "";
            resolve();
        });

        storeChartData();
        let sortedChartList = sortCanvases();

        if (storeCanvases.length === 0) {
            alert("No charts selected");
            return;
        }

        doc = new jsPDF("p", "mm");
        let pageKeys = Object.keys(sortedChartList);

        for (let i = 0; i < pageKeys.length; i++) {
            let page = pageKeys[i];
            let chartSet = sortedChartList[page];

            leftY = 0;
            rightY = 20;
            
            for (let j = 0; j < chartSet.length; j++) {
                let canvas = chartSet[j];
                let width = canvas.width;
                let height = canvas.height;
                let imgURL = canvas.toDataURL("image/png");
                
                // image size supposed to be 200x400 or 400x400
                // make sure sizes are divisible by 200 and account for 600
                if (height % 200 !== 0 || height % 300 === 0) {
                    if (Math.abs(height - width / 2) <= marginOfError) {
                        width = imageWidth;
                        height = smallImageHeight;
                    } else  if (height === width) {
                        width = imageWidth;
                        height = BigImageHeight;
                    } else {
                        console.error("Error: Something went wrong while calculating charts sizes")
                    }
                }

                if (height === width / 2) {
                    x = leftSide;
                    y = leftY;
                    leftY += leftSpacing;
                } else {
                    x = rightSide;
                    y = rightY;
                    leftY += leftSpacing;
                    rightY += rightSpacing;
                }
                doc.addImage(
                    imgURL,
                    "PNG",
                    x,
                    y,
                    width * imgScaling,
                    height * imgScaling,
                );
            }

            if (i < pageKeys.length - 1) {
                doc.addPage();
            }
        }

        const filename = "chart.pdf";
        doc.save(filename);
    }

    async function downloadIMG() {
        downloadOptionsVisible = false;

        await new Promise((resolve) => {
            searchQuery = "";
            resolve();
        });

        storeChartData();

        if (storeCanvases.length === 0) {
            alert("No charts selected");
            return;
        }

        for (let i = 0; i < storeCanvases.length; i++) {
            const canvas = storeCanvases[i];
            const ctx = canvas.getContext("2d");

            // Tekee temporary canvasin että ei joudu muokkaamaan alkuperästä
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.fillStyle = "#FFFFFF";
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);

            const imageType = "image/jpeg";
            const imgData = tempCanvas.toDataURL(imageType);
            const link = document.createElement("a");
            link.href = imgData;
            link.download = `chart-${i + 1}.jpg`;
            link.click();
        }
    }

    async function download1PerPage() {
        downloadOptionsVisible = false;

        // wait that the searchQuery is cleared so all charts are shown
        await new Promise((resolve) => {
            searchQuery = "";
            resolve();
        });

        storeChartData();

        if (storeCanvases.length === 0) {
            alert("No charts selected");
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

        doc.save("charts.pdf");
    }

    $: filteredCharts = JSON.parse(
        JSON.stringify(
            lists.charts.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        ),
    );

    let showOptions = false;

    function toggleExtraOptions() {
        showOptions = !showOptions;
    }
</script>

<div class="chartsSection">
    <div class="toolbar">
        <div style="display:flex;">
            <h2 class="title">Active charts</h2>
            <div class="info__wrapper">
                <div class="charts__info__wrapper">
                    <img class="info__icon" alt="info_icon" src="./images/info.png">
                    <div class="info__content">
                        <p><strong>Making</strong>: Before making a chart you can give it a name, 
                            choose the type of chart 
                            and choose if you want to display the exact values on the chart.</p>
                        <p><strong>Seaching</strong>: The charts can be search by their name. </p>
                        <p><strong>Downloading</strong>: There are three download options, 
                            two for pdf and one to download each chart as a separate JPG file.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="firstLine">
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
            <div
                style="position:relative; display:flex; flex-direction:column; align-items:center;"
            >
                {#if !showOptions}
                    <div class="extraOptionsToggle" onclick={toggleExtraOptions}>
                        &#x25BC; <!-- Down arrow icon -->
                    </div>
                {:else}
                    <div class="extraOptionsToggle" onclick={toggleExtraOptions}>
                        &#x25b2; <!-- Up arrow icon -->
                    </div>
                {/if}

                {#if showOptions}
                    <div class="dropdownOptions">
                        <label for="addInfo">
                            <input
                                type="checkbox"
                                id="addInfo"
                                class="addInfoCheckbox"
                                bind:checked={addInfo}
                            />
                            Show exact values
                        </label>
                    </div>
                {/if}
            </div>
            <div class="chartButton">
                <button class="chartButton__button" onclick={createNewChart}>
                    Create a chart
                </button>
            </div>
            <div class="info__wrapper">
                <div class="charts__info__wrapper">
                    <img class="createChart__info__icon" alt="info_icon" src="./images/info.png">
                    <div class="createChart__info__content">
                        <p><strong>Info about different types of charts.</strong></p>
                        <p><strong>Pie</strong>: If pie chart receives multiple indicator
                            it compares their end values. If single indicator is given
                            it compare all of it's data (start, result, expected).</p>
                        <p><strong>Line</strong>: Ability for adding more point was requested. In progress</p>
                    </div>
                </div>
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
                <button
                    class="toggleButton"
                    onclick={() => toggleSelected(false)}
                >
                    Unselect all
                </button>
            {:else}
                <button
                    class="toggleButton"
                    onclick={() => toggleSelected(true)}
                >
                    Select all
                </button>
            {/if}
        </div>
        <div class="thirdLine">
            <div class="downloadButtons" onfocusout={hideDownloadOptions}>
                <button onclick={toggleDownloadOptions} class="showSpanButton">
                    Download
                </button>
                <span
                    class={downloadOptionsVisible
                        ? "showOptions"
                        : "hideOptions"}
                >
                    <button onclick={downloadPDF} class="downloadButton">
                        Download chosen charts (pdf)
                    </button>
                    <button onclick={download1PerPage} class="downloadButton">
                        Download 1 chart per page (pdf)
                    </button>
                    <button onclick={downloadIMG} class="downloadButton">
                        Download charts images
                    </button>
                </span>
            </div>
        </div>
    </div>
    {#key filteredCharts}
        <div class="chartList">
            {#each filteredCharts as data, i}
                <div>
                    <Chart
                        {data}
                        {checkSelected}
                        bind:this={storeChildComponents[i]}
                    />
                </div>
            {/each}
        </div>
    {/key}
</div>

<style>
    .info__wrapper{
        position:relative;
        display:inline-block;
    }

    .charts__info__wrapper{
        position:relative;
        display:inline-block;
    }

    .charts__info__wrapper:hover .info__content {
        visibility:visible;
        opacity: 1;
    }

    .info__icon{
        width:28px;
        height:28px;
        padding-top:5px;
        margin-left:10px;
    }

    .createChart__info__icon {
        width:20px;
        padding-top:12px;
        margin-left:10px;
    }

    .info__content, .createChart__info__content {
        visibility: hidden;
        opacity: 0;
        width: 320px;
        background-color: #f9f9f9;
        color: #000;
        text-align: left;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 8px;
        position: absolute;
        z-index: 1;
        top: 50px;
        left: -20px;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease;
    }

    .createChart__info__content {
        left: -300px;
    }

    .info__wrapper:hover .info__content {
        visibility:visible;
        opacity: 1;
    }

    .info__wrapper:hover .createChart__info__content {
        visibility:visible;
        opacity: 1;
    }

    .addInfoCheckbox {
        cursor: pointer;
    }

    .chartsSection {
        min-width: 470px;
    }

    .extraOptionsToggle {
        cursor: pointer;
        font-size: 16px;
        padding: 4px;
        margin-left: 4px;
        margin-right: 4px;
        padding-top: 7px;
        user-select: none;
    }

    .dropdownOptions {
        position: absolute;
        top: 35px;
        left: 0;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 5px 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        z-index: 10;
        white-space: nowrap;
    }
    
    .title {
        margin-bottom: 5px;
        margin: 0;
    }
    
    .toolbar {
        border: 2px solid #b4b4b4;
        border-radius: 10px;
        padding: 10px 15px;
    }

    .firstLine {
        display: flex;
        flex-direction: row;
    }

    .selectList {
        width: 120px;
        max-height: 21px;
        margin-top: 12px;
        margin-left: 10px;
        cursor: pointer;
    }

    .chartName {
        margin-top: 10px;
        width: auto;
    }

    .chartButton {
        width: auto;
        height: auto;
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

    .showSpanButton {
        margin: 5px 0;
        margin-right: 5px;
        padding: 6px 3px;
        cursor: pointer;
    }

    .showOptions {
        display: flex;
        background-color: #dadada;
        border: 1px solid gray;
        margin: 5px 0;
        width: 355px;
    }

    .hideOptions {
        display: none;
    }

    .downloadButton {
        margin: 5px 5px;
        font-size:12px;
        border: 1px solid #000000;
        border-radius: 5px;
        cursor: pointer;
    }

    .toggleButton {
        margin-top: 5px;
        margin-left: 10px;
        height: 20px;
        cursor: pointer;
    }

    .chartList {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
