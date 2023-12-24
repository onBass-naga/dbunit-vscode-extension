import { useImmerReducer } from 'use-immer';
import { AppState, Cell, DataRow, DbUnitXml, XmlFormat } from "./types"

export type Action =
    | {
        type: 'updateXml'
        payload: {
            xml: DbUnitXml
        }
    }
    | {
        type: 'addTable'
        payload: {
            tableName: string,
            columnNames: string[]
        }
    }
    | {
        type: 'deleteTable'
    }
    | {
        type: 'updateTable'
        payload: {
            tabIndex: number,
            tableName: string,
            columnChanges: { name: string, originalName: string }[]
        }
    }
    | {
        type: 'moveTableLeft'
    }
    | {
        type: 'moveTableRight'
    }
    | {
        type: 'updateColumnValue'
        payload: {
            rows: DataRow[]
        }
    }
    | {
        type: 'updateDarkMode'
        payload: {
            darkmode: boolean
        }
    }
    | {
        type: 'updateCell'
        payload: {
            cell: Cell
        }
    }
    | {
        type: 'updateTabIndex'
        payload: {
            tabIndex: number
        }
    }
    | {
        type: 'cloneRow'
    }
    | {
        type: 'deleteRow'
    }
    | {
        type: 'updateXmlFormat',
        payload: {
            xmlFormat: XmlFormat
        }
    }


export function reducer(draft: AppState, action: Action) {
    switch (action.type) {
        case 'moveTableLeft': {
            const tabIndex = draft.tabIndex
            if (tabIndex > 0) {
                const table = draft.tables[tabIndex]
                draft.tables.splice(tabIndex, 1)
                draft.tables.splice(tabIndex - 1, 0, table)
                draft.tabIndex = tabIndex - 1
            }
            break
        }
        case 'moveTableRight': {
            const tabIndex = draft.tabIndex
            if (tabIndex < draft.tables.length - 1) {
                const table = draft.tables[tabIndex]
                draft.tables.splice(tabIndex, 1)
                draft.tables.splice(tabIndex + 1, 0, table)
                draft.tabIndex = tabIndex + 1
            }
            break
        }
        case 'deleteTable': {
            const tabIndex = draft.tabIndex
            if (tabIndex === draft.tables.length - 1) {
                draft.tabIndex = tabIndex - 1
            }
            draft.tables.splice(tabIndex, 1)
            break
        }
        case 'addTable': {
            const tableId = crypto.randomUUID()
            const table = {
                __$id: tableId,
                tableName: action.payload.tableName,
                rows: [action.payload.columnNames.reduce((acc: any, name: string, index: number) => {
                    return Object.assign(acc, { [name]: "" })
                }, { __$id: 0 })],
                columnNames: new Set(action.payload.columnNames)
            }
            draft.tables.push(table)
            break;
        }
        case 'updateTable': {
            const table = draft.tables[action.payload.tabIndex]

            const columnNames = new Set(action.payload.columnChanges.map(it => it.name))
            const nameMap = action.payload.columnChanges.reduce((acc, change) => {
                acc.set(change.originalName, change.name)
                return acc
            }, new Map<string, string>())

            const rows = table.rows.map(row => {
                return Object.entries(row).reduce((acc, [key, value]) => {
                    acc.set(nameMap.get(key) || key, value)
                    return acc
                }, new Map<string, any>())
            }).map((rowMap, index) => {
                return Array.from(columnNames).reduce((acc, name) => {
                    const value = !!rowMap.get(name) ? rowMap.get(name) + "" : ""
                    return Object.assign(acc, { [name]: value })
                }, { __$id: index })
            })

            table.tableName = action.payload.tableName
            table.columnNames = columnNames
            table.rows = rows
            break;
        }
        case 'updateColumnValue': {
            const table = draft.tables[draft.tabIndex]
            table.rows = action.payload.rows
            break;
        }
        case 'updateXml': {
            Object.assign(draft, action.payload.xml)
            break;
        }
        case 'updateDarkMode': {
            draft.darkmode = action.payload.darkmode
            break;
        }
        case 'updateCell': {
            draft.cell = action.payload.cell
            break;
        }
        case 'updateTabIndex': {
            draft.tabIndex = action.payload.tabIndex
            break;
        }
        case 'cloneRow': {
            const { cell, tabIndex } = draft
            if (cell == null || cell.rowIdx === -1) {
                break;
            }

            const newRow = Object.assign({}, draft.tables[tabIndex].rows[cell.rowIdx],
                { __$id: draft.tables[tabIndex].rows.length })
            draft.tables[tabIndex].rows.splice(cell.rowIdx + 1, 0, newRow)
            break;
        }
        case 'deleteRow': {
            const { cell, tabIndex } = draft
            if (cell == null || cell.rowIdx === -1) {
                break;
            }

            draft.tables[tabIndex].rows.splice(cell.rowIdx, 1)
            break;
        }
        case 'updateXmlFormat': {
            draft.xmlFormat = action.payload.xmlFormat
            break;
        }
        default: {
            // throw Error('Unknown action: ' + action.type)
            throw Error('error')
        }
    }
}

export const defaultState = {
    tables: [],
    xmlFormat: 'flat',
    darkmode: true,
    tabIndex: 0
} as AppState

export default function useStateReducer() {
    const [state, dispatch] = useImmerReducer(reducer, defaultState);
    return { state, dispatch };
}

export const defaultStateReducer: ReturnType<typeof useStateReducer> = {
    state: defaultState,
    dispatch: () => { }
};

export function isDefaultState(state: AppState) {
    return state.xmlFormat === 'flat' && state.tables.length === 0 && state.darkmode
}