import { XMLParser } from 'fast-xml-parser'
import { DbUnitXml } from "../core/types"

const parser = new XMLParser({
    ignoreDeclaration: true,
    ignoreAttributes: false,
})

export function parseXmlString(xml: string) {
    
    const xmlObject = parse(xml)
    const isStandard = isStandardFormat(xmlObject)
    const tables = isStandard
        ? convertFromStandardXml(xmlObject.dataset.table)
        : convertFromFlatXml(xmlObject.dataset)

    if (tables.length  === 0) {
        return defaultValue()
    }

    return {
        tables,
        xmlFormat: isStandard ? 'standard' : 'flat',
        tabIndex: 0
    } as DbUnitXml
}

function isStandardFormat(obj: any) {
    if (!hasKey(obj, 'dataset')) {
        throw Error(' Unexpected format')
    }

    if (!hasKey(obj.dataset, 'table')) {
        return false
    }

    const table = obj.dataset.table
    const tables = toArray(table)

    return hasKey(tables[0], '@_name') && hasKey(tables[0], 'column') && hasKey(tables[0], 'row')
}

function toArray(obj: any): any[] {
    return Array.isArray(obj) ? obj : [obj]
}

function hasKey(obj: any, key: string) {
    return !!Object.keys(obj).find(it => it === key)
}

export function parse(xml: string) {
    return parser.parse(xml)
}

export function convertFromFlatXml(datasetObject: object) {
    return Object.entries(datasetObject)
        .map((entry) => {
            const table = covertFlatXmlRows(entry[0], toArray(entry[1]))
            return Object.assign({}, table, { __$id: crypto.randomUUID() })
        })
}

function covertFlatXmlRows(tableName: string, rowObjects: any[]) {
    const columnNames = createColumnNames(rowObjects)

    const rows = rowObjects.map((row, index) => {
        const rowObj = {
            __$id: index,
        }

        return Array.from(columnNames).reduce(
            (acc, key) => {
                const originalKey = `@_${key}`
                const value = row[originalKey] == null ? "[null]" : row[originalKey] as string
                return Object.assign(acc, { [key]: value })
            }, rowObj)
    })

    return { tableName, rows, columnNames }
}

function createColumnNames(rows: any[]) {
    return rows.flatMap(row => Object.keys(row))
        .map(key => key.replace('@_', ''))
        .reduce((acc, key) => {
            acc.add(key)
            return acc
        }, new Set<string>())
}

function convertFromStandardXml(tableObj: any) {

  return toArray(tableObj).map(table => {
    const tableName = table["@_name"] + ""
    const columnNames = new Set(toArray(table["column"]))
    const rows = convertFromStandardRow(table["row"], columnNames)
    return {
        __$id: crypto.randomUUID(),
        tableName,
        columnNames,
        rows
    };
  })
}

function convertFromStandardRow(rowObj: any, columnNames: Set<string>) {
    const columns = Array.from(columnNames)
    return toArray(rowObj).map((row, index) => {
        return toArray(row.value).reduce((acc, value, i) => {
            return Object.assign(acc, { [columns[i]]: value + ""})
        }, {__$id: index,})
    })

}

function defaultValue() {
    return {
        tables: [{
            __$id: crypto.randomUUID(),
            tableName: "table_name",
            columnNames: new Set(["column_name"]),
            rows: [Object.assign({ __$id: 0, column_name: "some_value"})]
        }],
        xmlFormat: 'flat',
        tabIndex: 0
    } as DbUnitXml
}

