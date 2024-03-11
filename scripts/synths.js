/** 
* Make a synth library interface with Tone.js and P5.js
* August 2, 2023
*/
//let synthPromise = loadSynthData("synths.json");

// master gain node
const gainNode = new Tone.Gain(1).toDestination();
const vSlider = document.getElementById("volume");
vSlider.addEventListener('input', (e)=>{
  let vol = e.target.value;
  console.log(vol)
  gainNode.gain.rampTo(vol, .01);
  console.log(gainNode.gain.value);
});

//Global array of synths
var synthLibrary = [
  {
    name: "Synth 1",
    type: "Synth",
    settings: {
      "volume": 0, 
      "detune": 0,
      "portamento": 0.05,
      "envelope": {
        "attack": 0.005,
        "attackCurve": "linear",
        "decay": 0.1,
        "decayCurve": "exponential",
        "release": 1,
        "releaseCurve": "exponential",
        "sustain": 0.3
      },
      "oscillator": {
        "partialCount": 0,
        "partials": [],
        "phase": 0,
        "type": "triangle",
        "harmonicity": 1,
        "modulationType": "square",
        "count" : 3,
        "modulationFrequency" : 0.4,
        "modulationIndex": 2,
        "spread": 20,
        "width":0.2
      }
    },
    polyphonic: true
  },
  {
    name: "Squarinet",
    type: "Synth",
    settings:{
      "volume": -6,
      "detune": 0,
      "portamento": 0,
      "envelope": {
        "attack": 0.05,
        "attackCurve": "exponential",
        "decay": 0.2,
        "decayCurve": "exponential",
        "release": 1.5,
        "releaseCurve": "exponential",
        "sustain": 0.2
      },
      "oscillator": {
        "partialCount": 7,
        "partials": [
          1.2732395447351628,
          0,
          0.4244131815783876,
          0,
          0.25464790894703254,
          0,
          0.18189136353359467
        ],
        "phase": 0,
        "type": "square7"
      }
    },
    polyphonic: true
  },
  {
    name: "FM Brass",
    type: "FMSynth",
    settings: {
      "volume": 0,
      "detune": 0,
      "portamento": 0,
      "harmonicity": 1,
      "oscillator": {
        "partialCount": 0,
        "partials": [],
        "phase": 0,
        "type": "sine"
      },
      "envelope": {
        "attack": 0.01,
        "attackCurve": "linear",
        "decay": 0.2,
        "decayCurve": "exponential",
        "release": 0.6,
        "releaseCurve": "exponential",
        "sustain": 0.8
      },
      "modulation": {
        "partialCount": 0,
        "partials": [],
        "phase": 0,
        "type": "sine"
      },
      "modulationEnvelope": {
        "attack": 0.5,
        "attackCurve": "exponential",
        "decay": 0.01,
        "decayCurve": "exponential",
        "release": 0.5,
        "releaseCurve": "exponential",
        "sustain": 1
      },
      "modulationIndex": 10
    },
    polyphonic: true
  },
  {
    name: "Doorbell", //Finneas Bujdei 2024 (COMP 122)
    type: "Synth",
    settings: {
      "detune": "1200",
      "portamento": "0.5",
      "volume": "-11",
      "oscillator": {
        "type": "sine",
        "phase": 0,
        "partialCount": "0",
        "partials": []
      },
      "envelope": {
        "attack": "0.01",
        "attackCurve": "exponential",
        "decay": "0.1",
        "decayCurve": "exponential",
        "sustain": "0.5",
        "release": "1",
        "releaseCurve": "linear"
      }
    },
    polyphonic: true
  }, 
  {
    name : "New Wave", // Chris Diaz 2024 (COMP 122)
    type : "Synth",
    settings : {
      "volume": -6,
      "detune": -3,
      "portamento": 0,
      "envelope": {
        "attack": 0.01,
        "attackCurve": "ripple",
        "decay": 0.5,
        "decayCurve": "linear",
        "release": 1,
        "releaseCurve": "ripple",
        "sustain": 0.5
      },
      "oscillator": {
        "partialCount": 3,
        "partials": [
          0.39,
          0.53,
          0.67
        ],
        "phase": 0,
        "type": "fatcustom",
        "count": 3,
        "spread": 20
      }
    },
    polyphonic: true
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
        obj.synth = new Tone.Sampler(obj.settings).connect(gainNode);
        break;
      case "FMSynth":
        console.log("make a new FM Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.FMSynth).connect(gainNode);
        obj.synth.set(obj.settings);
        break;
      case "AMSynth":
        console.log("make a new AM Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.AMSynth).connect(gainNode);
        obj.synth.set(obj.settings);
        break;
      case "PluckSynth":
        console.log("make a new Plucked Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.PluckSynth).connect(gainNode);
        obj.synth.set(obj.settings);
        break;
      default :
        console.log("make a new Synth: " + obj.name);
        obj.synth = new Tone.PolySynth(Tone.Synth).connect(gainNode);
        obj.synth.set(obj.settings);   
    }
  }
}

/**
 * synth and drumSampler are the current default instruments
 */
// Create a default instrument (sequences)
const defaultSynth = new Tone.PolySynth(Tone.Synth);
defaultSynth.connect(gainNode);

console.log("sequence array: " + sketches.length);
for(let i = 0; i < sketches.length; i++){
   sketches[i].setSynth(synthLibrary[0].synth);
}

//set up synth selector menu
const synthMenu = document.getElementById("synth-selector");
for(let i = 0; i < synthLibrary.length; i++){
  let opt = document.createElement("option");
  opt.value = i;
  opt.text = synthLibrary[i].name;
  synthMenu.add(opt);
}

synthMenu.addEventListener("change", (e)=>{
  let s = synthLibrary[e.target.value].synth;
  console.log("Synth " + e.target.value)
  for(let i = 0; i < sketches.length; i++){
    sketches[i].setSynth(s); // set all the synths
  }
})

/** Define a default polyphonic drum sampler for click */
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