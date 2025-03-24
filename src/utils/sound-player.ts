import { GlobalSettings } from "../global/global-settings";

export class SoundPlayer {
	private audio: HTMLAudioElement;

	constructor(source: string) {
		this.audio = new Audio(source);
		this.audio.preload = 'auto';
		this.audio.loop = false;
	}

	private getEffectiveVolume(instanceVolume: number): number {
		const globalSettings = GlobalSettings.getInstance();
		const globalVolume = globalSettings.volume;
		const mute = globalSettings.mute;
		return mute ? 0 : (instanceVolume * globalVolume) / 10000;
	}
	

	public play(volume: number): void {
		this.audio.currentTime = 0;
		this.audio.volume = this.getEffectiveVolume(volume);
		this.audio
			.play()
			.catch((error) => console.error('Audio play error:', error));
	}

	public pause(): void {
		this.audio.pause();
	}

	public resume(volume: number): void {
		this.audio.volume = this.getEffectiveVolume(volume);
		this.audio
			.play()
			.catch((error) => console.error('Audio resume error:', error));
	}

	public setVolume(instanceVolume: number): void {
		this.audio.volume = this.getEffectiveVolume(instanceVolume);
	}
}
