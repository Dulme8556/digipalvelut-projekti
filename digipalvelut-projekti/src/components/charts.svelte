<script>
  import { getContext, onMount } from "svelte";
  import { Chart, registerables } from "chart.js";
  import * as XLSX from "xlsx";
  import {jsPDF} from 'jspdf';

  // to get the list with correct values
  let lists = getContext('list')  
  
  function downloadPDF() {
  const chartCanvas = document.querySelector('canvas')

  //check if canvas is actually a canvas
  if (chartCanvas instanceof HTMLCanvasElement) {
    const chartWidth = chartCanvas.width;
    const chartHeight = chartCanvas.height;

    const doc = new jsPDF('l', 'mm', [chartWidth, chartHeight]);

    const imgData = chartCanvas.toDataURL('image/png');

    doc.addImage(imgData, 'PNG', 0, 0, chartWidth, chartHeight);

    // Save the PDF
    doc.save('chart.pdf');
  } else {
    console.error('The chart canvas is not a valid canvas element.');
  }
}
  
  Chart.register(...registerables);
  
  let canvas;
  let chartInstance = null;
  let chartMade = false;
  
  let typeOfChart;
  let chartTypes = ['bar', 'line', 'pie', 'bubble', 'doughnut', 'polarArea', 'radar', 'scatter']
  
  onMount(async () => {
    // await loadExcelData();
  });
  
  function deleteChart() {
    if (chartInstance) {
      chartInstance.destroy();
    }
    chartMade = false;
  }
  
  function createChart() {
    if (chartInstance) {
      chartInstance.destroy();
    }

    let datasetDataEnd = [];
    let datasetDataTarget = [];
    let jsonData = [];
    let labels = "";

  
    let selected = lists.selectedValues;
    chartMade = true;

    jsonData = selected;
    
    if (!jsonData.length) {
      console.error("No data loaded");
      return;
    }

    // all end values to array
    selected.forEach(element => {
      datasetDataEnd = [...datasetDataEnd, element.end]
    });
    
    // all target values to array
    selected.forEach(element => {
      datasetDataTarget = [...datasetDataTarget, element.target]
    });

    selected.forEach(element => {
      labels = [...labels, element.name]
    });
    
        
    chartInstance = new Chart(canvas, {
      type: typeOfChart,
      data: {
        labels: labels,
        datasets: [
          {
            label: 'target',
            backgroundColor: 'red',
            data: datasetDataTarget,
          },
          {
            label: 'end',
            backgroundColor: "blue",
            data: datasetDataEnd,
          },
        ],
      },
      options: {
        responsive: true,
      },
      scales: {
         xAxes: [{
            stacked: true,
         }],
         yAxes: [{
            stacked: true,
         }]
      }
    });
  }
</script>

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

  .chartButton__button:hover {
    cursor: pointer;
  }

  .pdf-download__button {
    display: flex; 
    background-color: grey; 
    height: 30px; 
    width: 30px; 
    justify-self: flex-end; 
    border: 1px solid black; 
    border-radius: 3px; 
    padding:0
  }

  .pdf-download__button:hover {
    background-color: darkgray;
    cursor: pointer;
  }

  .pdf-download__image {
    display:flex;
    width: 28px;
    height: 27px;
    filter: brightness(0) saturate(100%) invert(96%) sepia(8%) saturate(7%)
            hue-rotate(314deg) brightness(89%) contrast(93%);
    }

    .buttonContainer {
      margin-right:13px;
      display: flex;
      flex-direction: row;
      justify-content: end;
    }

    .chart-delete__button {
      background-color: grey;
      height: 30px;
      width:  30px;
      justify-self:flex-end;
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
        filter: brightness(0) saturate(100%) invert(73%) sepia(100%)
            saturate(4%) hue-rotate(8deg) brightness(92%) contrast(87%);
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
  <div class='buttonContainer'>
    <button class='pdf-download__button' id='pdf-download__button' onclick={downloadPDF} style={ chartMade ? 'display:flex;' : 'display:none'}>
      <img class="pdf-download__image" src="./images/download-icon.svg" alt="" />
    </button>
    <button class="chart-delete__button" onclick={deleteChart} style={chartMade ? 'display: flex;' : 'display: none;'}>
      <img class="chart-delete__image" src="./images/delete-icon.svg" alt="" />
    </button>
  </div>
	<div id='content'>
    <canvas bind:this={canvas}></canvas>
  </div>
</div>
