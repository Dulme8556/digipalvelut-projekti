<script>
  import { getContext, onMount } from "svelte";
  import Chart from "./Chart.svelte"; // Import the Chart component

  let chartsData = [];
  let chartId = 0;

  let lists = getContext("list");
  let selected = lists.selectedValues;

  let chartName = ""; // Chart name
  let chartNames = []; // Array to hold chart names
  let chartMade = false;
  
  let datasetDataEnd = [];
  let datasetDataTarget = [];
  let datasetDataStart = [];
  let labels = "";
  
  let typeOfChart = "bar";
  let chartTypes = [
    "bar",
    "line",
    "pie",
    "bubble",
    "doughnut",
    "polarArea",
    "radar",
    "scatter",
  ];

  onMount(() => {
    // Add any initialization logic here if necessary
  });

  // Convert selected data into arrays for chart generation
  selected.forEach((element) => {
    datasetDataEnd = [...datasetDataEnd, element.end];
    datasetDataTarget = [...datasetDataTarget, element.target];
    datasetDataStart = [...datasetDataStart, element.start];
    labels = [...labels, element.name];
  });

  let listOfCharts = [
    {
      labels: labels,
      data1: {
        label: "start",
        data: datasetDataStart,
        backgroundColor: "yellow",
      },
      data2: {
        label: "end",
        data: datasetDataEnd,
        backgroundColor: "blue",
      },
      data3: {
        label: "target",
        data: datasetDataTarget,
        backgroundColor: "red",
      },
    },
  ];

  const generateCharts = () => {
    if (
      datasetDataEnd.length === 0 ||
      datasetDataTarget.length === 0 ||
      labels.length === 0
    ) {
      alert("Necessary data is missing.");
      return;
    }

    // Add chart data
    chartsData = [
      ...chartsData,
      {
        labels: labels,
        datasets: [
          {
            label: listOfCharts[0].data1.label,
            data: listOfCharts[0].data1.data,
            backgroundColor: listOfCharts[0].data1.backgroundColor,
          },
          {
            label: listOfCharts[0].data2.label,
            data: listOfCharts[0].data2.data,
            backgroundColor: listOfCharts[0].data2.backgroundColor,
          },
          {
            label: listOfCharts[0].data3.label,
            data: listOfCharts[0].data3.data,
            backgroundColor: listOfCharts[0].data3.backgroundColor,
          },
        ],
      },
    ];

    chartId++;
    chartNames = [...chartNames, chartName]; // Save the chart name
    chartName = ""; 

    chartMade = true;
    lists.charts = chartsData;
  };
</script>

<div>
  <div class="toolbar">
    <div class="chartName">
      <input style="width: 120px;" placeholder="Chart Name" bind:value={chartName}>
    </div>
    <select bind:value={typeOfChart} class="selectList">
      {#each chartTypes as s, i}
        <option value={chartTypes[i]}>{chartTypes[i]}</option>
      {/each}
    </select>
    <div class="chartButton">
      <button class="chartButton__button" on:click={generateCharts}>
        Create a chart
      </button>
    </div>
  </div>

  <div>
    {#each chartsData as data, i}
      <div>
        <Chart {data} key={i} {chartMade} chartType={typeOfChart} chartName={chartNames[i]} />
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
    width: 100px;
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
