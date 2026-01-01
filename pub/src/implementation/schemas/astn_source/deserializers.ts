import * as _ea from 'pareto-core-deserializer'
import * as _pi from 'pareto-core-interface'
import * as _ei from 'pareto-core-internals'

import * as d_ast from "../sealed_astn_source/productions/annotated_token"
import * as _target from "../../../interface/to_be_generated/parse_astn_source"
import * as d_astn_source from "../../../interface/to_be_generated/astn_source"

import * as pg from "../../parse/astn_parse_generic"
import * as si from "../../temp/string_iterator"

import * as tokenize from "../../parse/token"

export type Parameters = {
    'tab size': number
    'uri': string
}

export type Document = _pi.Deserializer_With_Parameters<d_astn_source.Document, _target.Error, Parameters>

export const Document: Document = ($, abort, $p) => {
    const string_iterator = si.create_string_iterator(
        $,
        {
            'tab size': $p['tab size'],
            'uri': $p.uri,
        }
    )
    const tokenizer_result = tokenize.Tokenizer_Result(
        string_iterator,
        ($) => abort({
            'type': ['lexical', $.type],
            'range': $.range
        }),
    )
    const token_iterator = pg.create_astn_token_iterator(
        tokenizer_result.tokens,
        {
            end: tokenizer_result.end,
            'uri': $p.uri
        },
        ($) => abort({
            'type': ['syntactical', $.type],
            'range': $.range
        })
    )
    return d_ast.Document(
        token_iterator,
        ($) => abort({
            'type': ['syntactical', $.type],
            'range': $.range
        })
    )

}
