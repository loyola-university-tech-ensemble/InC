var bpm = 126; // default tempo
var metro = "off"; // metronome state
var ostinato = "off"; // ostinato state

Tone.context.lookAhead = 0.5;

console.log("default tempo: " + bpm + " bpm");
Tone.Transport.bpm.value = bpm;


/**
 * load all the In C Patterns into the 'patterns' div
 */
var sketches = [];
let sequenceDiv = document.getElementById("patterns");
makeSeqConductor(InC_phrases);

function makeSeqConductor(obj){

  if(Array.isArray(obj)){
    for(let i = 0; i < obj.length; i++){
      //console.log(obj[i].name);

      let d = document.createElement('div');
      d.className = "pattern";
      d.id = "sequence_" + (i + 1);
      //console.log(d.id);
      sequenceDiv.appendChild(d);
      let sketch = new p5(seqGUI, d); // invoke p5 and add it to the div
      sketch.setObj(obj[i]); // hand a reference to the sequence to the sketch
      sketches.push(sketch); // add to a global array for later
    }

  }  
}

/**
 * Control vertical scrolling of sequence players
 */

//endScrolling(); // call endScrolling() when the page loads to enable the visible players

if ('onscrollend' in window) {
  sequenceDiv.onscrollend = endScrolling;
}
else {
  sequenceDiv.onscroll = event => {
    clearTimeout(window.scrollEndTimer)
    window.scrollEndTimer = setTimeout(endScrolling, 100)
  }
}

for(let i = 0; i < 4; i++){
  sketches[i].enable(); 
  // enable the first four by default
  // no scrolling required
}


function endScrolling(){
  let divTop = sequenceDiv.scrollTop;
  let divBottom = sequenceDiv.scrollTop + sequenceDiv.clientHeight;
  let seqDiv;
  //let s = 0;
  let npb = 0; //now playing button
  for(let i = 0; i < sketches.length; i++){
    seqDiv = document.getElementById("sequence_" + (i + 1));
    let top = seqDiv.offsetTop;
    if(top >= divTop - 5 && top <= divBottom - 5){
      console.log("sequence " + (i + 1) + " visible");
      sketches[i].enable();
      sequenceNum = i - npb; // locate the current top player for back/fwd buttons
      let box = document.getElementById("NPnumberBox_" + npb);
      box.innerText = (i + 1) + ".";
      // console.log("npb: " + npb);
      npb++; // keep track of how many are visible
    } else {
      sketches[i].reset();
      sketches[i].noLoop(); 
      sketches[i].disable();
    }
  }
}

//const ostSynth = new Tone.PolySynth(Tone.Synth).toDestination();
var ostLoop = new Tone.Part(function (time, value){
  ostSynth.triggerAttackRelease(value.note, "16n", time, value.vel);
}, ostPatterns[0].pattern);
ostLoop.loop = true;

const ostMenu = document.getElementById('ostMenu');
for(let i = 0; i < ostPatterns.length; i++){
  let opt = document.createElement("option");
  opt.value = i;
  opt.text = ostPatterns[i].name;
  ostMenu.add(opt);
}

ostMenu.addEventListener('change', (e) => {
  let i = e.target.value
  console.log(`Change ostinato to number ${i}`);
  ostLoop.dispose();
  ostLoop = new Tone.Part(function (time, value){
    ostSynth.triggerAttackRelease(value.note, "16n", time, value.vel);
  }, ostPatterns[i].pattern);
  ostLoop.loop = true;
  if(ostinato){
    ostLoop.start(getNextbeat()); // start on next quarter note
  }
});

const ostButton = document.getElementById("ostinato");
ostButton.addEventListener('click', startOstinato);
const transButton = document.getElementById("transport")
transButton.addEventListener('click', startTransport);

function startOstinato(){
  switch(ostinato){
    case "off":
      ostinato = "on";
      //console.log("ostinato " + ostinato);
      ostButton.style.background = '#e1a820'; 
      ostButton.style.color = '#5d0024';
      ostButton.innerText="Stop Ostinato";
      if(Tone.Transport.state == "stopped"){
        startTransport();
      }
      ostLoop.start(getNextbeat()); // start on next quarter note
      break;
    case "on":
      ostinato = "off";
      //console.log("ostinato " + ostinato);
      ostButton.style.background = '#a0144f';
      ostButton.style.color = '#febc17';
      ostButton.innerText="Start Ostinato";
      ostLoop.stop();
      break;
    default:
      Tone.Transport.start();
  }
}

function startTransport(){
    //make this function accessible from other buttons
    switch (Tone.Transport.state) {
      case "stopped":
        Tone.Transport.bpm.value = bpm;
        Tone.Transport.start();
        console.log("transport " + Tone.Transport.state);
        transButton.style.background = '#4caf50';
        transButton.innerHTML = "Stop Transport";
        break;
      case "started":
        Tone.Transport.stop();
        console.log("transport " + Tone.Transport.state);
        transButton.style.background = '#a8a8a8';
        transButton.innerHTML = "Start Transport";
        break;
      default:
        Tone.Transport.start();
    }
    // make sure synths are set correctly to default synth
    let menu = document.getElementById('synth-selector');
    menu.value = 0; // set the menu item
    menu.dispatchEvent(new Event('change')); // force the menu change event
  }

const clickLoop = new Tone.Loop((time) => {
	// triggered every quarter note.
	//console.log(time);
//  clickSampler.triggerAttackRelease("F4", "8n", time);
  beatsSampler.triggerAttackRelease("F4", "8n", time);
  //metroClick.triggerAttackRelease(500, "128n", time);
}, "4n");

const dbClickLoop = new Tone.Loop((time) => {
	// triggered every measure.
	//console.log(time);
  beatsSampler.triggerAttackRelease("A3", "8n", time);
  //metroClick.triggerAttackRelease(500, "128n", time);
}, "1m");

function startClick(){
    switch(metro){
    case "off":
      metro = "on";
      console.log("click " + metro);
      click.style.background = '#e1a820'; 
      click.style.color = '#5d0024';
      if(Tone.Transport.state == "stopped"){
        startTransport();
      }

      clickLoop.start(getNextbeat()); // start on next quarter note
      //dbClickLoop.start(getNextMeasure());
      break;
    case "on":
      metro = "off";
      console.log("click " + metro);
      click.style.background = '#a0144f';
      click.style.color = '#febc17';
      clickLoop.stop();
      dbClickLoop.stop();
      break;
    default:
      Tone.Transport.start();
  }
}

function getNextbeat(){
  let t = Tone.Transport.position;    
  let times = t.split(':');
  times[2] = 0; // set to downbeat;
  times[1] = Number(times[1]) + 1; // move up to the next downbeat;
  if (times[1] > 3) {
    times[1] = 0;
    times[0] = Number(times[0]) + 1;
  }
  t = times[0] + ":" + times[1] + ":" + times[2];
  return t;
}

function getNextMeasure(){
  let t = Tone.Transport.position;    
  let times = t.split(':');
  times[2] = 0; // set to downbeat;
  times[1] = 0; // set to beginning of measure
  times[0] = Number(times[0]) + 1; // move up to the next measure;
  t = times[0] + ":" + times[1] + ":" + times[2];
  return t;
}

/** Define a default polyphonic drum sampler for click */
const drumsGain = new Tone.Gain(1).toDestination();
const beatsSampler = new Tone.Sampler(
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
  ).connect(drumsGain);

const drumVolSlider = document.getElementById("beatVolume");
drumVolSlider.className = "drumVolSlider";
drumVolSlider.style = "padding: 20px;";
drumVolSlider.addEventListener('input', (e) => {
  drumsGain.gain.rampTo(e.target.value, 0.05);
});

const ostGain = new Tone.Gain(1).toDestination();
const ostreverb = new Tone.Reverb(0.5).connect(ostGain);
/** define a piano sampler for the ostinato */
const ostSynth = new Tone.Sampler({
  urls: {
    "C5" : "drums/piano-note-upright-dry_85bpm_A_major.wav"
  }
})
ostSynth.connect(ostreverb);

const ostVolSlider = document.getElementById("ostVolume");
ostVolSlider.style = "padding: 20px;";
ostVolSlider.addEventListener('input', (e) => {
  ostGain.gain.rampTo(e.target.value, 0.05);
});

const drumsArray = [
  {"pitch" : "A3", "name" : "kick"},
  {"pitch" : "A#3", "name" : "kick"},
  {"pitch" : "B3", "name" : "snare"},
  {"pitch" : "C4", "name" : "claps"},
  {"pitch" : "C#4", "name" : "shot 1"},
  {"pitch" : "D4", "name" : "whitenoise"},
  {"pitch" : "D#4", "name" : "shot 2"},
  {"pitch" : "E4", "name" : "reverse cymbal"},
  {"pitch" : "F4", "name" : "closed hi-hat"},
  {"pitch" : "F#4", "name" : "open hi-hat"}
];


const beatsDiv = document.getElementById("beats");
const BeatSequencer = new p5(beatsGUI, beatsDiv); // beatsGUI in scripts/drum-machine.js
const beatButton = document.getElementById("beatButton");
beatButton.addEventListener('click', startBeats);

function startBeats(){
//  console.log("startBeats")
  switch(metro){
    case "off":
      metro = "on";
      //console.log("beats " + metro);
      beatButton.style.background = '#e1a820'; 
      beatButton.style.color = '#5d0024';
      beatButton.innerText="Stop Beats";
      if(Tone.Transport.state == "stopped"){
        startTransport();
      }
      BeatSequencer.startLoop(); // toggle handled by GUI
      break;
    case "on":
      metro = "off";
      //console.log("beats " + metro);
      beatButton.style.background = '#a0144f';
      beatButton.style.color = '#febc17';
      beatButton.innerText="Start Beats";
      BeatSequencer.startLoop(); // toggle handled by GUI
      break;
    default:
      Tone.Transport.start();
  }
}


// beat pattern selector for pre-composed 2-bar beat patterns
const beatMenu = document.getElementById('beatMenu');
// 'beatPatterns' array stored in scripts/beat-patterns.js
setBeatMenu(beatMenu, beatPatterns, BeatSequencer);

// function takes a menu element (m), a beatPatterns array (a), and a beatsGUI instance (s)
function setBeatMenu(m, a, s){
  let opt = document.createElement('option');
  opt.value = -1;
  opt.text = "select a beat pattern";
  m.add(opt);
  for(let i = 0; i < a.length; i++){
    opt = document.createElement('option');
    opt.value = i;
    opt.text = a[i].name;
    m.add(opt);
  } // populate the beat patterns menu
  opt = document.createElement('option');
  opt.value = -1;
  opt.text = "Clear all beat patterns";
  m.add(opt);

  m.addEventListener('change', (e) => {
    let i = e.target.value;
    if(i >= 0){
      //console.log(a[i].pattern);
      s.changePattern(a[i].pattern);
    } else {
      //console.log("clear beat patterns")
      s.clearPattern();
    }
  });
}