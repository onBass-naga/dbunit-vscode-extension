import DataGrid, { textEditor } from 'react-data-grid'
import 'react-data-grid/lib/styles.css'
import { Cell, DataRow, Table } from '../core/types'
import { useAppContext } from '../core/Context'
import { useColorMode } from '@chakra-ui/react'

type EditableTableProps = {
  table: Table
}

export const EditableTable: React.FC<EditableTableProps> = ({ table }) => {
  const { colorMode } = useColorMode()
  const { state, dispatch } = useAppContext()

  const columns = table.rows.map((row) =>
    Object.keys(row)
      .filter((it) => it.indexOf('__$') < 0)
      .map((key) => {
        return {
          key,
          name: key,
          width: 'max-content',
          renderEditCell: textEditor,
        }
      })
  )[0]

  const rows = table.rows
  const className = colorMode === 'dark' ? 'rdg-dark' : 'rdg-light'

  function onRowsChange(rows: DataRow[]) {
    dispatch({
      type: 'updateColumnValue',
      payload: { rows },
    })
  }

  function onSelectedCellChange(change: any) {
    const cell = change as Cell
    dispatch({
      type: 'updateCell',
      payload: { cell },
    })
  }

  return (
    <>
      <DataGrid
        className={className}
        columns={columns}
        rows={rows}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        onRowsChange={onRowsChange}
        onSelectedCellChange={onSelectedCellChange}
        rowKeyGetter={rowKeyGetter}
      />
    </>
  )
}

function rowKeyGetter(row: DataRow) {
  return row.__$id
}
