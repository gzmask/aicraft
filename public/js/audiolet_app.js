window.onload = function() {
	var Synth = function(audiolet, frequency){
		AudioletGroup.apply(this, [audiolet,0,1]);
		this.sine = new Sine(this.audiolet, frequency);
        this.modulator = new Saw(this.audiolet, 2 * frequency);
        this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);
        this.modulator.connect(this.modulatorMulAdd);
        this.modulatorMulAdd.connect(this.sine);
		this.gain = new Gain(this.audiolet);
		//Attack release
        this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.2, 0.5,
            function() {
                this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
            }.bind(this)
        );
        this.modulator.connect(this.modulatorMulAdd);
        this.modulatorMulAdd.connect(this.sine);
        this.envelope.connect(this.gain, 0, 1);
        this.sine.connect(this.gain);
        this.gain.connect(this.outputs[0]);
	};
	extend(Synth, AudioletGroup);

	var C_pattern = new PSequence(
			[
			Note.fromLatin('C4').frequency(), 
			Note.fromLatin('E4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('C4').frequency(), 
			Note.fromLatin('E4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('E4').frequency(), 
			Note.fromLatin('C4').frequency(), 
			], 1/*repeat times*/);

	var G7_pattern = new PSequence(
			[
			Note.fromLatin('B3').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('B3').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('B3').frequency(), 
			], 1/*repeat times*/);

	var Am_pattern = new PSequence(
			[
			Note.fromLatin('A3').frequency(), 
			Note.fromLatin('E4').frequency(), 
			Note.fromLatin('A4').frequency(), 
			Note.fromLatin('E3').frequency(), 
			Note.fromLatin('E4').frequency(), 
			Note.fromLatin('A4').frequency(), 
			Note.fromLatin('E4').frequency(), 
			Note.fromLatin('A3').frequency(), 
			], 1/*repeat times*/);

	var F_pattern = new PSequence(
			[
			Note.fromLatin('F3').frequency(), 
			Note.fromLatin('C4').frequency(), 
			Note.fromLatin('F4').frequency(), 
			Note.fromLatin('A4').frequency(), 
			Note.fromLatin('A4').frequency(), 
			Note.fromLatin('C4').frequency(), 
			Note.fromLatin('F4').frequency(), 
			Note.fromLatin('C4').frequency(), 
			], 1/*repeat times*/);

	var G_pattern = new PSequence(
			[
			Note.fromLatin('G3').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('G3').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('G3').frequency(), 
			], 1/*repeat times*/);

	var Em7_pattern = new PSequence(
			[
			Note.fromLatin('B3').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('B3').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('D3').frequency(), 
			Note.fromLatin('B3').frequency(), 
			], 1/*repeat times*/);

	var GFC_pattern = new PSequence(
			[
			Note.fromLatin('G3').frequency(), 
			Note.fromLatin('D4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('B4').frequency(), 
			Note.fromLatin('F3').frequency(), 
			Note.fromLatin('C4').frequency(), 
			Note.fromLatin('F4').frequency(), 
			Note.fromLatin('A4').frequency(), 
			Note.fromLatin('C4').frequency(), 
			Note.fromLatin('E4').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('C5').frequency(), 
			Note.fromLatin('C5').frequency(), 
			Note.fromLatin('G4').frequency(), 
			Note.fromLatin('E4').frequency(), 
			], 1/*repeat times*/);


	var durationPattern = new PSequence([1], 1/*repeat times*/);

	var prelude_pattern = new PSequence([C_pattern, G7_pattern, Am_pattern, F_pattern, C_pattern, Em7_pattern, GFC_pattern], 1);
	var part1_pattern = new PSequence([
			C_pattern, G7_pattern, 
			Am_pattern, C_pattern, 
			C_pattern, Am_pattern, 
			F_pattern, G_pattern,
			C_pattern, G7_pattern,
			Am_pattern, F_pattern,
			C_pattern, Em7_pattern, GFC_pattern,
			], 99);

	var song_pattern = new PSequence([prelude_pattern, part1_pattern],1);

	//simple pattern
	var AudioletAppSimple = function() {
		this.audiolet = new Audiolet();
		this.audiolet.scheduler.setTempo(120);
		this.c2Frequency = 65.4064;
        this.scale = new MajorScale();
		this.audiolet.scheduler.play([song_pattern], 0.7,
		  function(frequency) {
			  var synth = new Synth(this.audiolet, frequency);
			  synth.connect(this.audiolet.output);
		  }.bind(this)
		);
	};

    this.audioletApp = new AudioletAppSimple();
	

};


