import { parseXmlString } from "./converter"


test('parseXmlString', () => {
    const actual = parseXmlString(xml())
    expect(actual.xmlFormat).toBe('flat')
    expect(actual.tables.length).toBe(2)
})


function xml() {
    return `
    <?xml version='1.0' encoding='UTF-8'?>
    <dataset>
        <settings id="1" name="テスト" is_testing="true" updated_at="2019-09-01 20:07:05.0"/>
        <test_cases id="1" setting="1" value="0" created_at="2019-09-01 20:07:05.0" updated_at="2019-09-01 20:07:05.0"/>
        <test_cases id="2" setting="2" value="0" created_at="2019-09-01 20:07:05.0" updated_at="2019-09-01 20:07:05.0"/>
        <settings id="2" name="テスト2" created_at="2019-09-01 20:07:05.0" updated_at="2019-09-01 20:07:05.0"/>
    </dataset>`
}