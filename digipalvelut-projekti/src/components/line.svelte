<script>
    import { createEventDispatcher, getContext } from "svelte";

    let { id, name, target, start, end, unit } = $props();

    let lists = getContext('list')

    // calculate percents
    let percent = "placeholder";

    if (end != '' && target != '') {
        let rawValue = end/target*100;
        percent = rawValue.toFixed(0);
    }

    // let array = [];

    // function deleteThis(tämä) {
    //     // lists.list.forEach(element => {
    //     //     if (element.id === id) {
    //             lists.list = lists.list.filter((t) => t.id !== tämä.id);
    //         // }
    //         // else {
    //         //     console.log("different id")
    //         // }
    //     // });
    //     console.log(array)
    // }

    const dispatch = createEventDispatcher();

    function onRemove() {
        dispatch("remove", line);
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
    <button class="delete" onclick={onRemove}><img src="./images/delete-icon.svg" class="image" alt=""></button>
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

    .delete {
        display: flex;
        align-items: center;
        align-self: center;
        justify-content: center;
        width: 30px;
        height: 30px;
    }

    .image {
        width: 20px;
        height: 20px;
    }
</style>
