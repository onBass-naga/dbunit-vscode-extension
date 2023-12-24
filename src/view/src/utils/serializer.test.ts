import { AppState } from "../core/types"
import { serialize } from "./serializer"


test('serialize', () => {
    const state = {
        tables: [table()],
        xmlFormat: 'flat',
        tabIndex: 0,
        darkmode: true
    } as AppState
    const actual = serialize(state)
    expect(actual).toBe(`<?xml version='1.0' encoding='UTF-8'?>
<dataset>
  <test_tbl id="1" name="テスト" is_testing="true"/>
</dataset>`)
})


function table() {
    return {
        __$id: crypto.randomUUID(),
        tableName: "test_tbl",
        columnNames: new Set(["id", "name", "is_testing"]),
        rows: [{
            __$id: 7,
            id: 1,
            name: "テスト",
            is_testing: "true"
        }]
    }
}
