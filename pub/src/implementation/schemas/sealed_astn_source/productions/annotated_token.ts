import * as _p from 'pareto-core-refiner'
import * as _pi from 'pareto-core-interface'

import * as d_target from "../../../../interface/to_be_generated/astn_source"
import * as d_parse_astn_source from "../../../../interface/to_be_generated/parse_astn_source"
import * as d_source from "../../../../interface/to_be_generated/token"

import * as pg from "../../../parse/astn_parse_generic"

//this file contains the parser functionality, each function return a type from the 'ast' schema

export const Structural_Token = (token: d_source.Annotated_Token): d_target.Structural_Token => {
    return {
        'trailing trivia': token['trailing trivia'],
        'range': {
            'start': token['start'],
            'end': token['end'],
            'uri': token.uri,
        }
    }
}

export const String = (
    token_iterator: pg.ASTN_Token_Iterator,
    abort: ($: pg.My_Parse_Error) => never,
): d_target.String => {
    const token = token_iterator['get required token'](_p.list_literal([['a text value', null]]))
    if (token.type[0] !== 'string') {
        return pg.throw_unexpected_token(token, _p.list_literal([['a text value', null]]), abort)
    }
    token_iterator['consume token']()
    return {
        'range': {
            'start': token['start'],
            'end': token['end'],
            'uri': token['uri'],
        },
        'value': token.type[1].value,
        'type': token.type[1].type,
        'trailing trivia': token['trailing trivia'],
    }
}

export const Document = (
    token_iterator: pg.ASTN_Token_Iterator,
    abort: ($: pg.My_Parse_Error) => never,
): d_target.Document => {
    return {
        'header': _p.block(() => {
            const token = token_iterator['get required token'](_p.list_literal([['!', null], ['a value', null]]))
            if (token.type[0] !== '!') {
                return _p.not_set()
            }
            token_iterator['consume token']()
            return _p.set({
                '!': Structural_Token(token),
                'value': Value(token_iterator, abort)
            })
        }),
        'content': Value(token_iterator, abort)
    }
}

export const Elements = (
    token_iterator: pg.ASTN_Token_Iterator,
    end_reached: ($: d_source.Token_Type) => boolean,
    end_token: d_parse_astn_source.Expected,
    abort: ($: pg.My_Parse_Error) => never,
): d_target.Elements => {
    return _p.build_list<d_target.Elements.L>(($i): void => {
        while (true) {
            const current_token = token_iterator['get required token'](_p.list_literal([end_token, ['a value', null]]))
            if (end_reached(current_token.type)) {
                return
            }
            $i['add element']({
                'value': Value(token_iterator, abort),
            })
        }
    })
}

export const Key_Value_Pairs = (
    token_iterator: pg.ASTN_Token_Iterator,
    end_reached: ($: d_source.Token_Type) => boolean,
    end_token: d_parse_astn_source.Expected,
    abort: ($: pg.My_Parse_Error) => never,
): d_target.Key_Value_Pairs => {
    return _p.build_list<d_target.Key_Value_Pairs.L>(($i): void => {
        while (true) {
            const current_token = token_iterator['get required token'](_p.list_literal([end_token, ['a text value', null]]))
            if (end_reached(current_token.type)) {
                return
            }

            $i['add element']({
                'key': String(token_iterator, abort),
                'value': _p.block(() => {
                    const candidate_colon = token_iterator['get required token'](_p.list_literal([['a text value', null], [':', null], end_token]))
                    if (candidate_colon.type[0] !== ':') {
                        return _p.not_set()
                    }
                    token_iterator['consume token']()

                    return _p.set({
                        ':': Structural_Token(candidate_colon),
                        'value': Value(token_iterator, abort)
                    })
                }),
                ',': _p.not_set()
            })
        }
    })
}

export const Value = (
    token_iterator: pg.ASTN_Token_Iterator,
    abort: ($: pg.My_Parse_Error) => never,
): d_target.Value => {
    const token = token_iterator['get required token'](_p.list_literal([['a value', null]]))
    return _p.cc(token.type, ($): d_target.Value => {

        switch ($[0]) {
            case 'string': return _p.ss($, ($): d_target.Value => {

                return ['string', String(token_iterator, abort)]
            })
            case '{': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return ['indexed collection', ['dictionary', {
                    '{': Structural_Token(token),
                    'entries': Key_Value_Pairs(token_iterator, ($) => $[0] === '}', ['}', null], abort),
                    '}': _p.block(() => {
                        const current_token = token_iterator['get required token'](_p.list_literal([['}', null]]))
                        token_iterator['consume token']()
                        return Structural_Token(current_token)
                    })
                }]]
            })
            case '(': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return ['indexed collection', ['verbose group', {
                    '(': Structural_Token(token),
                    'entries': Key_Value_Pairs(token_iterator, ($) => $[0] === ')', [')', null], abort),
                    ')': _p.block(() => {
                        const current_token = token_iterator['get required token'](_p.list_literal([[')', null]]))
                        token_iterator['consume token']()
                        return Structural_Token(current_token)
                    })
                }]]
            })
            case '[': return _p.ss($, ($): d_target.Value => {
                token_iterator['consume token']()
                return ['ordered collection', ['list', {
                    '[': Structural_Token(token),
                    'elements': Elements(token_iterator, ($) => $[0] === ']', [']', null], abort),
                    ']': _p.block(() => {
                        const current_token = token_iterator['get required token'](_p.list_literal([[']', null]]))
                        token_iterator['consume token']()
                        return Structural_Token(current_token)
                    }),
                }]]
            })
            case '<': return _p.ss($, ($): d_target.Value => {
                token_iterator['consume token']()
                return ['ordered collection', ['concise group', {
                    '<': Structural_Token(token),
                    'elements': Elements(token_iterator, ($) => $[0] === '>', ['>', null], abort),
                    '>': _p.block(() => {
                        const current_token = token_iterator['get required token'](_p.list_literal([['>', null]]))
                        token_iterator['consume token']()
                        return Structural_Token(current_token)
                    }),
                }]]
            })
            case '|': return _p.ss($, ($) => {
                token_iterator['consume token']()
                const token = token_iterator['get required token'](_p.list_literal([['a value', null], ['#', null]]))

                return ['tagged value', {
                    '|': Structural_Token(token),
                    'state': String(token_iterator, abort),
                    'value': Value(token_iterator, abort)
                }]
            })
            case '*': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return ['set optional value', {
                    '*': Structural_Token(token),
                    'value': Value(token_iterator, abort)
                }]
            })

            case '~': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return ['not set', {
                    '~': Structural_Token(token),
                }]
            })


            //unexpected tokens


            case '#': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return pg.throw_unexpected_token(token, _p.list_literal([
                    ['a value', null]
                ]), abort)
            })

            case '@': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return pg.throw_unexpected_token(token, _p.list_literal([
                    ['a value', null]
                ]), abort)
            })

            case '!': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return pg.throw_unexpected_token(token, _p.list_literal([
                    ['a value', null]
                ]), abort)
            })
            case ':': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return pg.throw_unexpected_token(token, _p.list_literal([
                    ['a value', null]
                ]), abort)
            })
            case ')': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return pg.throw_unexpected_token(token, _p.list_literal([
                    ['a value', null]
                ]), abort)
            })
            case '>': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return pg.throw_unexpected_token(token, _p.list_literal([
                    ['a value', null]
                ]), abort)
            })
            case ']': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return pg.throw_unexpected_token(token, _p.list_literal([
                    ['a value', null]
                ]), abort)
            })
            case '}': return _p.ss($, ($) => {
                token_iterator['consume token']()
                return pg.throw_unexpected_token(token, _p.list_literal([
                    ['a value', null]
                ]), abort)
            })


            default: return _p.au($[0])

        }
    })
}