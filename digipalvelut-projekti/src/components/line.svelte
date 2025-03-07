<script>
    let { name, target, start, end, unit } = $props();

    let percent = "placeholder";

    if (end != '' && target != '') {
        let rawValue = end/target*100;
        percent = rawValue.toFixed(0);
    }
</script>

<div class="line">
    <div class="component long">
        <h3>indicator:</h3>
        <div>{name}</div>
    </div>
    <div class="component">
        <h3>target:</h3>
        <div>{target}</div>
    </div>
    <div class="component">
        <h3>start:</h3>
        <div>{start}</div>
    </div>
    <div class="component">
        <h3>end:</h3>
        <div>{end}</div>
    </div>
    <div class="component">
        <h3>percent:</h3>
        {#if percent !== "placeholder"}
            <div>{percent}%</div>
        {/if}
    </div>
    <div class="component long">
        <h3>unit:</h3>
        <div>{unit}</div>
    </div>
</div>

<style>
    h3 {
        padding-right: 10px;
    }

    .line {
        display: flex;
        flex-direction: row;
        max-width: 1400px;
        margin: 0 10px;
        font-size: 15px;
    }

    .component {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;
    }

    .long {
        display: flex;
        flex: 2;
    }
</style>
