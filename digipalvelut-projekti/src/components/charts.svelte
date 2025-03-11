<script>
  import { onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  import * as XLSX from "xlsx";

  Chart.register(...registerables);

  let canvas;
  let chartInstance = null;
  let jsonData = [];

  onMount(async () => {
    await loadExcelData();
  });

  async function loadExcelData() {
    try {
      const response = await fetch("/test.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    } catch (error) {
      console.error("Error loading Excel file:", error);
    }
  }

  function createChart() {
    if (!jsonData.length) {
      console.error("No data loaded");
      return;
    }

    const labels = jsonData[0];
    const datasetData = jsonData.slice(1).map(row => row[1]);

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Excel Data",
            data: datasetData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
</script>

<style>
  .chartContainer {
    width: 400px;
    height: 200px;
  }

  .chartButton {
    width: auto;
    height: auto;
    margin-top: 10px;
  }
</style>

<div class="chartButton">
  <button on:click={createChart}>Create a chart</button>
</div>

<div class="chartContainer">
	<canvas bind:this={canvas}></canvas>
</div>