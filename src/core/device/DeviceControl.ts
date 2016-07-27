import AbstractCollectionItem from '../../helpers/AbstractCollectionItem';
import Midi from '../../helpers/Midi';
import AbstractDevice from './AbstractDevice';


export default class DeviceControl extends AbstractCollectionItem {
    device: AbstractDevice;
    midiInIndex: number;
    midiOutIndex: number;
    midiIn: api.MidiIn;
    midiOut: api.MidiOut;
    status: number;
    data1: number;
    data2: number;

    constructor(device: AbstractDevice, midiInIndex: number, midiOutIndex: number, midi: Midi) {
        super();
        this.device = device;
        this.midiInIndex = midiInIndex;
        this.midiOutIndex = midiOutIndex;
        this.midiIn = host.getMidiInPort(midiInIndex);
        this.midiOut = host.getMidiOutPort(midiOutIndex);
        this.status = midi.status;
        this.data1 = midi.data1;
        this.data2 = midi.data2;
    }
}
