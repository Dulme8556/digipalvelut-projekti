class Line {
    constructor() {
        this.dataset;
    }

    changeData(start, end, target, unit, labels, customFields) {
        let colorList = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
        let datasetList = [];
        let customFieldsDataset = [];
        let convertedCustomFields = JSON.parse(JSON.stringify(customFields))

        
        let customFieldValues = convertedCustomFields[0].map((item) => Number(item.value))
        let customFieldLabels = convertedCustomFields[0].map((item) => item.title)
        
        let labelList = ["start",...customFieldLabels, "end", "target"]
        let storeData = { start: start, end: end, target: target }

        for (let i = 0; i < labels.length; i++) {
            let data = [storeData.start[i],...customFieldValues, storeData.end[i], storeData.target[i]]
            let dataset = { label: labels[i], data: data, backgroundColor: colorList[i], unit: unit[i]}
            datasetList.push(dataset)
        }
        
        this.dataset = { datasets: datasetList, labels: labelList };
    }

    getData() {
        return this.dataset
    }
}
export default Line;