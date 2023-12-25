// Create a default instrument (sequences and markov)
const synth = new Tone.PolySynth(Tone.Synth).toDestination();

/**Define a polyphonic sampler */
const drumSampler = new Tone.Sampler(
  {
    urls : {
      "A3" : "drums/Kick.wav",
      "A#3" : "drums/Kick.wav",
      "B3" : "drums/Snare.wav",
      "C4" : "drums/Claps.wav",
      "C#4" : "drums/Shot1.wav",
      "D#4" : "drums/Shot2.wav",
      "D4" : "drums/WhiteNoise.wav",
      "E4" : "drums/ReverseCymbal.wav",
      "F4" : "drums/HiHat_Closed.wav",
      "F#4" : "drums/drums/HiHat_Open.wav"
    },
  }
).toDestination(); 

