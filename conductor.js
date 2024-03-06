var bpm = 138; // default tempo
var metro = "off"; // metronome state
var ostinato = "off"; // ostinato state

console.log("default tempo: " + bpm + " bpm");
Tone.Transport.bpm.value = bpm;

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



if ('onscrollend' in window) {
  sequenceDiv.onscrollend = endScrolling;
}
else {
  sequenceDiv.onscroll = event => {
    clearTimeout(window.scrollEndTimer)
    window.scrollEndTimer = setTimeout(endScrolling, 100)
  }
}
endScrolling();

function endScrolling(){
  let divTop = sequenceDiv.scrollTop;
  let divBottom = sequenceDiv.scrollTop + sequenceDiv.clientHeight;
  let seqDiv;
  let s = 0;
  for(let i = 0; i < sketches.length; i++){
    seqDiv = document.getElementById("sequence_" + (i + 1));
    let top = seqDiv.offsetTop;
    if(top >= divTop - 5 && top <= divBottom){
      console.log("sequence " + (i + 1) + " visible");
      sketches[i].enable();
      sequenceNum = i - s; // locate the current top player for back/fwd buttons
      s++; // keep track of how many are visible
    } else {
      sketches[i].noLoop();
      sketches[i].disable();
    }
  }
}

//const ostSynth = new Tone.PolySynth(Tone.Synth).toDestination();
const ostLoop = new Tone.Part(function (time, value){
  ostPiano.triggerAttackRelease(value.note, "16n", time, value.vel);
}, [{"time" : 0, "note" : ["C5"], "vel": 1}, 
    {"time" : "0:0:2", "note" : ["C5"], "vel": 0.5}, 
    {"time" : "0:1:0", "note" : ["C5"], "vel": 1},
    {"time" : "0:1:2", "note" : ["C5"], "vel": 0.5}, 
    {"time" : "0:2:0", "note" : ["C5"], "vel": 1},
    {"time" : "0:2:2", "note" : ["C5"], "vel": 0.5}, 
    {"time" : "0:3:0", "note" : ["C5"], "vel": 1},
    {"time" : "0:3:2", "note" : ["C5"], "vel": 0.5}
   ]);
ostLoop.loop = true;

const ostButton = document.getElementById("ostinato");
ostButton.addEventListener('click', startOstinato);
const transButton = document.getElementById("transport")
transButton.addEventListener('click', startTransport);

function startOstinato(){
  switch(ostinato){
    case "off":
      ostinato = "on";
      console.log("ostinato " + ostinato);
      ostButton.style.background = '#e1a820'; 
      ostButton.style.color = '#5d0024';
      if(Tone.Transport.state == "stopped"){
        startTransport();
      }

      ostLoop.start(getNextbeat()); // start on next quarter note
      //dbClickLoop.start(getNextMeasure());
      break;
    case "on":
      ostinato = "off";
      console.log("ostinato " + ostinato);
      ostButton.style.background = '#a0144f';
      ostButton.style.color = '#febc17';
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
  }

const clickLoop = new Tone.Loop((time) => {
	// triggered every quarter note.
	//console.log(time);
//  clickSampler.triggerAttackRelease("F4", "8n", time);
  drumSampler.triggerAttackRelease("F4", "8n", time);
  //metroClick.triggerAttackRelease(500, "128n", time);
}, "4n");

const dbClickLoop = new Tone.Loop((time) => {
	// triggered every measure.
	//console.log(time);
  drumSampler.triggerAttackRelease("A3", "8n", time);
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
  ).connect(drumsGain);

const drumVolSlider = document.getElementById("beatVolume");
drumVolSlider.className = "drumVolSlider";
drumVolSlider.style = "padding: 20px;";
drumVolSlider.addEventListener('input', (e) => {
  drumsGain.gain.rampTo(e.target.value, 0.05);
});

const ostGain = new Tone.Gain(1).toDestination();
const reverb = new Tone.Reverb(0.5).connect(ostGain);
/** define a piano sampler for the ostinato */
const ostPiano = new Tone.Sampler({
  urls: {
    "C5" : "drums/piano-note-upright-dry_85bpm_A_major.wav"
  }
})
ostPiano.connect(reverb);

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

const beatsGUI = p =>{

  let beats = [];
  let labels = [];
  let playing = false;
  let i = 0; //index of the beat pattern
  const drumLoop = new Tone.Loop((time) => {
    // triggered every sixteenth note.
    //console.log(time);
    p.playBeat(i, time);
    i++;
    i %= 32;
  }, "16n")
  drumLoop.stop();

  p.setup = function() {

      p.createCanvas(1600 *.95, 500);  
      
      // for each instrument in the drumset, create an array
      for(let j = 0; j < drumsArray.length; j++){
        beats.push(new Array(32));
        labels.push(new StartButton(p, 5, 20 + j * 40 * 1.1, drumsArray[j].name))
        for(let i = 0; i < beats[j].length; i++){
          beats[j][i] = new BeatBox(p, i * 50 + 20, 40, drumsArray[j].pitch);
          beats[j][i].y = beats[j][i].w + (j * beats[j][i].w * 1.1);
          //console.log(`beat ${i} for instrument ${beats[j][i].note}`);
        }

      }
  }

  p.startLoop = function(){
    if(playing){
      drumLoop.stop();
      playing = false;
      i = 0;
    } else{
      drumLoop.start(getNextMeasure());
      playing = true;
      i = 0;
    }

  }
    
  p.draw = function() {
    let beatMargin = 90;
    let beatWidth = 1425;
    let margin = beatMargin;
    p.background(200);

    for(let j = 0; j < drumsArray.length; j++){
      labels[j].display()
      margin = beatMargin;
      for(let i = 0; i < beats[j].length; i++){
        if(i % 4 === 0){
          margin += 10;
        }        
        beats[j][i].x = margin + beats[j][i].w / 2 + i * beats[j][i].w * 1.05;
        beats[j][i].display(i);      
      }
    }

    p.rectMode(p.CORNER);
    p.noFill();
    p.strokeWeight(3)
    p.rect(beatMargin, 10, beatWidth, 460, 10)
  }

  p.playBeat = function(i, time){
    for(let j = 0; j < beats.length; j++){
      // each row
      beats[j][i].on = true;
      if(beats[j][i].plays && beats[j][i].mute == false){
        drumSampler.triggerAttack(beats[j][i].note, time);
      }

      if (i == 0) {
        beats[j][beats[j].length - 1].on = false;
      } else {
        beats[j][i - 1].on = false;
      }
    }
  }

  p.mousePressed = function(){
    let x = p.mouseX;
    let y = p.mouseY;

    for(let i = 0; i < labels.length; i++){
      //if (p.dist(x, y, labels[i].x, labels[i].y) < 20){
      if (x > labels[i].x && x < labels[i].x + labels[i].w && y > labels[i].y && y < labels[i].y + labels[i].w/2){
        if(labels[i].on == true){
          labels[i].on = false;
          for(let j = 0; j < beats[i].length; j++){
            beats[i][j].mute = false;
            //console.log(beats[i][j].mute);
          }
        } else {
          labels[i].on = true;          
          for(let j = 0; j < beats[i].length; j++){
            beats[i][j].mute = true;
            //console.log(beats[i][j].mute);
          }
        }
      }
    }

    for(let j = 0; j < beats.length; j++){
      for(let i = 0; i < beats[j].length; i++){
        if(p.dist(x, y, beats[j][i].x, beats[j][i].y) < beats[j][i].w/2){
          if(beats[j][i].plays == true){
            beats[j][i].plays = false;
          } else {
            beats[j][i].plays = true;          
          }
        }
      }
    }
  }


}

class BeatBox {
  constructor(_p, _x, _y, _note){
      this.p = _p;
      this.x = _x;
      this.y = _y;
      this.w = 40;
      this.note = _note;
      this.mute = false;
      this.plays = false; // does this cell play a note?
      this.on = false; // is it currently playing?
//        console.log(`BeatBox constructor for note ${this.note}`);
  }

  display(i){
    this.p.strokeWeight(1);

    this.p.rectMode(this.p.CENTER);
    if (this.on) {
      if (this.plays){
        this.p.fill(this.p.color("#4caf50")); // active player, green
      }
      else{
        this.p.fill(150) // non-player, active (gray)
      }
    } else { // not on
      if (this.plays){
        this.p.fill(this.p.color("#ba64e8")); // non-active player, purple
      }
      else {
        this.p.fill(255); //non-player, not active (white)
      }
    }
    this.p.rect(this.x, this.y, this.w, this.w, 5);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.fill(0);
    //this.p.text(this.note + " " + i, this.x, this.y);
  }

}

class StartButton {
  constructor(_p, _x, _y, _label){
    this.p = _p
    this.x = _x;
    this.y = _y;
    this.w = 80;
    this.label = _label;
    this.on = false;
  }
  display(){
    this.p.push();
    this.p.strokeWeight(1);
    this.p.rectMode(this.p.CORNER);
    if(this.on){
      this.p.fill(150);
    } else {
      this.p.fill(255);
    }
    this.p.rect(this.x, this.y, this.w, this.w/2, 5);
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    this.p.fill(0);
    this.p.text(this.label, this.x + 5, this.y + 5, 70, 40);
    this.p.pop();

  }


}


const beatsDiv = document.getElementById("beats");
const BeatSequencer = new p5(beatsGUI, beatsDiv);
document.getElementById("beat").addEventListener('click', () => {
  BeatSequencer.startLoop();
});
