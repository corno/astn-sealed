import * as _pds from 'pareto-core-deserializer'
import * as _pinternals from 'pareto-core-internals'
import * as _pi from 'pareto-core-interface'

import * as d_token from "../../interface/to_be_generated/token"
import * as d_parse_astn_source from "../../interface/to_be_generated/parse_astn_source"

import { Deprecated_String_Iterator } from "../temp/string_iterator"
import { My_Lexer_Error } from "./astn_parse_generic"
import { is_control_character } from '../temp/string_iterator'

import { $$ as op_parse_hexadecimal } from "pareto-standard-operations/dist/implementation/manual/primitives/integer/deserializers/hexadecimal"

//this file contains the tokenizer functionality, each functoin return a type from the 'token' schema

const WhitespaceChars = {
    tab: 0x09,                  // \t
    line_feed: 0x0A,            // \n
    carriage_return: 0x0D,      // \r
    space: 0x20,                //
    comma: 0x2C,                // ,
}

export const temp_throw_lexer_error = (
    type: d_parse_astn_source.Lexical_Error,
    range: d_token.Range,
    abort: ($: My_Lexer_Error) => never
): never => {
    return abort({
        'type': type,
        'range': range,
    })
}


export const Whitespace = (
    iterator: Deprecated_String_Iterator,
    abort: ($: My_Lexer_Error) => never,
): d_token.Whitespace => {

    const start = iterator['create location info']()
    return {
        'value': _pds.text.build(($i) => {
            while (true) {


                {
                    const $ = iterator['get current character']()
                    if ($ === null) {
                        return
                    }
                    if (is_control_character($)) {
                        return temp_throw_lexer_error(
                            ['unexpected control character', $],
                            {

                                'start': iterator['create location info'](),
                                'end': iterator['create location info'](),
                                'uri': iterator['get uri'](),
                            },
                            abort,
                        )

                    }
                    switch ($) {
                        case 0x09: // \t
                            iterator['consume character']()
                            $i['add character']($)
                            break
                        case 0x0A: // \n
                            iterator['consume character']()
                            $i['add character']($)
                            break
                        case 0x0D: // \r
                            iterator['consume character']()
                            $i['add character']($)
                            break
                        case 0x20: // space
                            iterator['consume character']()
                            $i['add character']($)
                            break
                        case 0x2C: // ,
                            iterator['consume character']()
                            $i['add character']($)
                            break
                        default:
                            return

                    }
                }
            }
        }),
        'range': {
            'start': start,
            'end': iterator['create location info'](),
            'uri': iterator['get uri'](),
        }
    }
}

export const Trivia = (
    iterator: Deprecated_String_Iterator,
    abort: ($: My_Lexer_Error) => never,
): d_token.Trivia => {

    return {
        'leading whitespace': Whitespace(iterator, abort),
        'comments': _pds.list.build(($i) => {
            while (true) {
                const $ = iterator['get current character']()
                if ($ === null) {
                    return //normal end of input
                }
                switch ($) {
                    case 0x2F: // /
                        const start = iterator['create location info']()
                        const next_char = iterator['look ahead'](1)
                        if (next_char === null) {
                            const start = iterator['create location info']()
                            iterator['consume character']()
                            const end = iterator['create location info']()
                            return temp_throw_lexer_error(
                                ['dangling slash', null],
                                {
                                    'start': start,
                                    'end': end,
                                    'uri': iterator['get uri'](),
                                },
                                abort,
                            )
                        }
                        switch (next_char) {
                            case 0x2F: // /
                                iterator['consume character']() // consume the first /
                                iterator['consume character']() // consume the second /
                                const Character = {
                                    line_feed: 0x0A,            // \n
                                    carriage_return: 0x0D,      // \r
                                    solidus: 0x2F,              // /
                                }
                                $i['add element']({
                                    'type': ['line', null],
                                    'content': _pds.text.build(($i) => {
                                        while (true) {
                                            const $ = iterator['get current character']()
                                            if ($ === null) {
                                                return
                                            }
                                            switch ($) {
                                                case Character.line_feed:
                                                    return
                                                case Character.carriage_return:
                                                    return
                                                default:
                                                    iterator['consume character']()
                                                    $i['add character']($)
                                            }
                                        }
                                    }),
                                    'range': {
                                        'start': start,
                                        'end': iterator['create location info'](),
                                        'uri': iterator['get uri'](),
                                    },
                                    'trailing whitespace': Whitespace(iterator, abort)
                                })
                                break
                            case 0x2A: {// *
                                iterator['consume character']() // consume the first /
                                iterator['consume character']() // consume the asterisk
                                $i['add element']({
                                    'type': ['block', null],
                                    'content': _pds.text.build(($i) => {
                                        let found_asterisk = false
                                        const Character = {
                                            solidus: 0x2F,              // /
                                            asterisk: 0x2A,             // *
                                        }
                                        while (true) {
                                            const $ = iterator['get current character']()
                                            if ($ === null) {
                                                return temp_throw_lexer_error(
                                                    ['unterminated block comment', null],
                                                    {
                                                        'start': start,
                                                        'end': iterator['create location info'](),
                                                        'uri': iterator['get uri'](),
                                                    },
                                                    abort,
                                                )
                                            }
                                            if ($ === Character.solidus && found_asterisk) {
                                                iterator['consume character']() // consume the solidus
                                                //found asterisk before solidus, so this is the end of the comment
                                                return
                                            }
                                            //not a solidus, so this is part of the comment
                                            if (found_asterisk) {
                                                $i['add character'](Character.asterisk) // add the asterisk that was found before but was not part of the end delimiter
                                            }
                                            if ($ === Character.asterisk) {
                                                found_asterisk = true
                                            } else {
                                                $i['add character']($)
                                            }
                                            iterator['consume character']()
                                        }
                                    }),
                                    'range': {
                                        'start': start,
                                        'end': iterator['create location info'](),
                                        'uri': iterator['get uri'](),
                                    },
                                    'trailing whitespace': Whitespace(iterator, abort)
                                })
                                break
                            }
                            default:
                                return temp_throw_lexer_error(
                                    ['dangling slash', null],
                                    {
                                        'start': start,
                                        'end': iterator['create location info'](),
                                        'uri': iterator['get uri'](),
                                    },
                                    abort,
                                )
                        }
                        break
                    default:
                        return
                }
            }
        })
    }
}

export const Annotated_Token = (
    iterator: Deprecated_String_Iterator,
    abort: ($: My_Lexer_Error) => never,
): d_token.Annotated_Token => {
    const $ = iterator['get current character']()
    if ($ === null) {
        return temp_throw_lexer_error(
            ['unexpected end of input', null],
            {
                'start': iterator['create location info'](),
                'end': iterator['create location info'](),
                'uri': iterator['get uri'](),
            },
            abort,
        )
    }
    return {
        'start': iterator['create location info'](),
        'type': _pds.block((): d_token.Token_Type => {

            const Character = {

                open_angle_bracket: 0x3C, // <
                open_brace: 0x7B,           // {
                open_bracket: 0x5B,         // [
                open_paren: 0x28,          // (

                close_angle_bracket: 0x3E, // >
                close_brace: 0x7D,          // }
                close_bracket: 0x5D,        // ]
                close_paren: 0x29,         // )

                apostrophe: 0x27,          // '
                asterisk: 0x2A,            // *
                at: 0x40,                  // @
                backtick: 0x60,            // `
                bang: 0x21,
                colon: 0x3A,                // :
                pipe: 0x7C,                // |
                quotation_mark: 0x22,       // "
                slash: 0x2F,               // /
                tilde: 0x7E,               // ~
                hash: 0x23,                // #

                space: 0x20,               // space
                tab: 0x09,                 // \t

            }
            switch ($) {
                case Character.open_brace:
                    iterator['consume character']()
                    return ['{', null]
                case Character.open_bracket:
                    iterator['consume character']()
                    return ['[', null]
                case Character.open_angle_bracket:
                    iterator['consume character']()
                    return ['<', null]
                case Character.open_paren:
                    iterator['consume character']()
                    return ['(', null]


                case Character.close_brace:
                    iterator['consume character']()
                    return ['}', null]
                case Character.close_bracket:
                    iterator['consume character']()
                    return [']', null]
                case Character.close_angle_bracket:
                    iterator['consume character']()
                    return ['>', null]
                case Character.close_paren:
                    iterator['consume character']()
                    return [')', null]

                //individuals
                case Character.hash:
                    iterator['consume character']()
                    return ['#', null]
                case Character.pipe:
                    iterator['consume character']()
                    return ['|', null]
                case Character.tilde:
                    iterator['consume character']()
                    return ['~', null]
                case Character.asterisk:
                    iterator['consume character']()
                    return ['*', null]
                case Character.at:
                    iterator['consume character']()
                    return ['@', null]
                case Character.bang:
                    iterator['consume character']()
                    return ['!', null]
                case Character.colon:
                    iterator['consume character']()
                    return [':', null]
                case Character.quotation_mark:
                    iterator['consume character']()
                    return ['string', {
                        'value': Delimited_String(
                            iterator,
                            abort,
                            {
                                'allow_newlines': true,
                                'is_end_character': ($) => $ === Character.quotation_mark
                            }
                        ),
                        'type': ['quoted', null],
                    }]
                case Character.backtick:
                    iterator['consume character']()
                    return ['string', {
                        'value': Delimited_String(
                            iterator,
                            abort,
                            {
                                'allow_newlines': false,
                                'is_end_character': ($) => $ === Character.backtick
                            }
                        ),
                        'type': ['backticked', null],
                    }]
                case Character.apostrophe:
                    iterator['consume character']()
                    return ['string', {
                        'value': Delimited_String(
                            iterator,
                            abort,
                            {
                                'allow_newlines': false,
                                'is_end_character': ($) => $ === Character.apostrophe
                            }
                        ),
                        'type': ['apostrophed', null],
                    }]

                default:
                    return ['string', {
                        'type': ['undelimited', null],
                        'value': _pds.text.build(($i) => {
                            while (true) {
                                const $ = iterator['get current character']()
                                if ($ === null) {
                                    return
                                }

                                if (is_control_character($)) {
                                    temp_throw_lexer_error(
                                        ['unexpected control character', $],
                                        {
                                            'start': iterator['create location info'](),
                                            'end': iterator['create location info'](),
                                            'uri': iterator['get uri'](),
                                        },
                                        abort
                                    )

                                }
                                if (
                                    $ === Character.open_brace ||
                                    $ === Character.close_brace ||
                                    $ === Character.open_bracket ||
                                    $ === Character.close_bracket ||
                                    $ === Character.open_angle_bracket ||
                                    $ === Character.close_angle_bracket ||
                                    $ === Character.open_paren ||
                                    $ === Character.close_paren ||
                                    $ === Character.apostrophe ||
                                    $ === Character.asterisk ||
                                    $ === Character.at ||
                                    $ === Character.backtick ||
                                    $ === Character.bang ||
                                    $ === Character.colon ||
                                    $ === Character.pipe ||
                                    $ === Character.quotation_mark ||
                                    $ === Character.slash ||
                                    $ === Character.tilde ||
                                    $ === WhitespaceChars.comma ||
                                    $ === WhitespaceChars.space ||
                                    $ === WhitespaceChars.tab ||
                                    $ === WhitespaceChars.line_feed ||
                                    $ === WhitespaceChars.carriage_return
                                ) {
                                    return
                                }
                                iterator['consume character']()
                                $i['add character']($)
                            }
                        }),
                    }]
            }
        }),
        'end': iterator['create location info'](),
        'uri': iterator['get uri'](),
        'trailing trivia': Trivia(iterator, abort),
    }
}

export const Delimited_String = (
    iterator: Deprecated_String_Iterator,
    abort: ($: My_Lexer_Error) => never,
    $p: {
        is_end_character: (character: number) => boolean,
        allow_newlines: boolean,
    }
): d_token.Delimited_String => {

    const Character = {
        backspace: 0x08,            // \b
        form_feed: 0x0C,            // \f
        tab: 0x09,                  // \t
        line_feed: 0x0A,            // \n
        carriage_return: 0x0D,      // \r
        quotation_mark: 0x22,       // "
        backtick: 0x60,             // `
        apostrophe: 0x27,           // '
        reverse_solidus: 0x5C,      // \
        solidus: 0x2F,              // /
        a: 0x61,                    // a
        b: 0x62,                    // b
        f: 0x66,                    // f
        n: 0x6E,                    // n
        r: 0x72,                    // r
        t: 0x74,                    // t
        u: 0x75,                    // u
        A: 0x41,                    // A
        F: 0x46,                    // F

    }
    const start = iterator['create location info']()
    const txt = _pds.text.build(($i) => {
        while (true) {
            const $ = iterator['get current character']()
            if ($ === null) {

                return temp_throw_lexer_error(
                    ['unterminated string', null],
                    {
                        'start': start,
                        'end': iterator['create location info'](),
                        'uri': iterator['get uri'](),
                    },
                    abort,
                )
            }
            if (is_control_character($)) {
                temp_throw_lexer_error(
                    ['unexpected control character', $],
                    {
                        'start': iterator['create location info'](),
                        'end': iterator['create location info'](),
                        'uri': iterator['get uri'](),
                    },
                    abort,
                )

            }
            if ($p.is_end_character($)) {
                iterator['consume character']() // consume the end character
                return
            }
            switch ($) {
                case Character.line_feed:
                case Character.carriage_return:
                    if (!$p.allow_newlines) {
                        return temp_throw_lexer_error(
                            ['unexpected end of line in delimited string', null],
                            {
                                'start': start,
                                'end': iterator['create location info'](),
                                'uri': iterator['get uri'](),
                            },
                            abort
                        )
                    }
                    iterator['consume character']()
                    $i['add character']($)
                    break
                case Character.reverse_solidus: // \ (escape)
                    iterator['consume character']()
                    {
                        const $ = iterator['get current character']()
                        if ($ === null) {
                            return temp_throw_lexer_error(
                                ['missing character after escape', null],
                                {
                                    'start': start,
                                    'end': iterator['create location info'](),
                                    'uri': iterator['get uri'](),
                                },
                                abort,
                            )
                        }
                        switch ($) {
                            case Character.quotation_mark:
                                iterator['consume character']()
                                $i['add character'](Character.quotation_mark)
                                break
                            case Character.apostrophe:
                                iterator['consume character']()
                                $i['add character'](Character.apostrophe)
                                break
                            case Character.backtick:
                                iterator['consume character']()
                                $i['add character'](Character.backtick)
                                break
                            case Character.reverse_solidus:
                                iterator['consume character']()
                                $i['add character'](Character.reverse_solidus)
                                break
                            case Character.solidus:
                                iterator['consume character']()
                                $i['add character'](Character.solidus)
                                break
                            case Character.b:
                                iterator['consume character']()
                                $i['add character'](Character.backspace)
                                break
                            case Character.f:
                                iterator['consume character']()
                                $i['add character'](Character.form_feed)
                                break
                            case Character.n:
                                iterator['consume character']()
                                $i['add character'](Character.line_feed)
                                break
                            case Character.r:
                                iterator['consume character']()
                                $i['add character'](Character.carriage_return)
                                break
                            case Character.t:
                                iterator['consume character']()
                                $i['add character'](Character.tab)
                                break
                            case Character.u:
                                iterator['consume character']()
                                $i['add character'](op_parse_hexadecimal(_pds.text.build(($i) => {
                                    const get_char = () => {
                                        const char = iterator['get current character']()
                                        if (char === null) {
                                            return temp_throw_lexer_error(
                                                ['unterminated unicode escape sequence', null],
                                                {
                                                    'start': start,
                                                    'end': iterator['create location info'](),
                                                    'uri': iterator['get uri'](),
                                                },
                                                abort,
                                            )
                                        }
                                        if (char < Character.a || (char > Character.f && char < Character.A) || char > Character.F || char < 0x30 || char > 0x39) {
                                            return temp_throw_lexer_error(
                                                ['invalid unicode escape sequence', null],
                                                {
                                                    'start': start,
                                                    'end': iterator['create location info'](),
                                                    'uri': iterator['get uri'](),
                                                },
                                                abort,
                                            )
                                        }
                                        iterator['consume character']()
                                        return char
                                    }
                                    $i['add character'](get_char())
                                    $i['add character'](get_char())
                                    $i['add character'](get_char())
                                    $i['add character'](get_char())
                                }), () => _pinternals.panic(`unreachable`)))
                                break
                            default:
                                return temp_throw_lexer_error(
                                    ['unknown escape character', null],
                                    {
                                        'start': start,
                                        'end': iterator['create location info'](),
                                        'uri': iterator['get uri'](),
                                    },
                                    abort,
                                )
                        }
                    }
                    break
                default:
                    iterator['consume character']()
                    $i['add character']($)
            }
        }
    })
    return txt
}

export const Tokenizer_Result = (
    iterator: Deprecated_String_Iterator,
    abort: ($: My_Lexer_Error) => never,
): d_token.Tokenizer_Result => {
    return {
        'leading trivia': Trivia(iterator, abort),
        'tokens': _pds.list.build<d_token.Annotated_Token>($i => {
            while (iterator['get current character']() !== null) {

                const token = Annotated_Token(iterator, abort,)
                $i['add element'](token)
            }
        }),
        'end': iterator['create location info']()
    }
}