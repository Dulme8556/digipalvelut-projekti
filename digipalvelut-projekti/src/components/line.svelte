<script>
    import { getContext, onMount } from "svelte";

    let {
        function: parentFunction,
        update: updateEditedValues,
        id,
        check,
        name,
        target,
        start,
        end,
        percent = "placeholder",
        unit,
    } = $props();

    let lists = getContext("list");

    let editing = $state(false);
    let checked = $state(check);
    
    onMount(() => {
        let indicator = lists.list.find((item) => item.id === id);
        if (indicator) {
            checked = indicator.check;
        }
    });
    
    export function checkAll() {
        checked = true;
    }
    
    export function uncheckAll() {
        checked = false;
    }
    
    export function selected() {
        return checked;
    }
    
    export function values() {
        return {
            id: id,
            check: check,
            name: name,
            target: target,
            start: start,
            end: end,
            unit: unit,
        };
    }
    
    function checkboxClick(event) {
        checked = !checked;

        let indicator = lists.list.find((item) => item.id === id);
        if (indicator) {
            indicator.check = checked;
        }

        setTimeout(() => (event.target.checked = checked), 0);
        parentFunction();
    }

    function percentCalculation() {
        if (!end || !target) return;

        let rawValue = (end / target) * 100;
        let roundedValue = rawValue.toFixed(0);
        let preciseValue = rawValue.toFixed(3);

        percent = preciseValue % 1 !== 0 ? `~${roundedValue}` : roundedValue;
    }

    function deleteThis() {
        lists.list = lists.list.filter((item) => item.id !== id);
        lists.selectedValues = lists.selectedValues.filter(
            (item) => item.id !== id,
        );
    }

    function editThis() {
        editing = !editing;
    }

    function onSave(event) {
        editing = !editing;
        
        percentCalculation();

        lists.list.forEach((element) => {
            if (element.id === id) {
                element.check = checked;
                element.name = name;
                element.target = target;
                element.start = start;
                element.end = end;
                element.percent = percent;
                element.unit = unit;
            }
        });
        updateEditedValues();
    }
</script>

<div>
    <!-- editing on -->
    {#if editing}
        <div class="line">
            <div class="component long">
                <h3>indicator:</h3>
                <input
                    class="input input__long"
                    type="text"
                    bind:value={name}
                />
            </div>
            <div class="component">
                <h3>target:</h3>
                <input class="input" type="text" bind:value={target} />
            </div>
            <div class="component">
                <h3>start:</h3>
                <input class="input" type="text" bind:value={start} />
            </div>
            <div class="component">
                <h3>end:</h3>
                <input class="input" type="text" bind:value={end} />
            </div>
            <div class="component">
                <h3>percent:</h3>
            </div>
            <div class="component long">
                <h3>unit:</h3>
                <input
                    class="input input__long"
                    type="text"
                    bind:value={unit}
                />
            </div>
            <button class="button button__save" onclick={onSave}>Save</button>
        </div>
        <!-- editing off -->
    {:else}
        <div class="line">
            <div class="data__container">
                <input
                    class="checkbox"
                    type="checkbox"
                    {checked}
                    onclick={checkboxClick}
                />
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
            <div class="button__container">
                <button class="button button__edit" onclick={editThis}>
                    <img
                        src="./images/edit-icon.svg"
                        class="image image__edit"
                        alt=""
                    />
                </button>
                <button class="button button__delete" onclick={deleteThis}>
                    <img
                        src="./images/delete-icon.svg"
                        class="image image__delete"
                        alt=""
                    />
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    h3 {
        padding-right: 10px;
    }

    .line {
        display: flex;
        flex-direction: row;
        max-width: 1400px;
        min-width: 850px;
        font-size: 15px;
        padding-top: 10px;
    }

    .component {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 10px;
        flex: 1;
    }

    .data__container {
        display: flex;
        flex-direction: row;
        flex: 1;
    }

    .button__container {
        display: flex;
        flex-direction: row;
    }

    .long {
        display: flex;
        flex: 2.5;
    }

    .checkbox {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin: 0 8px;
        margin-top: 20px;
    }

    .button {
        display: flex;
        align-items: center;
        align-self: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border: 0px;
        margin: 1px;
        background-color: #c7c7c7;
    }

    .button:hover {
        background-color: #e3e3e3;
        border: 1px gray solid;
        cursor: pointer;
    }

    .image {
        padding: 3px;
    }

    .button__delete:hover {
        background-color: #e74433;
    }

    .image__delete:hover {
        filter: brightness(0) saturate(100%) invert(73%) sepia(100%)
            saturate(4%) hue-rotate(8deg) brightness(92%) contrast(87%);
    }

    .image__edit {
        filter: brightness(0) saturate(100%) invert(17%) sepia(8%) saturate(21%)
            hue-rotate(359deg) brightness(100%) contrast(83%);
    }

    .input {
        border: #575757 solid 1px;
        border-radius: 5px;
        font-size: 14px;
        padding: 3px 5px;
        color: black;
        width: 50px;
    }

    .input__long {
        width: 140px;
    }

    .button__save {
        width: 40px;
    }
</style>
