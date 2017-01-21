import { SimpleMidiMessage, default as MidiMessage } from '../midi/MidiMessage';
import host from '../../host';


export default class MidiControl {
    name: string;
    input: number;
    output: number;
    status: number;
    data1: number;
    data2: number;
    msb: string;
    lsb: string;
    patterns: string[];

    constructor(filter: string | {
        input?: number, output?: number,
        patterns?: string[],
        status?: number, data1?: number, data2?: number,
        msb?: string, lsb?: string
    }) {
        // set defaults
        let options = {
            input: 0, output: 0,
            patterns: [],
            status: undefined, data1: undefined, data2: undefined,
            msb: undefined, lsb: undefined,
        };

        // override defaults with provided constructor data
        if (typeof filter === 'string') {
            options = { ...options, patterns: [filter] };
        } else {
            options = {
                ...options, ...filter,
                // add msb and lb patterns to pattern list
                patterns: [
                    ...(filter.patterns || []),
                    ...(options.msb ? [options.msb] : []),
                    ...(options.lsb ? [options.lsb] : []),
                ],
            };
        }

        // verify pattern strings are valid
        for (let pattern of options.patterns) {
            if (!/[a-fA-F0-9\?]{6}/.test(pattern)) throw new Error(`Invalid midi pattern: "${pattern}"`);
        }

        // if there is only one pattern set status, data1, and/or data2 that can be pulled from it
        if (options.patterns.length === 1) {
            options = {
                ...options,
                ...this._getMidiFromPattern(options.patterns[0])
            };
        }

        // when no pattern is set, create a pattern from the provided data
        if (options.patterns.length === 0 && (options.status || options.data1 || options.data2)) {
            const { status, data1, data2 } = options;
            options = {
                ...options,
                patterns: [this._getPatternFromMidi({ status, data1, data2 })],
            };
        }

        // set object properties
        this.input = options.input;
        this.output = options.output;
        this.status = options.status;
        this.data1 = options.data1;
        this.data2 = options.data2;
        this.msb = options.msb;
        this.lsb = options.lsb;
        this.patterns = options.patterns;
    }

    private _getMidiFromPattern(pattern: string) {
        const status = pattern.slice(0, 2);
        const data1 = pattern.slice(2, 4);
        const data2 = pattern.slice(4, 6);

        return {
            status: status.indexOf('?') === -1 ? parseInt(status, 16): undefined,
            data1: data1.indexOf('?') === -1 ? parseInt(data1, 16): undefined,
            data2: data2.indexOf('?') === -1 ? parseInt(data2, 16): undefined,
        }
    }

    private _getPatternFromMidi({ status = undefined, data1 = undefined, data2 = undefined }: SimpleMidiMessage) {
        let result = '';
        for (let midiByte of [status, data1, data2]) {
            if (midiByte === undefined) {
                result = `${result}??`
            } else {
                let hexByteString = midiByte.toString(16).toUpperCase();
                if (hexByteString.length === 1) hexByteString = `0${hexByteString}`;
                result = `${result}${hexByteString}`;
            }
        }
        return result;
    }
}
