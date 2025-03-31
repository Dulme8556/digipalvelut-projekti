class Line {
    constructor() {
        this.chartData = [];
    }

    changeData(data) {
        let labels = [];

        data.datasets.forEach(element => {
            labels.push(element.label)
        })

        let colorList = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]
        let datasetList = [];

        console.log(data)

        for (let i = 0; i < data.labels.length ; i++) {
            let data1 = []
            data.datasets.forEach(element => {
                data1.push(element.data[i])
            });

            let test = { label: data.labels[i], backgroundColor: colorList[i], data: data1}
            datasetList.push(test);
        }

        this.chartData = {
            id: data.id,
            title: data.title,
            type: data.type,
            labels: labels,
            indexAxis: data.indexAxis,
            converted: true,
            datasets: datasetList,
        };
    }

    getData() {
        return this.chartData
    }
}
export default Line;