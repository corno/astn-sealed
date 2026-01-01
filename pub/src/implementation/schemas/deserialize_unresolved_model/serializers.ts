
import * as _p from 'pareto-core-serializer'

import * as d_serialize_unresolved_model from "../../../interface/to_be_generated/deserialize_unresolved_model"

import * as s_parse_astn_source from "../parse_astn_source/serializers"

export const Error = ($: d_serialize_unresolved_model.Error): string => {
    return _p.cc($, ($): string => {
        switch ($[0]) {
            case 'parse error': return _p.ss($, ($) => `parse error: ` + s_parse_astn_source.Error($))
            case 'primitive deserialization': return _p.ss($, ($) => `primitive deserialization error: ` + $)
            default: return _p.au($[0])
        }
    })
}