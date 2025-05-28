<script>
    import { getContext } from "svelte";
    import FileReader from "../header/file-reader.svelte";

    let lists = getContext("list");

    let newId = $state("");
    let newName = $state("");
    let newExpected = $state("");
    let newStart = $state("");
    let newResult = $state("");
    let newPercent;
    let newUnit = $state("");
    let newDeadline = $state(new Date().toISOString().split('T')[0]);
    let newResponsibility = $state("");

    function percentCalculation() {
        if (!newResult || !newExpected) return;

        let rawValue = (newResult / newExpected) * 100;
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
            newExpected === "" &&
            newStart === 0 &&
            newResult === "" &&
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
                expected: newExpected,
                start: newStart,
                result: newResult,
                percent: newPercent,
                unit: newUnit,
                deadline: newDeadline,
                responsibility: newResponsibility,
            });

            lists.list = updatedList;

            newName = "";
            newExpected = "";
            newStart = "";
            newResult = "";
            newPercent = "";
            newUnit = "";
            newDeadline = "";
            newResponsibility = "";
        }
    }

    function downloadICS() {
    if (!newName || !newDeadline) {
        alert("Please provide at least a name and deadline.");
        return;
    }

    const formatDate = (dateStr, hour = 9) => {
        const date = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:00:00Z`);
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const title = `Reminder: ${newName}`;
    const description = [
        `Indicator: ${newName}`,
        `Expected: ${newExpected}`,
        `Result: ${newResult}`,
        `Unit: ${newUnit}`,
        `Responsible: ${newResponsibility}`
    ].join('\\n');

    const ics =    `BEGIN:VCALENDAR
                    VERSION:2.0
                    PRODID:-//Reminder App//EN
                    BEGIN:VEVENT
                    UID:${Date.now()}@app
                    DTSTAMP:${formatDate(new Date().toISOString().split('T')[0])}
                    SUMMARY:${title}
                    DESCRIPTION:${description}
                    LOCATION:N/A
                    DTSTART:${formatDate(newDeadline, 9)}
                    DTEND:${formatDate(newDeadline, 10)}
                    END:VEVENT
                    END:VCALENDAR`.trim();

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${newName.replace(/\s+/g, '_')}_reminder.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


</script>

<div class="add-new-section">
    <div class="create-dataset">
        <div style="display:flex; justify-content:center;">
            <h2 class="create-dataset__title">CREATE NEW INDICATOR</h2>
            <div class="createnew__info__wrapper">
                <img class="createnew__info__icon" alt="info_icon" src="./images/info.png">
                <div class="createnew__info__content">
                    <p><strong>Name</strong>: Enter the name for the indicator.</p>
                    <p><strong>Expected Value</strong>: Set the value you expect to get.</p>
                    <p><strong>Start Value</strong>: Enter the starting value for the indicator.</p>
                    <p><strong>Result Value</strong>: Enter the result value you want to measure against the expected value. This could be the final goal or current progress.</p>
                    <p><strong>Unit</strong>: Define the unit for the indicator. (e.g. expect 200 participants)</p>
                    <p><strong>Reminder</strong>: Enter the reminder date for your indicator. (optional)</p>
                    <p><strong>Responsibility</strong>: Add the persons details (email?) who is responsible for this task. (optional)</p>
                </div>
            </div>
        </div>
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
                placeholder="Expected value"
                bind:value={newExpected}
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
                placeholder="Result value"
                bind:value={newResult}
            />
            <input
                class="input"
                type="text"
                placeholder="Unit (What is measured)"
                bind:value={newUnit}
            />
            <div class="subtitle">Reminder:</div>
            <input
                class="input input__date"
                type="date"
                placeholder="Deadline"
                bind:value={newDeadline}
            />
            <input
                class="input"
                type="text"
                placeholder="Responsibility"
                bind:value={newResponsibility}
            />

        </div>
        <div class="add-button">
            <button class="add-button__button" onclick={addNew}>
                Create indicator
            </button>

            <button class="add-button__button" onclick={downloadICS}>
                Download Calendar Reminder
            </button>

        </div>
    </div>
</div>

<style>
    .createnew__info__wrapper{
        position:relative;
        display:inline-block;
    }

    .createnew__info__content{
        visibility: hidden;
        opacity: 0;
        width: 320px;
        background-color: #f9f9f9;
        color: #000;
        text-align: left;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 8px;
        position: absolute;
        z-index: 1;
        top: 50px;
        left: 0;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease;
    }

    .createnew__info__icon{
        width:28px;
        height:28px;
        padding-top:19px;
        margin-left:10px;
    }

    .createnew__info__wrapper:hover .createnew__info__content {
        visibility:visible;
        opacity: 1;
    }

    .add-new-section {
        width: 370px;
    }
    .create-dataset {
        background-color: rgba(128, 128, 128, 0.17);
        border-radius: 12px;
    }

    .create-dataset__title {
        display: flex;
        justify-content: center;
        padding-top: 15px;
        margin: 0;
    }

    .add-button {
        display: flex;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-top: 10px;
        justify-content: center;
    }

    .add-button__button {
        font-size:14px;
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
        width: 170px;
        height: 45px;
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

    .subtitle {
        margin-left: 15px;
        margin-bottom: 0;
    }

    .input__date {
        margin-top: 5px;
    }
</style>
