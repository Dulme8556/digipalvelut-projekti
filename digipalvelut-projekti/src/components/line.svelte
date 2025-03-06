<script>
    let { indicator, value1, value2 } = $props();
</script>

<div class="line">
    <div class="component">
        <h2>indicator:</h2>
        <div>{indicator}</div>
    </div>
    <div class="component">
        <h2>value1:</h2>
        <div>{value1}</div>
    </div>
    <div class="component">
        <h2>value2:</h2>
        <div>{value2}</div>
    </div>
</div>

<style>
    .line {
        display: flex;
        flex-direction: row;
    }

    .component {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 20px;
    }
</style>
