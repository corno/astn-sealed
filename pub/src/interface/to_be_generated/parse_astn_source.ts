import * as _pi from 'pareto-core-interface'

import * as d_in from "./token"


export type Parameters = {
    'uri': string
}

export type Error = {
    readonly 'range': d_in.Range
    readonly 'type': Error__type
}

export type Error__type =
    | readonly ['lexical', Lexical_Error]
    | readonly ['syntactical', Syntactical_Error]

export type Lexical_Error =
    | readonly ['dangling slash', null]
    | readonly ['invalid unicode escape sequence', null]
    | readonly ['missing character after escape', null]
    | readonly ['unexpected character', number]
    | readonly ['unexpected control character', number]
    | readonly ['unexpected end of input', null]
    | readonly ['unexpected end of line in delimited string', null]
    | readonly ['unknown escape character', null]
    | readonly ['unterminated block comment', null]
    | readonly ['unterminated string', null]
    | readonly ['unterminated unicode escape sequence', null]

export type Syntactical_Error = {
    readonly 'cause':
    | readonly ['missing token', null]
    | readonly ['unexpected token', {
        readonly 'found': d_in.Token_Type
    }]

    readonly 'expected': _pi.List<Expected
    >
}

export type Expected =
    | readonly ['!', null]
    | readonly ['#', null]
    | readonly [')', null]
    | readonly [',', null]
    | readonly [':', null]
    | readonly ['>', null]
    | readonly ['@', null]
    | readonly [']', null]
    | readonly ['a text value', null]
    | readonly ['a value', null]
    | readonly ['}', null]

