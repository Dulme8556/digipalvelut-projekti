    import * as XLSX from "xlsx";

export function downloadIndicatorsToExcel(list) {
    const data = list.map((item) => ({
        Title: item.name,
        Target: item.expected,
        Start: item.start,
        End: item.result,
        Unit: item.unit,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Indicators");

    XLSX.writeFile(workbook, "indicators.xlsx");
}

