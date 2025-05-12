class Line {
    constructor() {
        this.dataset;
    }

    changeData(start, end, target, unit, labels, customFields) {
        let colorList = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
        let datasetList = [];
        let convertedCustomFields = JSON.parse(JSON.stringify(customFields))
        let customFieldsDataset = [];
        let customFieldValues = [];
        let customFieldLabels = [];

        // tämmöne tuli bar charttien muokkauksen jälkeen
        // tän voi kopioida sinne toisen tilalle ja kattoo console.log() nii näkee miks ei oo enää
        // convereteddCustomFields pitää vaihtaa eka
        if (!convertedCustomFields.some(item => item === null)) {    
            for (let i = 0; i < convertedCustomFields.length; i++) {
                for (let j = 0; j < convertedCustomFields[i].length; j++) { 
                    if (!customFieldsDataset[i]) customFieldsDataset[i] = []
                    customFieldValues = convertedCustomFields[i].map(item => Number(item.value));
                    customFieldLabels = convertedCustomFields[i].map(item => item.title);   
                }
                customFieldsDataset.push({values: customFieldValues, labels: customFieldLabels})
            }
        }
        // delete first slot from list which is empty
        customFieldsDataset.shift();
                
        let labelList = ["start", ...customFieldLabels, "result", "expected"]
        let storeData = { start: start, end: end, target: target }

        for (let i = 0; i < labels.length; i++) {
            let data = [
                storeData.start[i],
                ...(customFieldsDataset[i]?.values ?? []),
                storeData.end[i],
                storeData.target[i]
            ];
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