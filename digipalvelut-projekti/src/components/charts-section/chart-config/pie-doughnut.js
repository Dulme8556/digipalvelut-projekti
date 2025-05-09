class Pie {
    constructor() {
        this.returnDataset
    }

    changeData(start, end, target, unit, labels, customFields) {
        let dataset;
        
        if (start.length !== 1) {
            dataset = [
                {
                    label: "Values",
                    data: end,
                    unit: unit,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                    ],
                },
            ];
        } else {            
            let datasetList = [];
            let dataLabel = [unit];

            let convertedCustomFields = JSON.parse(JSON.stringify(customFields))
            let customFieldValues = [];
            let customFieldLabels = [];
            
            if (!convertedCustomFields.some(item => item == null)) {
                customFieldValues = convertedCustomFields[0].map(item => Number(item.value));
                customFieldLabels = convertedCustomFields[0].map(item => item.title);
            }

            let data = [start,...customFieldValues, end, target];
            let dataUnit = ["start", ...customFieldLabels, "end", "target"];
                
            dataset = [
                {
                    label: dataLabel,
                    data: data,
                    unit: dataUnit,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#4BC0C0",
                        "#9966FF",
                    ],
                },
            ];
        }
        this.returnDataset = dataset;
    }

    getData() {
        return this.returnDataset
    }
}
export default Pie;