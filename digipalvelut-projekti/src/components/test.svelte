<script>
  // this is a test file for charts
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js';

  let chart;

  onMount(() => {
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56],
          borderColor: 'rgb(75, 192, 192)',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            }
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  });
</script>

<canvas id="myChart" width="400" height="200"></canvas>
