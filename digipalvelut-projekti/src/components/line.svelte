<script>
    let { name, target, start, end, unit } = $props();

    let percent = "placeholder";

    if (end != '' && target != '') {
        let rawValue = end/target*100;
        percent = rawValue.toFixed(1);
    }
</script>

<div class="line">
    <div class="component">
        <h2>indicator:</h2>
        <div>{name}</div>
    </div>
    <div class="component">
        <h2>target:</h2>
        <div>{target}</div>
    </div>
    <div class="component">
        <h2>start:</h2>
        <div>{start}</div>
    </div>
    <div class="component">
        <h2>end:</h2>
        <div>{end}</div>
    </div>
    <div class="component">
        <h2>percent:</h2>
        {#if percent !== "placeholder"}
            <div>{percent}%</div>
        {/if}
    </div>
    <div class="component">
        <h2>unit:</h2>
        <div>{unit}</div>
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
