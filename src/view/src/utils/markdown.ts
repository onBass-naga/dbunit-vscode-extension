import { Table } from "../core/types";


export function convertToMarkDownText(tables: Table[]) {
    return tables.reduce((acc, table) => {
        const title = `### ${table.tableName}\n\n`
        const header = "| " + Array.from(table.columnNames).join(" | ") + " |\n"
        const separator = "| " + Array.from(table.columnNames).map(it => it.replaceAll(/\w/g, "-")).join(" | ") + " |\n"
        const body = table.rows.map(row => {
            const entries = Object.entries(row)
            const value = Array.from(table.columnNames)
                .map(key => {
                    const entry = entries.find(it => it[0] === key)
                    return entry?.[1]?.replaceAll(/\|/g, "&#124;") || ""
                })
                .join(" | ")
            return `| ${value} |`
        }).join("\n")
        return acc + title + header + separator + body + "\n\n"
    }, "")
}

