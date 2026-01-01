import * as _pi from 'pareto-core-interface'

export type Annotated_Token = {
    readonly 'uri': string
    readonly 'end': Location
    readonly 'start': Location
    readonly 'trailing trivia': Trivia
    readonly 'type': Token_Type
}

export type Delimited_String = string

export type Location = {
    readonly 'absolute': number
    readonly 'relative': Relative_Location
}

export type Range = {
    readonly 'uri': string
    readonly 'end': Location
    readonly 'start': Location
}

export type Relative_Location = {
    readonly 'column': number
    readonly 'line': number
}

export type String_Type =
    | readonly ['apostrophed', null]
    | readonly ['backticked', null]
    | readonly ['quoted', null]
    | readonly ['undelimited', null]


export type Token_Type =
    | readonly ['!', null]
    | readonly ['#', null]
    | readonly ['(', null]
    | readonly [')', null]
    | readonly ['*', null]
    | readonly [':', null]
    | readonly ['<', null]
    | readonly ['>', null]
    | readonly ['@', null]
    | readonly ['[', null]
    | readonly [']', null]
    | readonly ['string', {
        readonly 'type': String_Type
        readonly 'value': Delimited_String
    }]
    | readonly ['{', null]
    | readonly ['|', null]
    | readonly ['}', null]
    | readonly ['~', null]


export type Tokenizer_Result = {
    readonly 'end': Location
    readonly 'leading trivia': Trivia
    readonly 'tokens': _pi.List<Annotated_Token>
}

export namespace Tokenizer_Result {
    export type tokens = _pi.List<Annotated_Token>
}

export type Trivia = {
    readonly 'comments': _pi.List<{
        readonly 'content': string
        readonly 'range': Range
        readonly 'trailing whitespace': Whitespace
        readonly 'type':
        | readonly ['block', null]
        | readonly ['line', null]

    }>
    readonly 'leading whitespace': Whitespace
}

export type Whitespace = {
    readonly 'range': Range
    readonly 'value': string
}