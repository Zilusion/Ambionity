<script lang="ts">
	import campfireSound from '$lib/assets/sounds/campfire.mp3';
	import { onMount } from 'svelte';

	let audioElement: HTMLAudioElement;
	let audioContext: AudioContext | null = null;
	let gainNode: GainNode | null = null;
	let panNode: StereoPannerNode | null = null;
	const panOptions: StereoPannerOptions = { pan: 0 };

	let isPlaying = $state(false);
	let volume: number = $state(1);
	let pan: number = $state(0);

	onMount(() => {
		audioContext = new AudioContext();
		const track = audioContext.createMediaElementSource(audioElement);
		gainNode = new GainNode(audioContext);
		panNode = new StereoPannerNode(audioContext, panOptions);
		track.connect(gainNode).connect(panNode).connect(audioContext.destination);

		return () => {
			audioContext?.close();
		};
	});

	function handleClick() {
		if (!audioContext) return;
		if (audioContext.state === 'suspended') {
			audioContext.resume();
		}

		if (!isPlaying) {
			audioElement.play();
			isPlaying = true;
		} else {
			audioElement.pause();
			isPlaying = false;
		}
	}

	function handleEnded() {
		isPlaying = false;
	}

	$effect(() => {
		if (!gainNode) return;
		gainNode.gain.value = volume;
	});

	$effect(() => {
		if (!panNode) return;
		panNode.pan.value = pan;
	});
</script>

<audio bind:this={audioElement} src={campfireSound} onended={handleEnded}></audio>
<button onclick={handleClick} data-playing={isPlaying} role="switch" aria-checked={isPlaying}>
	<span>{isPlaying ? 'Pause' : 'Play'}</span>
</button>
<input bind:value={volume} type="range" name="volume" id="volume" min="0" max="2" step="0.01" />
<input bind:value={pan} type="range" name="pan" id="pan" min="-1" max="1" step="0.01" />
<p>{volume}</p>
<p>{pan}</p>
