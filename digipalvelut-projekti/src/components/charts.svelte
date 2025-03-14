<script>
  import { getContext, onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  import * as XLSX from "xlsx";
  import {jsPDF} from 'jspdf';

  // to get the list with correct values
  let lists = getContext('list')  
  
  function downloadPDF(){
    const chartCanvas = document.getElementById('content');
    const chartWidth = chartCanvas ? chartCanvas.offsetWidth : 400;
    const chartHeight = chartCanvas ? chartCanvas.offsetHeight : 400;
    const doc = new jsPDF('l', 'mm', [chartWidth, chartHeight+0.1]);
    doc.html(document.getElementById('content'), {
      callback: function (doc) {
        doc.save("chart.pdf")
      },
    });
  }
  
  Chart.register(...registerables);
  
  let canvas;
  let chartInstance = null;
  let jsonData = [];

  let typeOfChart;
  let chartTypes = ['bar', 'line', 'pie', 'bubble', 'doughnut', 'polarArea', 'radar', 'scatter']
  
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
    // when the button is clicked it gets the selected values
    // these are the values that the chart is made out of
    let selected = lists.selectedValues
    
    if (!jsonData.length) {
      console.error("No data loaded");
      return;
    }

    const labels = jsonData[0];
    const datasetData = jsonData.slice(1).map(row => row[1]);

    if (chartInstance) {
      chartInstance.destroy();
    }

    
    const button = document.getElementById('pdf-download__button');

    button.setAttribute('style', 'display: flex; background-color:grey; height:30px; width:30px; justify-self:flex-end; border: 1px solid black; border-radius: 3px; padding:0;');

    button.onmouseover = function() {
        button.style.backgroundColor = 'darkgrey';
        button.style.cursor = 'pointer'
    };

    button.onmouseout = function() {
        button.style.backgroundColor = 'grey';
    };
    // ^^ pdf download button css

    chartInstance = new Chart(canvas, {
      type: typeOfChart,
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
  .toolbar {
    display: flex;
    flex-direction: row;
  }

  .selectList {
    width: 50px;
    margin-top: 12px;
    margin-left: 10px;
  }

  .chartContainer {
    width: 400px;
    height: 200px;
  }

  .chartButton {
    width: auto;
    height: auto;
    margin-top: 10px;
  }

  .chartButton__button:hover {
    cursor: pointer;
  }

  .pdf-download__image {
    display:flex;
    width: 28px;
    height: 27px;
    filter: brightness(0) saturate(100%) invert(96%) sepia(8%) saturate(7%)
            hue-rotate(314deg) brightness(89%) contrast(93%);
    }

    .pdf-download{
      margin-right:13px;
    }

</style>

<div class="toolbar">
  <div class="chartButton">
    <button class="chartButton__button" onclick={createChart}>Create a chart</button>
  </div>
  <select bind:value={typeOfChart} class="selectList">
    {#each chartTypes as s, i}
        <option value={chartTypes[i]}> {chartTypes[i]}</option>
    {/each}
  </select>
</div>

<div class="chartContainer">
  <div class='pdf-download' style='margin-right: 13px;'>
  <button id='pdf-download__button' onclick={downloadPDF} style='display:none;'>
    <img class="pdf-download__image" src="./images/download-icon.svg" alt="" />
  </button>
  </div>
	<div id='content'>
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
