import * as _p from 'pareto-core-serializer'
import * as _pi from 'pareto-core-interface'

import * as d_parse_astn_source from "../../../interface/to_be_generated/parse_astn_source"

export type Error = _pi.Serializer<d_parse_astn_source.Error>

export const Error: Error = ($) => {
    return _p.cc($.type, ($) => {
        switch ($[0]) {
            case 'lexical': return _p.ss($, ($) => _p.cc($, ($) => {
                switch ($[0]) {
                    case 'dangling slash': return _p.ss($, ($) => `dangling slash`)
                    case 'invalid unicode escape sequence': return _p.ss($, ($) => `invalid unicode escape sequence`)
                    case 'missing character after escape': return _p.ss($, ($) => `missing character after escape`)
                    case 'unexpected character': return _p.ss($, ($) => `unexpected character`)
                    case 'unexpected control character': return _p.ss($, ($) => `unexpected control character`)
                    case 'unexpected end of input': return _p.ss($, ($) => `unexpected end of input`)
                    case 'unexpected end of line in delimited string': return _p.ss($, ($) => `unexpected end of line in delimited string`)
                    case 'unknown escape character': return _p.ss($, ($) => `unknown escape character`)
                    case 'unterminated block comment': return _p.ss($, ($) => `unterminated block comment`)
                    case 'unterminated string': return _p.ss($, ($) => `unterminated string`)
                    case 'unterminated unicode escape sequence': return _p.ss($, ($) => `unterminated unicode escape sequence`)
                    default: return _p.au($[0])
                }
            }))
            case 'syntactical': return _p.ss($, ($) => {
                return _p.cc($.cause, ($) => {
                    switch ($[0]) {
                        case 'missing token': return _p.ss($, ($) => `missing token`)
                        case 'unexpected token': return _p.ss($, ($) => `unexpected token`)
                        default: return _p.au($[0])
                    }
                }) + `, expected: ` + _p.build_text(($i) => {
                    $.expected.__for_each(($) => {
                        $i['add snippet'](_p.cc($, ($) => {
                            return _p.cc($, ($) => {
                                switch ($[0]) {
                                    case '!': return _p.ss($, ($) => `!`)
                                    case '#': return _p.ss($, ($) => `#`)
                                    case ')': return _p.ss($, ($) => `)`)
                                    case ',': return _p.ss($, ($) => `,`)
                                    case ':': return _p.ss($, ($) => `:`)
                                    case '>': return _p.ss($, ($) => `>`)
                                    case '@': return _p.ss($, ($) => `@`)
                                    case ']': return _p.ss($, ($) => `]`)
                                    case 'a text value': return _p.ss($, ($) => `a text value`)
                                    case 'a value': return _p.ss($, ($) => `a value`)
                                    case '}': return _p.ss($, ($) => `}`)
                                    default: return _p.au($[0])
                                }
                            })
                        }))
                    })
                })
            })
            default: return _p.au($[0])
        }
    })
}