class Line {
    constructor() {
        this.chartData = [];
    } 
    changeData(data) {
        let data1 = [];
        let data2 = [];
        let labels = [];

        data.datasets.forEach(element => {
            data1.push(element.data[0])
        });
        data.datasets.forEach(element => {
            data2.push(element.data[1])
        })
        
        data.datasets.forEach(element => {
            labels.push(element.label)
        })
        
        let dataset1 = { label: data.labels[0], backgroundColor: 'red', data: data1 };
        let dataset2 = { label: data.labels[1], backgroundColor: 'blue', data: data2 };
        

        this.chartData = {
            id: data.id,
            title: data.title,
            type: data.type,
            labels: labels,
            indexAxis: data.indexAxis,
            datasets: [dataset1, dataset2,],
        };
    }

    getData() {
        return this.chartData
    }
}
export default Line;