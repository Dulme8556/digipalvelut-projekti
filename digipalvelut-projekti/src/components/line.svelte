<script>
    import { getContext, onMount } from "svelte";

    let { id, name, target, start, end, unit } = $props();

    let lists = getContext("list");

    let percent = $state("placeholder");
    let editing = $state(false);

    let deleted = $state(false);

    onMount(() => {
        percentCalculation();
    });

    function percentCalculation() {
        if (end != "" && target != "") {
            let rawValue = (end / target) * 100;
            percent = rawValue.toFixed(0);
        }
    }

    // deleting temporarily works by hiding the line not by deleting it

    function deleteThis() {
        // this.id breaks this by only deleting the first item from the list
        let itemIdx = lists.list.filter(x => x.id === this.id);
        lists.list.splice(itemIdx, 1);
        lists.list = lists.list;

        lists.list.forEach(element => {
            console.log(element.id)
        });
    }

    function editThis() {
        editing = !editing;
    }

    function onSave(event) {
        editing = !editing;
        percentCalculation();
    }
</script>

{#if deleted}
    <div></div>
{:else}
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
                <button class="button button__save" onclick={onSave}
                    >Save</button
                >
            </div>
            <!-- editing off -->
        {:else}
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
                <button class="button button__edit" onclick={editThis}>
                    <img
                        src="./images/edit-icon.svg"
                        class="image image__edit"
                        alt=""
                    />
                </button>
                <button class="button" onclick={deleteThis}>
                    <img src="./images/delete-icon.svg" class="image" alt="" />
                </button>
            </div>
        {/if}
    </div>
{/if}

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
    }

    .button__save {
        width: 40px;
    }

    .image {
        width: 20px;
        height: 20px;
    }

    .image__edit {
        filter: brightness(0) saturate(100%) invert(17%) sepia(8%) saturate(21%)
            hue-rotate(359deg) brightness(100%) contrast(83%);
    }

    .input {
        border: #575757 solid 1px;
        border-radius: 5px;
        font-size: 14px;
        padding: 3px 0;
        color: black;
        width: 50px;
    }

    .input__long {
        width: 140px;
    }
</style>
