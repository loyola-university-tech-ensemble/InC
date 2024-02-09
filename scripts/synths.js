/** 
* Make a synth library interface with Tone.js and P5.js
* August 2, 2023
*/
//let synthPromise = loadSynthData("synths.json");

//Global array of synths
var synthLibrary = [
  {
    name: "Basic Synth",
    type: "Synth",
    settings: {},
    polyphonic: true
  },
  {
    name: "FM Synth",
    type: "FMSynth",
    settings: {},
    polyphonic: true
  },
  {
    name: "AM Synth",
    type: "AMSynth",
    settings: {},
    polyphonic: true
  },
  {
    name: "Drums",
    type: "Sampler",
    polyphonic: false,
    settings: {
      urls: {
        "A3": "drums/Kick.wav",
        "A#3": "drums/Kick.wav",
        "B3": "drums/Snare.wav",
        "C4": "drums/Claps.wav",
        "C#4": "drums/Shot1.wav",
        "D#4": "drums/Shot2.wav",
        "D4": "drums/WhiteNoise.wav",
        "E4": "drums/ReverseCymbal.wav",
        "F4": "drums/HiHat_Closed.wav",
        "F#4": "drums/HiHat_Open.wav"
      }
    }
  }
];

for(let i = 0; i < synthLibrary.length; i ++){
  makeSynths(synthLibrary[i]); // generate Tone synths for each entry
}

function makeSynths(obj){
  if(obj.hasOwnProperty("type")){
    switch (obj.type){
      case "Sampler":
        console.log("make a new Sampler: " + obj.name);
        obj.synth = new Tone.Sampler(obj.settings).toDestination();
        break;
      case "FMSynth":
        console.log("make a new FM Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.FMSynth).toDestination();
        obj.synth.set(obj.settings);
        break;
      case "AMSynth":
        console.log("make a new AM Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.AMSynth).toDestination();
        obj.synth.set(obj.settings);
        break;
      case "PluckSynth":
        console.log("make a new Plucked Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.PluckSynth).toDestination();
        obj.synth.set(obj.settings);
        break;
      default :
        console.log("make a new Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        obj.synth.set(obj.settings);   
    }
  }
}

/**
 * synth and drumSampler are the current default instruments
 */
// Create a default instrument (sequences and markov)
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
// Create a default instrument

/**Define a default polyphonic drum sampler */
const drumSampler = new Tone.Sampler(
  {
    urls: {
      "A3": "drums/Kick.wav",
      "A#3": "drums/Kick.wav",
      "B3": "drums/Snare.wav",
      "C4": "drums/Claps.wav",
      "C#4": "drums/Shot1.wav",
      "D#4": "drums/Shot2.wav",
      "D4": "drums/WhiteNoise.wav",
      "E4": "drums/ReverseCymbal.wav",
      "F4": "drums/HiHat_Closed.wav",
      "F#4": "drums/HiHat_Open.wav"
    },
  }
).toDestination();

