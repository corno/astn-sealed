import * as _pi from 'pareto-core-interface'


export type Location_to_String<Source> = ($: Source) => string
export type Location_2_String<Source> = Location_to_String<Source>


export type Non_Circular_Result<T> =
    | ['error', ['circular', _pi.List<string>]]
    | ['resolved', T]

export type Lookup<T> = { get_entry: (key: string) => _pi.Optional_Value<T> }
export type Acyclic_Lookup<T> = _pi.Optional_Value<Lookup<Non_Circular_Result<T>>> //FIXME should this not be optional?

export type Possibly_Circular_Result<T> = _pi.Circular_Dependency<T>

export type Cyclic_Lookup<T> = _pi.Optional_Value<Lookup<Possibly_Circular_Result<T>>> //FIXME should this not be optional?

export type Lookup_Stack<T> = _pi.List<Acyclic_Lookup<T>>
