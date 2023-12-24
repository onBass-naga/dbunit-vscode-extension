import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

import { EditableTable } from './EditableTable'
import { useAppContext } from '../core/Context'
import { Header } from './Header'
import { PlusSquareIcon } from '@chakra-ui/icons'
import TableForm from './TableForm'

export default function Container() {
  const { state, dispatch } = useAppContext()

  if (state.tables.length === 0) {
    return <p>Loading...</p>
  }

  const tableNames = state.tables.map((it) => it.tableName)

  function onChange(index: number) {
    dispatch({
      type: 'updateTabIndex',
      payload: { tabIndex: index },
    })
  }

  function createTable(data: {
    tableName: string
    columns: { name: string }[]
  }) {
    dispatch({
      type: 'addTable',
      payload: {
        tableName: data.tableName,
        columnNames: data.columns.map((it) => it.name),
      },
    })
  }

  return (
    <>
      <Header />
      <Tabs
        onChange={onChange}
        index={state.tabIndex}
        size="md"
        variant="enclosed"
      >
        <TabList style={{ overflowX: 'scroll' }}>
          {tableNames.map((name, index) => (
            <Tab key={`${name}:${index}`}>{name}</Tab>
          ))}
          <Tab key={'__$new'}>
            <PlusSquareIcon boxSize={4} />
          </Tab>
        </TabList>
        <TabPanels>
          {state.tables.map((table) => {
            return (
              <TabPanel key={table.__$id}>
                <EditableTable table={table} />
              </TabPanel>
            )
          })}
          <TabPanel key={'__$new'}>
            <TableForm
              tableFormType={'Create'}
              onSubmit={createTable}
              table={{
                __$id: crypto.randomUUID(),
                tableName: '',
                columnNames: new Set(['']),
                rows: [],
              }}
              tableNames={state.tables.map((it) => it.tableName)}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}
