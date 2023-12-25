## In C Sequences
*Play In C one phrase at a time*

- "octave" : transposition level by octave. Leave this at 0, but in the player app, you can shift your sequence up or down (+/- 3 octaves)
- duration : the total length of the sequence before it loops
- sequence : another array of objects (JSON allows "nesting" structures). Each object in this array represents a "note" with three properties:
  - "time" : the start time of the note relative to the launch time of the sequence (not the absolute Transport time). In the example below, time is given in "measures:beats:sixteenths" format. All start at zero (0)
  - pitch : the note to play. The example below gives pitch in "scientific notation" with the note letter name and octave (middle C is "C4"). Make sure to enclose it in "quotes."
  - "dur" : the duration of the note (how long to hold it). The example gives duration in Tone's own "time notation" format, based on standard note durations (eighth note == "8n", quarter note == "4n", etc.). Here's a basic key for understanding Tone.js Time notation: https://github.com/Tonejs/Tone.js/wiki/Time 

