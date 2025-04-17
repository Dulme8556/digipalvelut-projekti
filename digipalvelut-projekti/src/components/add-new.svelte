<script>
    import { getContext } from "svelte";
    import FileReader from "./file-reader.svelte";

    let lists = getContext("list");

    let newId = $state("");
    let newName = $state("");
    let newTarget = $state("");
    let newStart = $state("");
    let newEnd = $state("");
    let newPercent;
    let newUnit = $state("");

    function percentCalculation() {
        if (!newEnd || !newTarget) return;

        let rawValue = (newEnd / newTarget) * 100;
        let roundedValue = rawValue.toFixed(0);
        let preciseValue = rawValue.toFixed(3);

        newPercent = preciseValue % 1 !== 0 ? `~${roundedValue}` : roundedValue;
    }

    function addNew() {
        percentCalculation();

        newId = lists.list.length
            ? Math.max(...lists.list.map((t) => t.id)) + 1
            : 1;

        if (newStart === "") {
            newStart = 0;
        }

        if (
            newName === "" &&
            newTarget === "" &&
            newStart === 0 &&
            newEnd === "" &&
            newUnit === ""
        ) {
            alert("Can't add empty");
            newStart = "";
        } else {
            let updatedList = lists.list.map((item) => ({ ...item }));

            updatedList.push({
                id: newId,
                check: false,
                name: newName,
                target: newTarget,
                start: newStart,
                end: newEnd,
                percent: newPercent,
                unit: newUnit,
            });

            lists.list = updatedList;

            newName = "";
            newTarget = "";
            newStart = "";
            newEnd = "";
            newPercent = "";
            newUnit = "";
        }
    }
</script>

<div style="min-width:350px; max-width:350px;">
    <div class="create-dataset">
        <h2 class="create-dataset__title">CREATE A NEW INDICATOR</h2>
        <div class="input__container">
            <input
                class="input"
                type="text"
                placeholder="Name"
                bind:value={newName}
            />
            <input
                class="input input__number"
                type="number"
                placeholder="Target value"
                bind:value={newTarget}
            />
            <input
                class="input input__number"
                type="number"
                placeholder="Start value"
                bind:value={newStart}
            />
            <input
                class="input input__number"
                type="number"
                placeholder="End value"
                bind:value={newEnd}
            />
            <input
                class="input"
                type="text"
                placeholder="Unit"
                bind:value={newUnit}
            />
        </div>
        <div class="add-button">
            <button class="add-button__button" onclick={addNew}
                >Create indicator</button
            >
        </div>
    </div>
</div>

<style>
    .create-dataset {
        background-color: rgba(128, 128, 128, 0.289);
        border-radius: 12px;
    }

    .create-dataset__title {
        display: flex;
        justify-content: center;
        padding-top: 15px;
        margin-bottom: 0;
    }

    .add-button {
        display: flex;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-top: 10px;
        justify-content: center;
    }

    .add-button__button {
        padding: 5px 10px;
        margin-bottom: 10px;
        margin-right: 10px;
        background: var(--schemes-primary, #30B2B3);
        color: white;
        border-radius: 100px;
        border-style: solid;
        border-color: #000000;
        border-width: 1px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 120px;
        height: 50px;
        position: relative;
        overflow: hidden;
    }

    .add-button__button:hover {
        cursor: pointer;
    }

    .input__container {
        display: flex;
        flex-direction: column;
    }

    .input::placeholder {
        padding-left: 2px;
    }

    .input {
        border: #5757579e solid 2px;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0);
        font-size: 17px;
        padding: 3px 0;
        margin: 15px 15px;
        color: black;
        max-width: 396px;
    }

    .input:first-child {
        margin: 15px 15px;
        margin-top: 35px;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
    }
</style>
