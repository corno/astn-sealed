import * as _pi from 'pareto-core-interface'


// **** TYPES

export type Derived_Reference<M_Source, T_Type> = null

export type Dictionary<M_Source, T_D> = {
    readonly 'dictionary': _pi.Dictionary<{
        readonly 'entry': T_D
        readonly 'location': M_Source
    }>
    readonly 'location': M_Source
}

export type List<M_Source, T_L> = {
    readonly 'list': _pi.List<{
        readonly 'element': T_L
        readonly 'location': M_Source
    }>
    readonly 'location': M_Source
}

export type Ordered_Dictionary<M_Source, T_D> = {
    readonly 'dictionary': _pi.Dictionary<{
        readonly 'entry': T_D
        readonly 'location': M_Source
    }>
    readonly 'location': M_Source
}

export type Reference_To_Circular_Dependent_Sibling<M_Source, T_Dictionary_Entry> = {
    readonly 'key': string
    readonly 'location': M_Source
}

export type Reference_To_Normal_Dictionary_Entry<M_Source, T_Dictionary_Entry> = {
    readonly 'key': string
    readonly 'location': M_Source
}

export type Reference_To_Stacked_Dictionary_Entry<M_Source, T_Dictionary_Entry> = {
    readonly 'key': string
    readonly 'location': M_Source
}

export type State_Group<M_Source, T_SG> = {
    readonly 'location': M_Source
    readonly 'state group': T_SG
}
