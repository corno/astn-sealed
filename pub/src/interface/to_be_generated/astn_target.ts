import * as _pi from 'pareto-core-interface'

// **** TYPES

export type Document = Value

export type Value = 
    | readonly ['dictionary', _pi.Dictionary<Value>]
    | readonly ['list', _pi.List<Value>]
    | readonly ['nothing', null]
    | readonly ['optional', 
        | readonly ['not set', null]
        | readonly ['set', Value]
    ]
    | readonly ['state', {
        readonly 'state': string
        readonly 'value': Value
    }]
    | readonly ['text', {
        readonly 'delimiter': 
            | readonly ['backtick', null]
            | readonly ['none', null]
            | readonly ['quote', null]
        
        readonly 'value': string
    }]
    | readonly ['verbose group', _pi.Dictionary<Value>]



// **** ALIASES FOR NESTED TYPE WITH PREFIXED ROOT NAMES

export namespace Document {
}

export namespace Value {
    
    export namespace SG {
        
        export namespace concise_group {
            
            export namespace L {
            }
            export type L = Value
        }
        export type concise_group = _pi.List<Value>
        
        export namespace dictionary {
            
            export namespace D {
            }
            export type D = Value
        }
        export type dictionary = _pi.Dictionary<Value>
        
        export namespace list {
            
            export namespace L {
            }
            export type L = Value
        }
        export type list = _pi.List<Value>
        export type nothing = null
        
        export namespace optional {
            
            export namespace SG {
                export type not_set = null
                
                export namespace _set {
                }
                export type _set = Value
            }
            export type SG = 
                | readonly ['not set', null]
                | readonly ['set', Value]
        }
        export type optional = 
            | readonly ['not set', null]
            | readonly ['set', Value]
        
        
        export namespace state {
            export type state = string
            
            export namespace value {
            }
            export type value = Value
        }
        export type state = {
            readonly 'state': string
            readonly 'value': Value
        }
        
        export namespace text {
            
            export namespace delimiter {
                
                export namespace SG {
                    export type backtick = null
                    export type none = null
                    export type quote = null
                }
                export type SG = 
                    | readonly ['backtick', null]
                    | readonly ['none', null]
                    | readonly ['quote', null]
            }
            export type delimiter = 
                | readonly ['backtick', null]
                | readonly ['none', null]
                | readonly ['quote', null]
            
            export type value = string
        }
        export type text = {
            readonly 'delimiter': 
                | readonly ['backtick', null]
                | readonly ['none', null]
                | readonly ['quote', null]
            
            readonly 'value': string
        }
        
        export namespace verbose_group {
            
            export namespace D {
            }
            export type D = Value
        }
        export type verbose_group = _pi.Dictionary<Value>
    }
    export type SG = 
        | readonly ['concise group', _pi.List<Value>]
        | readonly ['dictionary', _pi.Dictionary<Value>]
        | readonly ['list', _pi.List<Value>]
        | readonly ['nothing', null]
        | readonly ['optional', 
            | readonly ['not set', null]
            | readonly ['set', Value]
        ]
        | readonly ['state', {
            readonly 'state': string
            readonly 'value': Value
        }]
        | readonly ['text', {
            readonly 'delimiter': 
                | readonly ['backtick', null]
                | readonly ['none', null]
                | readonly ['quote', null]
            readonly 'value': string
        }]
        | readonly ['verbose group', _pi.Dictionary<Value>]
}