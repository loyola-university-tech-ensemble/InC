/**
 * Create a P5 instance of a drum machine
 */
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
  
    // play a one-shot drum fill
    p.playFill = function(sequence){
      const part = new Tone.Part(((time, value) => {
        // value is an object that contains the pitch
        beatsSampler.triggerAttack(value.pitch, time);
      }), sequence).start(getNextbeat());
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

    p.changePattern = function(pattern){
      //console.log("GUI changePattern()");
      //console.log(pattern);
      let rowstop = pattern.length;
      if (rowstop > beats.length){
        rowstop = beats.length; // make sure the pattern truncates to the instrument
      }

      for(let j=0; j < rowstop; j++){
        let colstop = pattern[j].length;
        if(colstop > beats[j].length){
          colstop = beats[j].length; // truncate to length of instrument sequence if necessary
        }
        for(let i = 0; i < colstop; i++){
          if(pattern[j][i] > 0){          
            beats[j][i].plays = true;
          } else {
            beats[j][i].plays = false;
          }
        }
        for(let i = pattern[j].length; i < beats[j].length; i++){
          beats[j][i].plays = false; // clean up any leftovers from too short of a pattern
        }
      }
      // if the pattern has fewer instruments than the instrument, clear remaining lines in the drum machine
      for(let j = pattern.length; j < beats.length; j++){
        //console.log ("new pattern clean up line " + j);
        for(let i = 0; i < beats[j].length; i++){
          beats[j][i].plays = false;
        }
      }

    }

    p.clearPattern = function(){
      // console.log("clear beat patterns (GUI)")
      for(let j = 0; j < beats.length; j++){
        for(let i = 0; i < beats[j].length; i++){
          beats[j][i].plays = false;
        }
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
          beatsSampler.triggerAttack(beats[j][i].note, time);
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
  