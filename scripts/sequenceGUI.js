
const seqGUI = p => {
  var obj; // sequence object
  var playButton, playTimer, loopButton, augButton, shift8nButton, upOctave, downOctave; // buttons
  var part; //Tone.js Part reference
  var instrument = new Tone.PolySynth(Tone.Synth).toDestination(); // synth to use for this sequence
  var div = document.getElementById("part3-contents");
  var part;
  var proll; // piano roll rendering of sequence
  var looping = false; // loop the sequence
  var augmented = false; // double the duration and note lengths
  var shifted = false; // shift onset later by 1 eighth note

  p.setObj = function(_obj){
    obj = _obj; // receive object from sequences.js script
    part = new Tone.Part(((time, note) => {
      // the notes given as the second element in the array
      // will be passed in as the second argument 
      instrument.triggerAttackRelease(Tone.Frequency(note.pitch).transpose(obj.octave * 12), note.dur, time);
    }), obj.sequence);
    part.loopEnd = obj.duration;
  }
  
  p.setup = function(){
    let cnv = p.createCanvas(350, 70);
    playButton = new PlayButton(p, p.width/11, p.height/2);
    playTimer = new PlayTimer(p, p.width/11, p.height/2);
    upOctave = new OctaveButton(p, p.width * 11/12, p.height/4, "up");
    downOctave = new OctaveButton(p, p.width * 11/12, p.height* 3/4, "down");
    proll = new PianoRoll(p, p.width/6, 10, p.width/2.1, 50);
    loopButton = new LoopButton(p, p.width * 8.4/12, p.height/4);
    augButton = new LoopButton(p, p.width * 9.6/12, p.height/4);
    shift8nButton = new LoopButton(p, p.width * 8.4/12, p.height * 3/4);
  }
  
  p.draw = function(){
    p.background(200);
    //p.rect(10, 5, 380, 40);
    if(obj.hasOwnProperty("num") && obj.hasOwnProperty("duration")){
      p.textAlign(p.LEFT, p.TOP);
      p.textSize(14);
      p.text(obj.num + ".", 5, 4);
      //p.text(obj.duration, 20, 5);
      proll.display(obj.duration, obj.sequence);
    }
    playTimer.display();
    playTimer.isFinished();
    playButton.display();
    loopButton.display("L");
    augButton.display("A");
    shift8nButton.display("+8n");
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(8);
    p.text("octave:", p.width * 9.6/12, p.height *2.4/4)
    p.textSize(20);
    let octave = obj.octave;
    if(octave > 0){
      octave = "+" + octave;
    }
    p.text(octave, p.width * 9.6/12, p.height* 3.2/4);
    upOctave.display(obj.octave);
    downOctave.display(obj.octave);
  }

  p.play = function(){
    let t = p.nextBeat();
    part = new Tone.Part(((time, note) => {
      // the notes given as the second element in the array
      // will be passed in as the second argument 
      instrument.triggerAttackRelease(Tone.Frequency(note.pitch).transpose(obj.octave * 12), note.dur, time);
    }), obj.sequence).start(t);

    part.loopEnd = obj.duration;
    
    Tone.Transport.schedule((time) => {
       // invoked on next beat
       //part.start();
      playTimer.start(part.loopEnd); // loopEnd is the duration of the sequence
    }, t);

  }

  p.upOctave = function(){
    if(obj.hasOwnProperty("octave")){
      if(obj.octave < 3)
        obj.octave ++;
    }
  }

  p.downOctave = function(){
    if(obj.hasOwnProperty("octave")){
      if(obj.octave > -3)
        obj.octave --;
    }
  }

  p.nextMeasure = function(){
    let t = Tone.Transport.position;
    let times = t.split(':');
    times[2] = 0; // set to downbeat;
    times[1] = 0; // set to first beat
    times[0] = Number(times[0]) + 1; // move up to the next measure;
    t = times[0] + ":" + times[1] + ":" + times[2];    
    return t
  }
  
  p.nextBeat = function (){
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
  
  p.mousePressed = function(){
    if(p.dist(p.mouseX, p.mouseY, playButton.x, playButton.y) < playButton.w/2 && div.style["display"] == "block"){
      p.play();
    }
    if(p.dist(p.mouseX, p.mouseY, upOctave.x, upOctave.y) < upOctave.w/2){
      p.upOctave();
    }
    if(p.dist(p.mouseX, p.mouseY, downOctave.x, downOctave.y) < downOctave.w/2){
      p.downOctave();
    }
  }
}

class PlayButton {
  constructor(_p, _x, _y){
    this.p = _p; // P5 object reference
    this.x = _x;
    this.y = _y;
    this.w = 40;
    this.col = this.p.color("#4caf50");
    this.playing = false;
  }

  display(){
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.scale(.8);
    this.p.fill(this.col);
    this.p.stroke(255);
    if(this.playing){
      this.p.rectMode(this.p.CENTER);
      this.p.rect(-this.w/4, 0, this.w/4, 40);     
      this.p.rect(this.w/4, 0, this.w/4, 40);    
      this.col = this.p.color("#4caff0");
    } else {
      this.p.triangle(this.w/2, 0, -this.w/2, -this.w/2, -this.w/2, this.w/2);
      this.col = this.p.color("#4caf50");
    }
    this.p.pop();
  }
}

class PlayTimer {
  constructor(_p, _x, _y){
    this.p = _p;
    this.x = _x;
    this.y = _y;
    this.d = 48;
    this.col = this.p.color(190);
    this.playing = false;
    this.time = 0;
    this.elapsedTime = 0;
    this.startTime = 0;
  }

  start(time){
    this.time = time * 1000; // set the timer (convert seconds to msec)
    this.startTime = this.p.millis(); // get current clock time
    this.playing = true;
  }

  isFinished(){
    this.elapsedTime = this.p.millis() - this.startTime; //time now v time started
    if(this.elapsedTime > this.time){
      this.playing = false; // time's up!
      this.elapsedTime = 0; // reset to 0;
      this.startTime = 0;
      this.time = 0;
    }
    else this.playing = true;
  }

  display(){
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.scale(.8);
    this.p.fill(this.col);
//    this.p.text(this.elapsedTime, 0, 0)
    let progress = this.elapsedTime / this.time * this.p.TWO_PI;
    this.p.stroke(100);
    this.p.ellipse(0, 0, this.d * 1.02);
    this.p.stroke(255);
    this.p.fill(120);
    this.p.arc(0, 0, this.d, this.d, 0, progress, this.p.PIE);
    this.p.pop();
  }
}

class OctaveButton {
  constructor(_p, _x, _y, _dir){
    this.p = _p;
    this.x = _x;
    this.y = _y;
    this.dir = _dir;
    this.w = 35;
    this.bgcol = this.p.color(190);
    this.acol = this.p.color(120);
    
  }

  display(o){
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.scale(.8);
    this.label = "+8ve"
    this.colors = ["red", "orange", "yellow", "green", "blue", "purple", "indigo"];
    this.p.fill(this.bgcol);
    this.p.rectMode(this.p.CENTER);
    this.p.strokeWeight(5);
    this.p.rect(0, 0, this.w, this.w, this.w/4);
//    this.p.fill(this.acol);
    this.p.fill(this.colors[o+3]);
    this.p.strokeWeight(1);
    switch(this.dir){
      case "up" : 
      this.p.triangle(0, -this.w/4, -this.w/4, this.w/4, this.w/4, this.w/4);
      //this.p.rotate(0);
        this.label = "+8v"
        break;
      case "down" :
        //this.p.rotate(this.p.PI);
        this.p.triangle(0, this.w/4, -this.w/4, -this.w/4, this.w/4, -this.w/4);
        this.label = "-8v"
        break;
      default :
        this.p.rotate(0);
    }
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(12);
    this.p.fill(0)
    //this.p.text(this.label, 0, 0)
    this.p.pop();
  }
}

class LoopButton{
  constructor(_p, _x, _y){
    this.p = _p; //P5 instance context
    this.x = _x;
    this.y = _y;
    this.w = 35;
    this.bgcol = this.p.color(190);
    this.acol = this.p.color(120);

  }
  display(label){
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.scale(.8);
    this.p.fill(this.bgcol);
    this.p.rectMode(this.p.CENTER);
    this.p.strokeWeight(5);
    this.p.rect(0, 0, this.w, this.w, this.w/4);
    this.p.fill(this.acol);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(16);
    this.p.text(label, 0, 0);
    this.p.pop();
  }
}

class PianoRoll {
  constructor(_p, _x, _y, _w, _h){
    this.p = _p;
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.col = this.p.color("#4caf50");
    this.obj;
  }

  display(dur, seq){
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.fill(200, 100);
    this.p.rect(0, 0, this.w, this.h, 10);
    this.p.fill(0);
    let d = Tone.Time(dur).toSeconds();
//    this.p.text("seq" + JSON.stringify(seq), 10, 20);
    if(Array.isArray(seq)){
      for(let i = 0; i < seq.length; i++){
        this.p.fill(0);
        let pit = Tone.Frequency(seq[i].pitch).toMidi();
        let t = Tone.Time(seq[i].time).toSeconds();
        let x = this.p.map(t, 0, d, 10, this.w -10);
        let y = this.p.map(pit, 80, 56, 5, this.h - 8);
        let l = (Tone.Time(seq[i].dur).toSeconds()/d * this.w) - 15;
//        this.p.rect(10 + i * 15, y, 10, 2);
        this.p.rect(x, y, l, this.h/12);
        //this.p.text(pit, 10 + i * 25, 10);
        //this.p.text(t, 10 + i * 25, 30);
      }
    }
    this.p.pop();
  }
}