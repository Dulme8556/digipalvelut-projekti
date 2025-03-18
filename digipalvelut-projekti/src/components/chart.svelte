<script>
  import { onDestroy, onMount } from "svelte";
  import Chart from "chart.js/auto";
  import { jsPDF } from "jspdf";

  export let data;
  export let chartType;
  export let chartMade;

  let canvas;
  let chartInstance;

  onMount(() => {
    if (!canvas) return;

    chartInstance = new Chart(canvas, {
      type: chartType,
      data,
      options: { responsive: true }
    });
  });

  onDestroy(() => {
    chartInstance?.destroy();
  });

  function deleteChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
      chartMade = false;
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
    doc.save("chart.pdf");
  }
</script>

<div class="chartContainer">
  <div class="buttonContainer">
    {#if chartMade}
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
      <div id="content">
        <canvas bind:this={canvas}></canvas>
      </div>
    {/if}
  </div>

</div>

<style>
  .chartContainer {
    width: 400px;
    height: 200px;
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
</style>
