<script>
  import { getContext, onDestroy, onMount } from "svelte";
  import Chart from "chart.js/auto";
  import { jsPDF } from "jspdf";

  let lists = getContext("list");

  export let data;
  export let chartMade;
  let id;
  let chartName;

  let canvas;
  let chartInstance;
  let chartContainer;

  onMount(() => {
    if (!canvas) {
      return;
    }

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
      },
    });

    // Store the parent container of this chart
    chartContainer = canvas.closest(".chartContainer");
  });

  onDestroy(() => {
    chartInstance?.destroy();
  });

  function deleteChart() {
    if (chartInstance) {
      // Destroy the current chart instance
      chartInstance.destroy();
      chartInstance = null;
      chartMade = false;

      // Remove the parent container of the chart (the div that contains the canvas)
      if (chartContainer) {
        chartContainer.remove();
      }
      // ^^ set OnMount

      lists.charts = lists.charts.filter((item) => item.id !== id);
    }
  }

  function downloadPDF() {
    if (!chartMade || !canvas) {
      console.error("No chart available for download");
      return;
    }

    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    const doc = new jsPDF("l", "mm", [chartWidth, chartHeight]);
    const imgData = canvas.toDataURL("image/png");

    doc.addImage(imgData, "PNG", 0, 0, chartWidth, chartHeight);

    const filename =
      chartName && chartName.trim() !== "" ? `${chartName}.pdf` : "chart.pdf";

    doc.save(filename);
  }
</script>

{#if chartMade}
  <div class="chartContainer">
    <div style="display:flex; justify-content:space-between">
      <div
        class="buttonContainer__chartName"
        style="display:flex; font-size:larger; font-weight:700;">
        {#if chartName == ""}
          <p>*UNNAMED CHART*</p>
        {:else}
          {chartName}
        {/if}
      </div>
      <div class="buttonContainer">
        <button class="pdf-download__button" onclick={downloadPDF}>
          <img
            class="pdf-download__image"
            src="./images/download-icon.svg"
            alt=""
          />
        </button>
        <button class="chart-delete__button" onclick={deleteChart}>
          <img
            class="chart-delete__image"
            src="./images/delete-icon.svg"
            alt=""
          />
        </button>
      </div>
    </div>
    <div id="content" style="width:400px; max-height:300px;">
      <canvas style="width: 400px; max-height:300px;" bind:this={canvas}
      ></canvas>
    </div>
  </div>
{/if}

<style>
  .chartContainer {
    width: 400px;
    margin-bottom: 55px;
  }

  .chartContainer:first-child {
    margin-top: 25px;
  }

  .pdf-download__button {
    display: flex;
    background-color: grey;
    height: 30px;
    width: 30px;
    justify-self: flex-end;
    border: 1px solid black;
    border-radius: 3px;
    padding: 0;
  }

  .pdf-download__button:hover {
    background-color: darkgray;
    cursor: pointer;
  }

  .pdf-download__image {
    display: flex;
    width: 28px;
    height: 27px;
    filter: brightness(0) saturate(100%) invert(96%) sepia(8%) saturate(7%)
      hue-rotate(314deg) brightness(89%) contrast(93%);
  }

  .buttonContainer {
    margin-right: 13px;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
  }

  .chart-delete__button {
    background-color: grey;
    height: 30px;
    width: 30px;
    justify-self: flex-end;
    border: 1px solid black;
    border-radius: 3px;
    padding: 0;
    margin-left: 5px;
  }

  .chart-delete__button:hover {
    background-color: #e74433;
    cursor: pointer;
  }

  .chart-delete__image:hover {
    filter: brightness(0) saturate(100%) invert(59%) sepia(6%) saturate(18%)
      hue-rotate(324deg) brightness(84%) contrast(94%);
  }
</style>
