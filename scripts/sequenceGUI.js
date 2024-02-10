
const seqGUI = p => {
  var obj; // sequence object
  var playButton, playTimer, loopButton, augButton, shift8nButton, upOctave, downOctave; // buttons
  var part; //Tone.js Part reference
  var instrument = new Tone.PolySynth(Tone.Synth).toDestination(); // synth to use for this sequence
  var div = document.getElementById("part3-contents");
  //var part; // reference to the playing part
  var proll; // piano roll rendering of sequence
  var volSlider; // volume slider for individual sequences
  var looping = false; // loop the sequence
  var augmented = false; // double the duration and note lengths
  var shifted = false; // shift onset later by 1 eighth note
  var playing = false;
  var timerGUI;
  var velocity = 1;

  p.setObj = function(_obj){
    obj = _obj; // receive object from sequences.js script
    //obj['vel'] = 1;  
    part = new Tone.Part(((time, note) => {
      // the notes given as the second element in the array
      // will be passed in as the second argument 
      instrument.triggerAttackRelease(Tone.Frequency(note.pitch).transpose(obj.octave * 12), note.dur, time, .2);
    }), obj.sequence);
    part.loopEnd = obj.duration;
  }

  p.setSynth = function(_s){
    instrument = _s;
  }
  
  p.setup = function(){
    let cnv = p.createCanvas(380, 70);
    playButton = new PlayButton(p, p.width/11, p.height/1.7);
    playTimer = new PlayTimer(p, p.width/11, p.height/2);
    upOctave = new OctaveButton(p, p.width * 11/12, p.height/4, "up");
    downOctave = new OctaveButton(p, p.width * 11/12, p.height* 3/4, "down");
    proll = new PianoRoll(p, p.width/6, 3, p.width/2.1, 45);
    loopButton = new LoopButton(p, p.width * 8.4/12, p.height/4);
    augButton = new LoopButton(p, p.width * 9.7/12, p.height/4);
    shift8nButton = new LoopButton(p, p.width * 8.4/12, p.height * 3/4);
    volSlider = p.createSlider(0, 1, 1, 0.01);
    volSlider.position(60, 55);
    volSlider.size(p.width/2.1);
    volSlider.input(()=>{
      velocity = volSlider.value();
    })
    //volSlider.value(100);
    //volSlider.step(1); 
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
    //playTimer.display(); // progress display
    playTimer.isFinished(); // double check the timer
    proll.isFinished();
    playButton.display(); // play button
    loopButton.display("L", looping); // loop button
    augButton.display("A", augmented); // augmentation button
    shift8nButton.display("+8n", shifted); // 8n shift button
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(8);
    p.text("octave:", p.width * 9.7/12, p.height * 2.4/4);
    p.textSize(20);
    let octave = obj.octave;
    if(octave > 0){
      octave = "+" + octave;
    }
    p.text(octave, p.width * 9.7/12, p.height* 3.2/4);
    upOctave.display(obj.octave);
    downOctave.display(obj.octave);
    //velocity = volSlider.value();
//    p.text(part.state, 30, p.height/2)
    // p.text(volSlider.value(), 20, 7);
  }

  p.play = function(){
    let t = p.nextBeat(shifted);
    playing = true;
    if(Tone.Transport.state == "stopped"){
      //Tone.Transport.start();
      let pB = document.getElementById("powerButton");
      pB.click();

    }
    part = new Tone.Part(((time, note) => {
        // the notes given as the second element in the array
        // will be passed in as the second argument 
      let d = note.dur;
      if(augmented){
        d = Tone.Time(note.dur).toSeconds() * 2;
      }
      instrument.triggerAttackRelease(Tone.Frequency(note.pitch).transpose(obj.octave * 12), d, time, velocity);
  
      }), obj.sequence).start(t);
    console.log("start sequence");
    part.loopEnd = obj.duration;
    timerGUI = new Tone.Part(((time, setTime) =>{
      let d = setTime.dur
      if(augmented){
        d *= 2;
      }
      playTimer.start(d);
      proll.start(d);
      //console.log("playTimer dur: " + setTime.dur);
    }), [{"time" : 0, "dur" : part.loopEnd}]).start(t);
    
    timerGUI.loopEnd = part.loopEnd;

    if(augmented){
      part.playbackRate = .5;
      timerGUI.playbackRate = .5;
    } else {
      part.playbackRate = 1;
      timerGUI.playbackRate = 1;
    }

    if(looping){
      part.loop = true;
      timerGUI.loop = true;
    }

  }
  p.noLoop = function(){
    looping = false;
    part.loop = false;
    timerGUI.loop = false;
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
  
  p.nextBeat = function (shift){
    let t = Tone.Transport.position;
  
    let times = t.split(':');
    times[2] = 0; // set to downbeat;
    times[1] = Number(times[1]) + 1; // move up to the next downbeat;
    if (times[1] > 3) {
      times[1] = 0;
      times[0] = Number(times[0]) + 1;
    }
    if(shift){
      times[2] = 2; // shift one eighth note
    }
    t = times[0] + ":" + times[1] + ":" + times[2];
    return t;
    
  }
  
  p.mousePressed = function(){
    //play button
    if(p.dist(p.mouseX, p.mouseY, playButton.x, playButton.y) < playButton.w/2){
      console.log("play button");
      if(part.state == "started"){
        part.dispose();
        timerGUI.dispose();
      }
      p.play();
    }
    // up octave
    if(p.dist(p.mouseX, p.mouseY, upOctave.x, upOctave.y) < upOctave.w/2){
      p.upOctave();
    }
    // down octave
    if(p.dist(p.mouseX, p.mouseY, downOctave.x, downOctave.y) < downOctave.w/2){
      p.downOctave();
    }
    // loop button
    if(p.dist(p.mouseX, p.mouseY, loopButton.x, loopButton.y) < loopButton.w/2){
      if(looping){
        looping = false;
        console.log("Looping: " + looping);
        part.loop = false;
        timerGUI.loop = false;
      } else {
        looping = true;
        timerGUI.loop = true;
        console.log("Looping: " + looping);
        part.loop = true;
      }
    }
    // rhythmic augmentation button
    if(p.dist(p.mouseX, p.mouseY, augButton.x, augButton.y) < augButton.w/2){
      if(augmented){
        augmented = false;
//        console.log(augmented);
      } else {
        augmented = true;
        part.dispose(); // restart the part
        timerGUI.dispose();
        looping = false;
//        console.log(augmented);
      }
    }
    if(p.dist(p.mouseX, p.mouseY, shift8nButton.x, shift8nButton.y) < shift8nButton.w/2){
      if(shifted){
        shifted = false;
        console.log(shifted);
      } else {
        shifted = true;
//        console.log(shifted);
      }
    }
  }
}

class PlayButton {
  constructor(_p, _x, _y){
    this.p = _p; // P5 object reference
    this.x = _x;
    this.y = _y;
    this.w = 60;
    this.col = this.p.color("#4caf50");
    this.playing = false;
  }

  display(){
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.scale(.8);
    this.p.fill("#fde4a9");
    this.p.stroke("#5d0024");
    this.p.strokeWeight(4);
    if(this.playing){
      this.p.rectMode(this.p.CENTER);
      this.p.rect(-this.w/4, 0, this.w/4, 40);     
      this.p.rect(this.w/4, 0, this.w/4, 40);    
      this.col = this.p.color("#4caff0");
    } else {

      this.p.ellipse(0, 0, this.w);
      //this.p.triangle(this.w/2, 0, -this.w/2, -this.w/2, -this.w/2, this.w/2);
      this.p.stroke(0, 150, 0);
      this.p.strokeJoin(this.p.ROUND);
      this.p.fill(this.col);
      this.p.beginShape();
      this.p.vertex((this.w/2 * 0.7), 0);
      let x = this.p.cos(this.p.PI - 1) * (this.w/2 * 0.75);
      let y = this.p.sin(this.p.PI - 1) * (this.w/2 * 0.75);
      this.p.vertex(x, y);
      x = this.p.cos(this.p.PI + 1) * this.w/2 * 0.75;
      y = this.p.sin(this.p.PI + 1) * this.w/2 * 0.75;
      this.p.vertex(x, y);
      this.p.endShape(this.p.CLOSE);
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
    this.acol = this.p.color(100);

  }
  display(label, flag){
    if(flag){
      this.bgcol = this.p.color("#febc17");
      this.acol = this.p.color('#5d0024');
    }
    else{
      this.bgcol = this.p.color(190);
      this.acol = this.p.color(100);
    }
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
    this.cursor = 0; // start playhead cursor at 0
    this.playing = false;
    this.time = 1; // don't divide by 0!
    this.elapsedTime = 0;
    this.startTime = 0;
  }

  display(dur, seq){
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.fill(210, 110); // pale grey, translucent
    this.p.rect(0, 0, this.w, this.h, 5); //bounding rectangle
    let d = Tone.Time(dur).toSeconds();
    let measure = Tone.Time("1m").toSeconds(); // calculate 1m for current tempo
    let sixteenth = Tone.Time("16n").toSeconds(); // calculate 1 16th note
    let window = this.w;
    let barline = this.w / 2; // width of measure marker in px
    let num_measures = 2; // show 2 measures by default

    if (d > measure){
      // scale to window 
      num_measures = Math.trunc(d/measure);
      if(d % measure > 0){
        num_measures++; // pad out to whole number of measures
      }
      window = d/measure * this.w / num_measures;
      barline = this.w / num_measures;

    } else {
      // fit sequence to grid
      window = d/measure * this.w;
      num_measures = 1;
      barline = this.w;
    }
//    this.p.fill(222, 255, 222, 110); // pale green, translucent
//rgba(254,188,23,255)
    this.p.fill('#ffe4a2'); // pale yellow
    this.p.rect(0, 0, window, this.h, 5); //note window
    for(let i = 0; i < num_measures; i++){
      //barlines
      this.p.textSize(8)
      this.p.noStroke();
      this.p.fill(100)
      this.p.text("m." + (i +1), i * barline + 2, 2)
      this.p.stroke(150);
      this.p.line(i * barline, 0, i * barline, this.h);
    }
    //draw notes
    this.p.fill("#a0144faf");
    this.p.noStroke();
    if(Array.isArray(seq)){
      for(let i = 0; i < seq.length; i++){
        //this.p.fill(0);
        let pit = Tone.Frequency(seq[i].pitch).toMidi();
        let t = Tone.Time(seq[i].time).toSeconds();
//        let x = this.p.map(t, 0, d, 2, this.w -10);//horizontal scaling
        let x = this.p.map(t, 0, d, 2, window);//horizontal scaling
        let y = this.p.map(pit, 80, 56, 5, this.h - 8);
//        let l = (Tone.Time(seq[i].dur).toSeconds()/d * this.w) * .9;
        let l = (Tone.Time(seq[i].dur).toSeconds()/d * window) * .9; // note length
//        this.p.rect(10 + i * 15, y, 10, 2);
        this.p.noStroke();
        this.p.rectMode(this.p.CORNER);
        this.p.rect(x, y, l, this.h/12);
        //this.p.text(pit, 10 + i * 25, 10);
        //this.p.text(t, 10 + i * 25, 30);
      }
    }
    // add playhead cursor
    this.cursor = this.elapsedTime / this.time * window;
    this.p.stroke(255, 0, 0);
    this.p.line(this.cursor, 0, this.cursor, this.h)
    this.p.pop();
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

}