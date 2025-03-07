<div class="chartContainer">
    <canvas id="myChart" bind:this={chartCanvas}></canvas>
</div>
<script>
	import chartjs from 'chart.js/auto';
	import { onMount } from 'svelte';

	let chartCanvas;
	let chartValues = [20, 10, 5, 2, 20, 30, 45];
	let chartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

	onMount(() => {
		if (chartCanvas) {
			let ctx = chartCanvas.getContext('2d');
			new chartjs(ctx, {
				type: 'line',
				data: {
					labels: chartLabels,
					datasets: [{
						label: 'Revenue',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: chartValues
					}]
				}
			});
		}
	});
</script>

<style>
    .chartContainer{
        width: 400px;
        height: 200px;
    }
</style>