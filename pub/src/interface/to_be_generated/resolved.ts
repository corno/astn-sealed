import * as _pi from 'pareto-core-interface'


// **** TYPES

export type Derived_Reference<M_Source, T_Type> = T_Type

export type Dictionary<M_Source, T_D> = _pi.Dictionary<T_D>

export type List<M_Source, T_L> = _pi.List<T_L>

export type Ordered_Dictionary<M_Source, T_D> = {
    readonly 'dictionary': _pi.Dictionary<T_D>
    readonly 'ordered list': _pi.List<{
        readonly 'key': string
        readonly 'value': T_D
    }>
}

export type Reference_To_Circular_Dependent_Sibling<M_Source, T_Dictionary_Entry> = {
    readonly 'entry': _pi.Circular_Dependency<T_Dictionary_Entry>
    readonly 'key': string
}

export type Reference_To_Normal_Dictionary_Entry<M_Source, T_Dictionary_Entry> = {
    readonly 'entry': T_Dictionary_Entry
    readonly 'key': string
}

export type Reference_To_Stacked_Dictionary_Entry<M_Source, T_Dictionary_Entry> = {
    readonly 'entry': T_Dictionary_Entry
    readonly 'key': string
    readonly 'up steps': number
}

export type State_Group<M_Source, T_SG> = T_SG
