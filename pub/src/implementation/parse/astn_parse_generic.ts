import * as _pi from 'pareto-core-interface'

import * as si from "../temp/string_iterator"

import * as d_source from "../../interface/to_be_generated/token"
import * as d_parse_astn_source from "../../interface/to_be_generated/parse_astn_source"


export type My_Lexer_Error = {
    'type': d_parse_astn_source.Lexical_Error,
    'range': d_source.Range,
}

export type My_Parse_Error = {
    'type': d_parse_astn_source.Syntactical_Error,
    'range': d_source.Range,
}


const throw_parse_error = (
    type: d_parse_astn_source.Syntactical_Error,
    range: d_source.Range,
    abort: ($: My_Parse_Error) => never,
): never => {
    abort({
        'type': type,
        'range': range,
    })
}

export const throw_unexpected_token = (
    found: d_source.Annotated_Token,
    expected: _pi.List<d_parse_astn_source.Expected>,
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

export type ASTN_Token_Iterator = si.Token_Iterator<d_parse_astn_source.Expected, d_source.Annotated_Token>

export const create_astn_token_iterator = (
    $: d_source.Tokenizer_Result.tokens, 
    $p: {
        end: si.Location,
        uri: string,
    },
    abort: ($: My_Parse_Error) => never,
): ASTN_Token_Iterator => {
    let position = 0
    return {
        'get required token': (pet) => {
            return $.__get_possible_element_at(position).transform(
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