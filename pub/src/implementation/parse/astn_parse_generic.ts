import * as _et from 'pareto-core-interface'

import * as si from "../temp/string_iterator"

import * as _source from "../../interface/to_be_generated/token"
import * as d_parse_astn_source from "../../interface/to_be_generated/parse_astn_source"


export type My_Lexer_Error = {
    'type': d_parse_astn_source.Lexical_Error,
    'range': _source.Range,
}

export type My_Parse_Error = {
    'type': d_parse_astn_source.Syntactical_Error,
    'range': _source.Range,
}


const throw_parse_error = (
    type: d_parse_astn_source.Syntactical_Error,
    range: _source.Range,
    abort: ($: My_Parse_Error) => never,
): never => {
    abort({
        'type': type,
        'range': range,
    })
}

export const throw_unexpected_token = (
    found: _source.Annotated_Token,
    expected: _et.List<d_parse_astn_source.Expected>,
    abort: ($: My_Parse_Error) => never,
): never => {
    return throw_parse_error(
        {
            'expected': expected,
            'cause': ['unexpected token', {
                'found': found.type,
            }]
        },
        {
            'start': found.start,
            'end': found.end,
            'uri': found.uri,
        },
        abort,
    )
}

export type ASTN_Token_Iterator = si.Token_Iterator<d_parse_astn_source.Expected, _source.Annotated_Token>

export const create_astn_token_iterator = (
    $: _source.Tokenizer_Result.tokens, 
    $p: {
        end: si.Location,
        uri: string,
    },
    abort: ($: My_Parse_Error) => never,
): ASTN_Token_Iterator => {
    let position = 0
    return {
        'get required token': (pet) => {
            return $.__get_element_at(position).transform(
                ($) => $,
                () => throw_parse_error(
                    {
                        'expected': pet,
                        'cause': ['missing token', null]
                    },
                    {
                        'start': $p.end,
                        'end': $p.end,
                        'uri': $p.uri,
                    },
                    abort,
                )
            )
        },
        'consume token': () => {
            position += 1
        },
    }
}