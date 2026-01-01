import * as d_deserialize_unresolved_schema from "./deserialize_unresolved_model"

export type Parameters = d_deserialize_unresolved_schema.Parameters

export type Error =
    | ['resolving', null]
    | ['pre resolving', d_deserialize_unresolved_schema.Error]