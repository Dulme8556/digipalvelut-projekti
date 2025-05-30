<script>
    import { getContext, onMount } from "svelte";

    let {
        function: checkSelectedParent,
        update: updateEditedValues,
        id,
        check,
        name,
        expected,
        start,
        result,
        percent = "placeholder",
        unit,
        deadline,
        responsibility,
        customFields = [],
        onAddField,
        onDeleteField,
    } = $props();

    let lists = getContext("list");

    let editing = $state(false);
    let checked = $state(check);
    let extraData = $state(true);

    onMount(() => {
        let today = new Date().toISOString().split('T')[0]
        // to detect when excel is opened
        if (deadline && responsibility) {
            // to detect when indicator made manually and if these values are empty
            if (deadline !== today && deadline !== "" && responsibility !== "") {
                extraData = true
            } else {
                extraData = false
            }
        }
    });

    let reached = $state("");

    function calculateReached() {
        if (result == expected){
            reached = "Target reached"
        } else if(result > expected) {
            reached = "Target exceeded"
        } else if (result < expected){
            reached = "Target not reached"
        }
    }

    export function checkAll() {
        checked = true;
    }

    export function uncheckAll() {
        checked = false;
    }

    export function selected() {
        return checked;
    }

    export function returnID() {
        return id;
    }

    function checkboxClick(event) {
        checked = !checked;

        let indicator = lists.list.find((item) => item.id === id);
        if (indicator) {
            indicator.check = checked;
        }

        setTimeout(() => (event.target.checked = checked), 0);
        checkSelectedParent();
    }

    function percentCalculation() {
        if (!result || !expected) return;

        let rawValue = (result / expected) * 100;
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
                element.expected = expected;
                element.start = start;
                element.result = result;
                element.percent = percent;
                element.unit = unit;
                element.deadline = deadline;
                element.responsibility = responsibility;
            }
        });
        calculateReached();
        updateFormattedDeadline();
        updateEditedValues();
    }

    function deleteCustomField(id) {
        onDeleteField(id);
    }

    // Ep = extra point
    export function returnLastEpId() {
        let id = Math.max(...customFields.map((t) => t.id))
        return id;
    }

    export function containsCustomFields() {
        // check if customFields contains something and not just empty array
        if (customFields[0]) {
            return true;
        } else {
            return false;
        }
    }

    let formattedDeadline = $state(deadline
		? new Date(deadline).toLocaleDateString('fi-FI')
		: '');
    
    function updateFormattedDeadline() {
        formattedDeadline = new Date(deadline).toLocaleDateString('fi-FI')
    }
    
    calculateReached();

    function downloadICS() {
    if (!checked || !name || !deadline) {
        alert("Only selected indicators with a deadline can be added to the calendar.");
        return;
    }

    const startDate = new Date(deadline);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const formatDate = (date) =>
        date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const icsContent = `BEGIN:VCALENDAR
                        VERSION:2.0
                        PRODID:-//Your App//Indicator Calendar//EN
                        BEGIN:VEVENT
                        UID:${id}@yourapp.com
                        DTSTAMP:${formatDate(new Date())}
                        DTSTART:${formatDate(startDate)}
                        DTEND:${formatDate(endDate)}
                        SUMMARY:Indicator - ${name}
                        DESCRIPTION:Expected: ${expected}, Result: ${result}, Responsibility: ${responsibility}
                        END:VEVENT
                        END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.replace(/\s+/g, "_") || "reminder"}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}




</script>

<div>
    <!-- editing on -->
    {#if editing}
        <div class="line">
            <input
                class="checkbox"
                type="checkbox"
                {checked}
                onclick={checkboxClick}
            />
            <div class="data__container">
                <div class="column">
                    <div class="component">
                        <h3>indicator:</h3>
                        <input
                        class="input input__long long"
                        type="text"
                        bind:value={name}
                        />
                    </div>
                    <div class="component"></div>
                    {#if extraData}
                    <div class="component">
                        <h3>deadline:</h3>
                        <input
                        class="input input__long long"
                        type="date"
                        bind:value={deadline}
                        />
                    </div>
                    {/if}
                    {#each customFields as field, i}
                    <div class="component">
                        <h3>{field.title}:</h3>
                        <input class="input" type="text" bind:value={field.value} />
                        {#if i === customFields.length - 1}
                            <button 
                            class="delete__extraPoint-button" 
                            onclick={() => deleteCustomField(field.id)}>
                                X
                            </button>
                        {/if}
                    </div>
                    {/each}
                </div>
                <div class="column">
                    <div class="component">
                        <h3>expected:</h3>
                        <input class="input" type="text" bind:value={expected} />
                    </div>
                    <div class="component">
                        <h3>percent:</h3>
                    </div>
                    {#if extraData}
                    <div class="component">
                        <h3>resp:</h3>
                        <input class="input input__long-responsibility" type="text" bind:value={responsibility}/>
                    </div>
                    {/if}
                </div>
                <div class="column">
                    <div class="start_end__group">
                        <div class="component">
                            <h3>start:</h3>
                            <input
                                class="input"
                                type="text"
                                bind:value={start}
                            />
                        </div>
                        <div class="component">
                            <h3>result:</h3>
                            <input class="input" type="text" bind:value={result} />
                        </div>
                    </div>
                    <div class="component">
                        <h3>unit:</h3>
                        <input
                            class="input input__long long"
                            type="text"
                            bind:value={unit}
                        />
                    </div>
                </div>
            </div>
            <button class="button button__save" onclick={onSave}>Save</button>
        </div>
    {:else} <!-- editing off -->
        <div class="line">
            <input
                class="checkbox"
                type="checkbox"
                {checked}
                onclick={checkboxClick}
            />
            <div class="data__container">
                <div class="column">
                    <div class="component">
                        <h3>indicator:</h3>
                        <div class="long1" title={name}>{name}</div>
                    </div>
                    {#if extraData}
                    <div class="component"></div>
                    <div class="component">
                        <h3>deadline:</h3>
                        <div class="long">{formattedDeadline}</div>
                    </div>
                    {/if}
                    {#each customFields as field}
                        <div class="component">
                            <h3>{field.title}:</h3>
                            <div class="long">{field.value}</div>
                        </div>
                    {/each}
                </div>
                <div class="column">
                    <div class="component">
                        <h3>expected:</h3>
                        <div class="long">{expected}</div>
                    </div>
                    <div class="component">
                        <h3>percent:</h3>
                        {#if percent !== "placeholder"}
                            <div class="long">{percent}%</div>
                        {/if}
                    </div>
                    {#if extraData}
                    <div class="component">
                        <h3>responsibility:</h3>
                        <div class="long long__responsibility">{responsibility}</div>
                    </div>
                    {/if}
                </div>
                <div class="column">
                    <div class="start_end__group">
                        <div class="component">
                            <h3>start:</h3>
                            <div class="long">{start}</div>
                        </div>
                        <div class="component">
                            <h3>result:</h3>
                            <div class="long">{result}</div>
                        </div>
                    </div>
                    <div class="start_end__group">
                        <div class="component">
                            <h3>unit:</h3>
                            <div class="long" title={unit}>{unit}</div>
                        </div>
                        <div style="padding-left:6px;" class="component">
                            <!-- temp padding -->
                            <h3>status:</h3>
                            <div style="display:flex; flex-direction:row; width:120px;">{reached}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="button__container">
                <button class="button" onclick={onAddField}>+</button>
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
                <button class="button" onclick={downloadICS} title="Download calendar reminder">
                    📅
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    h3 {
        padding-right: 10px;
        margin: 0;
    }

    input {
        max-height: 16px;
    }

    .line {
        display: flex;
        justify-content: space-between;
        width: 770px;
        font-size: 15px;
        padding-top: 10px;
        margin: 5px 0;
        border: 1px rgba(0, 0, 0, 0.3) solid;
    }
    
    .checkbox {
        display: flex;
        cursor: pointer;
        width: 20px;
        transform:scale(1.2);
        margin: 8px 8px;
    }
    
    .data__container {
        display: grid;
        grid-template-columns: 200px 150px 150px 1fr 1fr;
        gap: 10px;
        width: 100%;
    }
    
    .component {
        display: flex;
        flex-direction: row;
        margin-right: 10px;
        padding: 5px 0;
        min-height: 24px;
    }

    .delete__extraPoint-button {
        position: relative;
        /* left: -170px; */
        border: none;
        background-color: white;
        font-weight: 900;
        color: #6e6e6e;
    }

    .delete__extraPoint-button:hover {
        color: red;
    }
    
    .long {
        padding-top: 2.5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 80px;
    }

    .long__responsibility {
        overflow: visible;
    }

    .long1{
        padding-top: 2.5px;
        max-width: 120px;
        overflow-wrap: break-word;
        word-break: normal;
        white-space: normal;
    }
    
    .column {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .start_end__group {
        display: flex;
        flex-direction: row;
        gap: 20px;
    }

    .button__container {
        display: flex;
        flex-direction: row;
        justify-self: end;
        align-self: start;
        margin-right: 5px;
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
        width: 40px;
    }

    .input__long {
        width: 100px;
    }

    .input__long-responsibility {
        width: 200px;
    }

    .button__save {
        width: 40px;
        display: flex;
        align-self: start;
        margin-right: 5px;
    }
</style>
