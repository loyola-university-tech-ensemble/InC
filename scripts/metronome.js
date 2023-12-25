/** 
* This script sets up a basic metronome click with tempo and sync adjustment
* Also creates a transport start/stop button
*/

var bpm = 120; // default tempo

console.log("default tempo: " + bpm + " bpm");

Tone.Transport.bpm.value = bpm;

// default click tone for metronome
//const metroClick = new Tone.Synth().toDestination();
const clickSampler = new Tone.Sampler(
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

var metro = "off"; // metronome state

let m = document.getElementById("metronome");
//'metronome' div is in the Start menu

// transport button
let transport = document.createElement("button");
transport.innerHTML = "Transport";
transport.className = "metro-button";
transport.id = "transport";
transport.addEventListener('click', () => {
  startTransport();
});
function startTransport(){
  //make this function accessible from other buttons
  switch (Tone.Transport.state) {
    case "stopped":
      Tone.Transport.bpm.value = bpm;
      Tone.Transport.start();
      console.log("transport " + Tone.Transport.state);
      transport.style.background = '#4caf50';
      transport.innerHTML = "Stop";
      break;
    case "started":
      Tone.Transport.stop();
      console.log("transport " + Tone.Transport.state);
      transport.style.background = '#a8a8a8';
      transport.innerHTML = "Start";
      break;
    default:
      Tone  .Transport.start();
  }
}

// Tempo number box
let tempoLabel = document.createElement('label');
tempoLabel.innerHTML = " tempo: ";

let tempo = document.createElement('input');
tempo.type="number";
tempo.value = bpm;
tempo.className = "tempo-box";
tempo.inputmode="numeric";
tempo.addEventListener('change', () => {
  console.log("new tempo: " + tempo.value);
  bpm = tempo.value;
  Tone.Transport.bpm.value = bpm;
});

// Metronome click
let click = document.createElement("button");
click.innerHTML = "Click";
click.className = "metro-button";
click.id = "click";
click.addEventListener('click', () => {
  startClick();  
});

const clickLoop = new Tone.Loop((time) => {
	// triggered every quarter note.
	//console.log(time);
  clickSampler.triggerAttackRelease("F4", "8n", time);
  //metroClick.triggerAttackRelease(500, "128n", time);
}, "4n");

const dbClickLoop = new Tone.Loop((time) => {
	// triggered every measure.
	//console.log(time);
  clickSampler.triggerAttackRelease("A3", "8n", time);
  //metroClick.triggerAttackRelease(500, "128n", time);
}, "1m");

function startClick(){
    switch(metro){
    case "off":
      metro = "on";
      console.log("click " + metro);
      click.style.background = '#4caf50'; 
      if(Tone.Transport.state == "stopped"){
        startTransport();
      }
/*      let t = Tone.Transport.position;    
      let times = t.split(':');
      times[2] = 0; // set to downbeat;
      times[1] = Number(times[1]) + 1; // move up to the next downbeat;
      if (times[1] > 3) {
        times[1] = 0;
        times[0] = Number(times[0]) + 1;
      }
      t = times[0] + ":" + times[1] + ":" + times[2];
*/
      clickLoop.start(getNextbeat()); // start on next quarter note
      dbClickLoop.start(getNextMeasure());
      break;
    case "on":
      metro = "off";
      console.log("click " + metro);
      click.style.background = '#a8a8a8';
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

// Adjust metronome sync
// speed up/slow down metronome by as much as 10% to get in phase with external clicks
let tempoSync = document.createElement('input');
tempoSync.type = 'range';
tempoSync.min = -10.0;
tempoSync.max = 10.0;
tempoSync.step = 0.1;
tempoSync.id = "tempoSync";
tempoSync.value = 0;

tempoSync.addEventListener('input', function() {
  // adjust tempo +/- 10%
  //console.log(this.value * 0.01 + 1);
  Tone.Transport.bpm.value = bpm * (this.value * 0.01 + 1);
//  console.log(Tone.Transport.bpm.value);
  tempo.value = Tone.Transport.bpm.value;
}, false);

tempoSync.addEventListener('change', function() {
  // snap back to original bpm on release
  this.value = 0;
  Tone.Transport.bpm.value = bpm;
  tempo.value = Tone.Transport.bpm.value;

}, false);

// add metronome elements to the <div>
m.appendChild(transport);
m.appendChild(tempoLabel);
m.appendChild(tempo);
m.appendChild(click);
m.appendChild(document.createElement("br"));
m.appendChild(tempoSync);