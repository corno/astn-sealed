import * as _p from 'pareto-core-serializer'

import * as d_serialize_resolved_model from "../../../interface/to_be_generated/deserialize_resolved_model"

import * as s_deserialize_unresolved_model from "../deserialize_unresolved_model/serializers"

export const Error = ($: d_serialize_resolved_model.Error): string => {
    return _p.cc($, ($): string => {
        switch ($[0]) {
            case 'pre resolving': return _p.ss($, ($) => `pre resolving: ` + s_deserialize_unresolved_model.Error($))
            case 'resolving': return _p.ss($, ($) => `resolving: ` )
            default: return _p.au($[0])
        }
    })
}