import * as _p from 'pareto-core-serializer'
import * as _pi from 'pareto-core-interface'

import * as astn_target from "../../../interface/to_be_generated/astn_target"


const indentation = `    `

export const Document = (
    $: astn_target.Document
): string => {
    return _p.build_text(($i) => {
        Value($, ``, $i)
    })
}

export const Value = (
    $: astn_target.Value,
    indent: string,
    $i: _pi.Text_Builder
) => {
    _p.cc($, ($) => {
        switch ($[0]) {
            case 'dictionary': return _p.ss($, ($) => {
                $i['add snippet'](`{`)
                $.map(($, key) => {
                    $i['add snippet'](`\n${indent}${indentation}\`${key}\`: `) //FIXME escape key
                    Value($, indent + indentation, $i)
                })
                $i['add snippet'](`\n${indent}}`)
            })
            case 'verbose group': return _p.ss($, ($) => {
                $i['add snippet'](`(`)
                $.map(($, key) => {
                    $i['add snippet'](`\n${indent}${indentation}'${key}': `) //FIXME escape key
                    Value($, indent + indentation, $i)
                })
                $i['add snippet'](`\n${indent})`)
            })
            case 'list': return _p.ss($, ($) => {
                $i['add snippet'](`[`)
                $.map(($) => {
                    $i['add snippet'](` `)
                    Value($, indent + indentation, $i)
                })
                $i['add snippet'](` ]`)
            })
            case 'state': return _p.ss($, ($) => {
                $i['add snippet'](`| '${$.state}' `)
                Value($.value, indent, $i)
            })
            case 'optional': return _p.ss($, ($) => _p.cc($, ($) => {
                switch ($[0]) {
                    case 'not set': return _p.ss($, ($) => $i['add snippet'](`~`))
                    case 'set': return _p.ss($, ($) => {
                        $i['add snippet'](`* `)
                        Value($, indent, $i)
                    })

                    default: return _p.au($[0])
                }
            }))
            case 'nothing': return _p.ss($, ($) => $i['add snippet'](`~`))
            case 'text': return _p.ss($, ($) => {
                const value = $.value
                return _p.cc($.delimiter, ($) => {
                    switch ($[0]) {
                        case 'backtick': return _p.ss($, ($) => $i['add snippet'](`\`${value}\``))
                        case 'quote': return _p.ss($, ($) => $i['add snippet'](`"${value}"`))
                        case 'none': return _p.ss($, ($) => $i['add snippet'](`${value}`))
                        default: return _p.au($[0])
                    }
                })
            })
            default: return _p.au($[0])
        }
    })
}