class Bar {
    constructor() {
        this.dataset;
    }

    changeData(start, result, expected, unit, labels, customFields, colors) {
        let colorList = colors;
        let datasetList = [];
        let minBarLength = 4;
        let convertedCustomFields = JSON.parse(JSON.stringify(customFields))

        let customChunkList = [];

        if (
            Array.isArray(customFields) &&
            customFields.some(group => Array.isArray(group) && group.length > 0)
        ) {
            let uniqueTitles = new Set();

            for (let group of customFields) {
                if (Array.isArray(group)) {
                    for (let item of group) {
                        if (item?.title != null) {
                            uniqueTitles.add(item.title);
                        }
                    }
                }
            }

            let titleArray = Array.from(uniqueTitles);

            for (let i = 0; i < titleArray.length; i++) {
                let title = titleArray[i];
                let data = [];

                for (let j = 0; j < customFields.length; j++) {
                    let group = customFields[j];
                    let value = 0;

                    if (Array.isArray(group)) {
                        let match = group.find(item => item?.title === title);
                        value = match ? Number(match.value) : 0;
                    }

                    data.push(value);
                }

                customChunkList.push({
                    label: title,
                    data,
                    backgroundColor: colorList[(i + 3) % colorList.length],
                    unit: unit,
                    minBarLength: minBarLength,
                });
            }
        }

        this.dataset = [
            {
                label: "start",
                data: start,
                backgroundColor: colorList[0],
                unit: unit,
                minBarLength: minBarLength,
            },
            ...customChunkList,
            {
                label: "result",
                data: result,
                backgroundColor: colorList[1],
                unit: unit,
                minBarLength: minBarLength,
            },
            {
                label: "expected",
                data: expected,
                backgroundColor: colorList[2],
                unit: unit,
                minBarLength: minBarLength,
            },
        ];
    }

    getData() {
        return this.dataset
    }
}
export default Bar;