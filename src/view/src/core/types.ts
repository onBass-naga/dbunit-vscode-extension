

export type XmlFormat = 'flat' | 'standard'

export interface DbUnitXml {
    tables: Table[]
    xmlFormat: XmlFormat
}

export interface Table {
    __$id: string
    tableName: string
    rows: DataRow[]
    columnNames: Set<string>
}

export interface AppState {
    tables: Table[]
    xmlFormat: XmlFormat
    darkmode: boolean
    tabIndex: number
    cell?: Cell
};

export interface DataRow {
    __$id: number
}

export interface Cell {
    rowIdx: number // ヘッダーの場合は-1
    row?: {
        __$id: number
    },
    column: {
        key: string
        name: string
        idx: number
    }
}
