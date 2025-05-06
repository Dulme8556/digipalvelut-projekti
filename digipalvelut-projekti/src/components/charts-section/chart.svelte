<script>
    import { getContext, onDestroy, onMount } from "svelte";
    import Chart from "chart.js/auto";
    import { jsPDF } from "jspdf";
    import ChartDataLabels from "chartjs-plugin-datalabels";

    let lists = getContext("list");

    export let data;
    export let checkSelected;
    let id;
    let chartName;

    let canvas;
    let chartInstance;
    let chartContainer;

    let checked = false;

    onMount(() => {
        if (!canvas) {
            return;
        }

        Chart.register(ChartDataLabels);
        id = data.id;

        if (data.title) {
            chartName = data.title;
        } else {
            chartName = "";
        }

        chartInstance = new Chart(canvas, {
            type: data.type,
            data,
            options: {
                responsive: false,
                maintainAspectRatio: false,
                animations: false,
                indexAxis: data.indexAxis,
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            title: function (context) {
                                if (data.type === "line") {
                                    for (let i = 0; i < data.datasets.length; i++) {
                                        if (context[0].dataset.label === data.datasets[i].label) {
                                            return data.datasets[i].label;
                                        }
                                    }
                                } else {
                                    return context[0].label;
                                }
                            },
                            label: function (context) {
                                if (data.type === "line") {
                                    for (let i = 0; i < data.datasets.length; i++) {
                                        let dataIndex = context.dataIndex;
                                        let dataArray = context.dataset.data;
                                        let values = dataArray[dataIndex];

                                        if (context.dataset.label === data.datasets[i].label) {
                                            return `${data.unit[i]}: ${values}`;
                                        }
                                    }
                                    return "Unit not found";
                                } else {
                                    let dataIndex = context.dataIndex;
                                    let unitArray = context.dataset.unit;
                                    let unit = unitArray[dataIndex];

                                    let dataArray = context.dataset.data;
                                    let values = dataArray[dataIndex];

                                    for (let i = 0; i < data.datasets.length; i++) {
                                        if (context.dataset.label === data.datasets[i].label) {
                                            return `${unit}: ${values}`;
                                        }
                                    }
                                }
                            },

                        },
                    },
                    datalabels: {
                        color: "black",
                        display: data.addInfo,
                        align: "center",
                        formatter: (value) => {
                            value;
                        },
                    },
                },
            },
        });

        // Store the parent container of this chart
        chartContainer = canvas.closest(".chartContainer");

        let currentChart = lists.charts.find((item) => item.id === id);
        if (currentChart) {
            checked = currentChart.check;
        }
    });

    onDestroy(() => {
        chartInstance?.destroy();
    });

    function deleteChart() {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;

            // Remove the parent container of the chart (the div that contains the canvas)
            if (chartContainer) {
                chartContainer.remove();
            }
            // ^^ set OnMount

            lists.charts = lists.charts.filter((item) => item.id !== id);
        }
    }

    function downloadPDF() {
        const ctx = canvas.getContext("2d");

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

        const filename =
            chartName && chartName.trim() !== ""
                ? `${chartName}.jpg`
                : "chart.jpg";

        link.href = imgData;
        link.download = filename;
        link.click();
    }

    function checkboxClick() {
        checked = !checked;

        let currentChart = lists.charts.find((item) => item.id === id);
        if (currentChart) {
            currentChart.check = checked;
        }
        checkSelected();
    }

    export function checkAll() {
        checked = true;
    }
    export function uncheckAll() {
        checked = false;
    }

    // to give needed data to the parent
    export function returnCanvas() {
        return canvas;
    }
    export function returnType() {
        return data.type;
    }
    export function returnCheck() {
        return checked;
    }
    export function returnId() {
        return id;
    }
</script>

<div class="chartContainer">
    <div class="actionBar">
        <div class="chartName">
            <input
                type="checkbox"
                class="CheckBox"
                onclick={checkboxClick}
                {checked}
            />
            {#if chartName == ""}
                <div class="chartTitle">*UNNAMED CHART*</div>
            {:else}
                <div class="chartTitle">{chartName}</div>
            {/if}
        </div>
        <div class="buttonContainer">
            <button
                class="chart-button pdf-download__button"
                onclick={downloadPDF}
            >
                <img
                    class="pdf-download__image"
                    src="./images/download-icon.svg"
                    alt=""
                />
            </button>
            <button
                class="chart-button chart-delete__button"
                onclick={deleteChart}
            >
                <img
                    class="chart-delete__image"
                    src="./images/delete-icon.svg"
                    alt=""
                />
            </button>
        </div>
    </div>
    <div id="content" style="width:400px; max-height:300px;">
        <canvas style="width: 400px; max-height:300px;" bind:this={canvas}>
        </canvas>
    </div>
</div>

<style>
    .chartContainer {
        width: 400px;
        border: 1px rgba(0, 0, 0, 0.4) solid;
        transform: scale(1.1);
        margin-bottom: 10px;
    }

    .actionBar {
        display: flex;
        justify-content: space-between;
        background-color: #d9d9d9;
        border-bottom: 1px rgba(0, 0, 0, 0.3) solid;
    }

    .chartName {
        display: flex;
        font-weight: 700;
    }

    .CheckBox {
        width: 17px;
        margin-right: 5px;
        cursor: pointer;
    }

    .chartTitle {
        margin: 5px 0;
    }

    .chartContainer:first-child {
        margin-top: 25px;
    }

    .chart-button {
        display: flex;
        background-color: grey;
        height: 25px;
        width: 25px;
        justify-self: flex-end;
        border: 1px solid black;
        border-radius: 3px;
        padding: 0;
    }

    .pdf-download__button {
        margin-left: 5px;
    }

    .pdf-download__button:hover {
        background-color: darkgray;
        cursor: pointer;
    }

    .pdf-download__image {
        display: flex;
        width: 24px;
        height: 24px;
        filter: brightness(0) saturate(100%) invert(96%) sepia(8%) saturate(7%)
            hue-rotate(314deg) brightness(89%) contrast(93%);
    }

    .buttonContainer {
        margin-right: 5px;
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
    }

    .chart-delete__button {
        margin-left: 5px;
    }

    .chart-delete__button:hover {
        background-color: #e74433;
        cursor: pointer;
    }

    .chart-delete__image {
        display: flex;
        width: 24px;
        height: 24px;
    }

    .chart-delete__image:hover {
        filter: brightness(0) saturate(100%) invert(59%) sepia(6%) saturate(18%)
            hue-rotate(324deg) brightness(84%) contrast(94%);
    }
</style>
