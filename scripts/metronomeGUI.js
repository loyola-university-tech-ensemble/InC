const metroGUI = p => {
    var slider;
    var selectSynth;
    var syncSlider;
    var click, tap, ost;
    var clickButton, tapButton, ostButton;

    p.setup = function(){
        p.createCanvas(350, 80);
        //slider = new TSlider(p, p.width/2, p.height/2, p.width / 3);
        
        //tempo sync
        syncSlider = p.createSlider(-10, 10, 0, 0.5);
        syncSlider.id("tSlider");
        syncSlider.position(p.width/2 - 55, 35);
        syncSlider.size(110);

        syncSlider.input(() =>{
            Tone.Transport.bpm.value = bpm * (syncSlider.value() * 0.01 + 1);
            //  console.log(Tone.Transport.bpm.value);
              //tempo.value = Tone.Transport.bpm.value;
        });

        syncSlider.changed(() => {
            // snap back to original bpm on release
            syncSlider.value(0); 
            Tone.Transport.bpm.value = bpm;
            //tempo.value = Tone.Transport.bpm.value;
          
          }, false);
        //buttons

        click = new SyncButton(p, 40, 30, "click");
        tap = new SyncButton(p, 40, 90, "tap sync");
        ost = new SyncButton(p, 300, p.height/2, "ostinato");

        clickButton = p.createButton("click");
        clickButton.class("syncButton");
        clickButton.position(10, 2);
        clickButton.mousePressed(()=>{
            startClick();
        })

        ostButton = p.createButton("ostinato");
        ostButton.class("syncButton");
        ostButton.position(p.width - 90, 2);
        ostButton.mousePressed(()=>{
            startOstinato();
        })
        /*
        //Synth menu for ostinato
        selectSynth = p.createSelect();
        selectSynth.class("synthSequenceMenu");
        selectSynth.position(p.width -97, p.height /2);
        selectSynth.size(80);
        for(let i =0; i < synthLibrary.length; i++){
            selectSynth.option(synthLibrary[i].name, i);
        }
        */
        //use menu to change ostSynth
        ostSynth = synthLibrary[0].synth;
        //selectSynth.changed(p.chooseSynth);
/*
        tapButton = p.createButton("tap sync");
        tapButton.class("syncButton");
        tapButton.position(265, 30);
*/
    }

    p.chooseSynth = function(){
        ostSynth = synthLibrary[selectSynth.value()].synth;
        //console.log(selectSynth.value());   
      }

    p.draw = function(){
        p.background(200);
        p.textAlign(p.CENTER);
        p.fill(0);
        // p.text("'phase sync' tempo", 90, 60);
        p.textAlign(p.CENTER);
        let t = Math.trunc(Tone.Transport.bpm.value);
        // let t = Math.trunc(bpm); //bpm defined globally in metronome.js
        p.text(t + " bpm", p.width/2, 20);
        p.textAlign(p.LEFT);
        p.text("<-slower", p.width/2 - 55, 60);
        p.textAlign(p.RIGHT);
        p.text("faster->", p.width/2 + 55, 60);
        //ostSynth = synthLibrary[selectSynth.selected()];
        //tap.display();
        //click.display();
        // ost.display();
    }

    p.mousePressed = function(){
        let d = document.getElementById("metronome");
    //    if(d.display == "block"){
            if(p.dist(p.mouseX, p.mouseY, click.x, click.y) < 30){
                //startClick(); 
            }
            if(p.dist(p.mouseX, p.mouseY, tap.x, tap.y) < 30){
                //tap sync
            }
            if(p.dist(p.mouseX, p.mouseY, ost.x, ost.y) < 30){
                //start ostinato
            }
    //    }
    }
}

class SyncButton {
    constructor(_p, _x, _y, _l){
        this.p = _p;
        this.x = _x;
        this.y = _y;
        this.w = 55;
        this.label = _l;
        this.color = this.p.color("#a0144f");
        this.border = this.p.color("#febc17");

    }
    setColor(c, b){
        this.color = c;
        this.border = b;
    }

    display(){
        this.p.push();
        this.p.translate(this.x, this.y);
        this.p.fill(this.color);
        this.p.stroke(this.border);
        this.p.strokeWeight(4);
        this.p.ellipse(0, 0, this.w);
        this.p.noStroke();
        this.p.textAlign(this.p.CENTER);
        this.p.fill(255);
        this.p.text(this.label, 0, 3);
        this.p.pop();

    }
}

