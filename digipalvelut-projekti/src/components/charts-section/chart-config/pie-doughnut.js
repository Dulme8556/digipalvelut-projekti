class Pie {
    constructor() {
        this.returnDataset
    }

    defaultData(end, unit) {
        let dataset = [
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
        this.returnDataset = dataset;
    }

    changeData(start, end, target, unit, labels) {
        let datasetList = [];
        let dataLabel = [unit];
        let data = [start, end, target];
        let dataUnit = ["start", "end", "target"];

        let dataset = [
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

        this.returnDataset = dataset;
    }

    getData() {
        return this.returnDataset
    }
}
export default Pie;