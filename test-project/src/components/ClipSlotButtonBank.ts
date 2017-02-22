import { AbstractButton, AbstractComponentSet, SimpleControl } from 'typewig';

import bitwig from 'apistore';


export abstract class AbstractClipSlotButton extends AbstractButton {
    index: number;
    clipLauncherSlotBank: API.ClipLauncherSlotBank;
    state = {
        color: undefined,
        isPlaying: false, isPlaybackQueued: false,
        isRecording: false, isRecordingQueued: false,
        hasContent: false,
    };

    renderControl(control: SimpleControl) {
        const { isPlaying, isPlaybackQueued, isRecording, isRecordingQueued, hasContent } = this.state;
        const value = isPlaying || isPlaybackQueued || isRecording || isRecordingQueued ? control.resolution - 1 : 0;
        const disabled = !hasContent && !isRecordingQueued ;
        const flashing = isPlaybackQueued || isRecordingQueued;
        const color = isRecordingQueued ? { r: 1, g: 0, b: 0 } : this.state.color;
        control.render({
            value, ...(color === undefined ? {} : { color }), disabled, flashing,
        });
    }

    onPress() {
        this.clipLauncherSlotBank.launch(this.index);
    }
}

export default class ClipSlotButtonBank extends AbstractComponentSet {
    clipLauncherSlotBank = bitwig.cursorTrack.clipLauncherSlotBank();

    onRegister() {
        this.clipLauncherSlotBank.addIsPlayingObserver((index, isPlaying) => {
            const subComponent = this._componentMap.components[index];
            if (subComponent) subComponent.setState({ ...subComponent.state, isPlaying });
        });
        this.clipLauncherSlotBank.addIsPlaybackQueuedObserver((index, isPlaybackQueued) => {
            const subComponent = this._componentMap.components[index];
            if (subComponent) subComponent.setState({ ...subComponent.state, isPlaybackQueued });
        });
        this.clipLauncherSlotBank.addIsRecordingObserver((index, isRecording) => {
            const subComponent = this._componentMap.components[index];
            if (subComponent) subComponent.setState({ ...subComponent.state, isRecording });
        });
        this.clipLauncherSlotBank.addIsRecordingQueuedObserver((index, isRecordingQueued) => {
            const subComponent = this._componentMap.components[index];
            if (subComponent) subComponent.setState({ ...subComponent.state, isRecordingQueued });
        });
        this.clipLauncherSlotBank.addColorObserver((index, r, g, b) => {
            const subComponent = this._componentMap.components[index];
            if (subComponent) subComponent.setState({ ...subComponent.state, color: { r, g, b } });
        });
        this.clipLauncherSlotBank.addHasContentObserver((index, hasContent) => {
            const subComponent = this._componentMap.components[index];
            if (subComponent) subComponent.setState({ ...subComponent.state, hasContent });
        });
        this.clipLauncherSlotBank.itemCount().addValueObserver(count => console.log(count));
    }

    getComponentClass(index: number) {
        const that = this;
        return class ClipSlotBankButton extends AbstractClipSlotButton {
            index = index;
            clipLauncherSlotBank = that.clipLauncherSlotBank;
        };
    }
}