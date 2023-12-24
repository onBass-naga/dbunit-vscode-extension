import { AppState, Table } from "../core/types";

function serializeToFlatXml(tablles: Table[]) {
    const xmlDoc = document.implementation.createDocument(null, 'dataset')
    for (let table of tablles) {
        for (let row of table.rows) {
            const element = xmlDoc.createElement(table.tableName)
            Object.entries(row).forEach(([columnName, columnValue]) => {
                if (columnName.indexOf("__$") === -1) {
                    element.setAttribute(columnName, columnValue)
                    xmlDoc.documentElement.appendChild(element)
                }
            })
        }
    }

    var serializer = new XMLSerializer()
    var xmlString = serializer
        .serializeToString(xmlDoc)
        .replaceAll('><', '>\n  <')
        .replaceAll('  </dataset>', '</dataset>')

    return "<?xml version='1.0' encoding='UTF-8'?>\n" + xmlString
}

function serializeToStandardXml(tablles: Table[]) {
    const xmlDoc = document.implementation.createDocument(null, 'dataset')

    for (let table of tablles) {
        const tableElem = xmlDoc.createElement('table')
        tableElem.setAttribute('name', table.tableName)

        table.columnNames.forEach(columnName => {
            const columnElem = xmlDoc.createElement('column')
            columnElem.textContent = columnName
            tableElem.appendChild(columnElem)
        })

        const rows = table.rows.filter((row) => {
            return !Object.entries(row).every(([key, value]) => value === '[null]')
        })
        for (let row of rows) {
            const rowElem = xmlDoc.createElement('row')
            const valueMap = Object.entries(row).reduce((acc, [key, value]) => {
                acc.set(key, value + "")
                return acc
            }, new Map<string, string>())

            table.columnNames.forEach(column => {
                const value = valueMap.get(column) || ""
                if (value === '[null]') {
                    const nullElem = xmlDoc.createElement('null')
                    rowElem.appendChild(nullElem)
                } else {
                    const valueElem = xmlDoc.createElement('value')
                    valueElem.textContent = value
                    rowElem.appendChild(valueElem)
                }
            })

            tableElem.appendChild(rowElem)
        }
        xmlDoc.documentElement.appendChild(tableElem)
    }

    var serializer = new XMLSerializer()
    var xmlString = serializer
        .serializeToString(xmlDoc)
        .replaceAll(`<table`, '\n  <table')
        .replaceAll(`</table`, '\n  </table')
        .replaceAll('<column', '\n    <column')
        .replaceAll('<row', '\n    <row')
        .replaceAll('</row', '\n    </row')
        .replaceAll('<value', '\n      <value')
        .replaceAll('</dataset>', '\n</dataset>')
        .replaceAll('><null/', '>\n      <null/')

    return "<?xml version='1.0' encoding='UTF-8'?>\n" + xmlString
}


export function serialize(state: AppState) {
    return state.xmlFormat === 'flat'
        ? serializeToFlatXml(state.tables)
        : serializeToStandardXml(state.tables)
}
