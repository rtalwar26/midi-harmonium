import ToneFactory from '../../../lib/ToneFactory';

var comp = {
	onCreate: function () {
		this.state = {
		};
	},
	onMount: function () {
		let Tone = ToneFactory.Instance();
		this.piano = new Tone.Sampler({
			56: '100_Pa_B_harmonium1_1.mp3',
			58: '100_Dha_B_harmonium1_1.mp3',
			60: '100_Ni_B_harmonium1_1.mp3',
			61: '100_Sa_B_harmonium1_1.mp3',
			63: '100_Re_M_harmonium1_1.mp3',
			65: '100_Ga_M_harmonium1_1.mp3',
			66: '100_Ma_M_harmonium1_1.mp3',
			68: '100_Pa_M_harmonium1_1.mp3',
			70: '100_Dha_M_harmonium1_1.mp3',
			72: '100_Ni_M_harmonium1_1.mp3',
			73: '100_Sa_H_harmonium1_1.mp3',

		}, {
				'release': 1,
				'baseUrl': 'audio/harmonium/'
			}).toMaster();
	
		this.initiateMidiInput();
		
	},
	initiateMidiInput() {
		let mynavigator = (<any>navigator);
		if (mynavigator.requestMIDIAccess) {
			console.log('Browser supports MIDI!');
			if (mynavigator.requestMIDIAccess) {
				mynavigator.requestMIDIAccess()
					.then((midi) => {
						console.log('found midi', midi);

						var inputs = midi.inputs.values();
						console.log(inputs);
						for (var input = inputs.next();
							input && !input.done;
							input = inputs.next()) {
							// each time there is a midi message call the onMIDIMessage function
							input.value.onmidimessage = (message) => {
								console.log(message.data);
								if (message.data[0] === 144 && message.data[2] > 0) {
									this.playNote(message.data[1]);
								}

								if (message.data[0] === 128 || message.data[2] === 0) {
									this.stopNote(message.data[1]);
								}
							};

						}
					}, (err) => {
						console.log('midi err', err);
					});
			}
		}
	},
	playNote(note) {
		console.log('attack', note);
		let Tone = ToneFactory.Instance();

		this.piano.triggerAttack(new Tone.Frequency(note, "midi"));
	},
	stopNote(note) {
		console.log('release', note);
		let Tone = ToneFactory.Instance();
		this.piano.triggerRelease(new Tone.Frequency(note, "midi"),0.1);
	}


}
export = comp;