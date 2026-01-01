import * as _pi from 'pareto-core-interface'


export type Value =
    | readonly ['indexed collection',
        | readonly ['dictionary', {
            readonly 'entries': Key_Value_Pairs
            readonly '{': Structural_Token
            readonly '}': Structural_Token
        }]
        | readonly ['verbose group', {
            readonly '(': Structural_Token
            readonly ')': Structural_Token
            readonly 'entries': Key_Value_Pairs
        }]
    ]
    | readonly ['not set', {
        readonly '~': Structural_Token
    }]
    | readonly ['ordered collection',
        | readonly ['concise group', {
            readonly '<': Structural_Token
            readonly '>': Structural_Token
            readonly 'elements': Elements
        }]
        | readonly ['list', {
            readonly '[': Structural_Token
            readonly ']': Structural_Token
            readonly 'elements': Elements
        }]
    ]
    | readonly ['set optional value', {
        readonly '*': Structural_Token
        readonly 'value': Value
    }]
    | readonly ['string', String]
    | readonly ['tagged value', {
        readonly 'state': String
        readonly 'value': Value
        readonly '|': Structural_Token
    }]


export type Document = {
    readonly 'content': Value
    readonly 'header': _pi.Optional_Value<{
        readonly '!': Structural_Token
        readonly 'value': Value
    }>
}

export type Elements = _pi.List<{
    readonly 'value': Value
}>

export namespace Elements {
    export type L = {
        readonly 'value': Value
    }
}

export type Key_Value_Pairs = _pi.List<{
    readonly ',': _pi.Optional_Value<Structural_Token>
    readonly 'key': String
    readonly 'value': _pi.Optional_Value<{ //this one should not be optional
        readonly ':': Structural_Token
        readonly 'value': Value
    }>
}>

export namespace Key_Value_Pairs {
    export type L = {
        readonly ',': _pi.Optional_Value<Structural_Token>
        readonly 'key': String
        readonly 'value': _pi.Optional_Value<{//this one should not be optional
            readonly ':': Structural_Token
            readonly 'value': Value
        }>
    }
}

export type String = {
    readonly 'range': Range
    readonly 'trailing trivia': Trivia
    readonly 'type': String_Type
    readonly 'value': string
}

export type Structural_Token = {
    readonly 'range': Range
    readonly 'trailing trivia': Trivia
}

// the following types come from the 'Token' schema


export type Range = {
    readonly 'uri': string
    readonly 'end': Location
    readonly 'start': Location
}

export type Location = {
    readonly 'absolute': number
    readonly 'relative': Relative_Location
}

export type Relative_Location = {
    readonly 'column': number
    readonly 'line': number
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

export type String_Type =
    | readonly ['apostrophed', null]
    | readonly ['backticked', null]
    | readonly ['quoted', null]
    | readonly ['undelimited', null]