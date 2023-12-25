## COMP 122 Project Part 3 - Beats & Sequences
*Design beat patterns and encode short sequences*

**Part 1 - Beats**

Beat patterns in this project are once again, an [array] of {objects}. Each object represents a single-instrument pattern on a constant sixteenth-note grid. Properties of a pattern:
- "name" : call it something obvious. This is for conveniece
- "pitch" : a note name or pitch value (in Tone.js syntax) for the pattern to play on. For the drum sampler "mySampler" the pitch-to-instrument 'keymap' looks like this:
  
      "A3" : "Kick.wav",
      "A#3" : "Kick.wav",
      "B3" : "Snare.wav",
      "C4" : "Claps.wav",
      "C#4" : "Shot1.wav",
      "D#4" : "Shot2.wav",
      "D4" : "WhiteNoise.wav",
      "E4" : "ReverseCymbal.wav",
      "F4" : "HiHat_Closed.wav",
      "F#4" : "HiHat_Open.wav"

- "pattern" : a string of characters representing places along the 16th-note grid. A '1' will play a note on that 16th. Any other character is treated as a rest. The pattern given as a string (of any length) is treated as a constant stream of 16th-note pulses, and will loop at whatever length is given. In other words, a pattern of four charachters will repeat every four 16ths, or once per beat. Only characters that are a '1' in the string will activate a note on their subdivision. The pattern "1000" will play the first 16th of every beat (in 4/4 time). The pattern "0000100000001000" plays on '2' and '4' in every measure.

**Example:** A basic House beat with an irregular hi-hat pattern:
```
[
  {
    "name" : "kick",
    "pitch" : "A3",
    "pattern" : "1000",
    "synth" : "mySampler"
  },
  {
    "name" : "claps",
    "pitch" : "C4",
    "pattern" : "0000100000001000",
    "synth" : "mySampler"
  },
  {
    "name" : "hi-hat",
    "pitch" : "F4",
    "pattern" : "00010101110111010100110110010",
    "synth" : "mySampler"
  }
]
```

**Part 2 - Sequences**

In this project, you will also compose or arrange a set of short musical sequences. They may be primarily melodic, but they can also be harmonic in nature (chord progressions). We will again construct an array of objects, each of which represents an individual sequence. The player app can then launch these sequences as stand-alone musical objects. They will play in time with the Transport's metrical grid, so that beats, samples, and sequences can all play along together.

Each sequence object has a pre-defined structure:

- "name" : for convenience
- "octave" : transposition level by octave. Leave this at 0, but in the player app, you can shift your sequence up or down (+/- 3 octaves)
- duration : the total length of the sequence before it loops
- sequence : another array of objects (JSON allows "nesting" structures). Each object in this array represents a "note" with three properties:
  - "time" : the start time of the note relative to the launch time of the sequence (not the absolute Transport time). In the example below, time is given in "measures:beats:sixteenths" format. All start at zero (0)
  - pitch : the note to play. The example below gives pitch in "scientific notation" with the note letter name and octave (middle C is "C4"). Make sure to enclose it in "quotes."
  - "dur" : the duration of the note (how long to hold it). The example gives duration in Tone's own "time notation" format, based on standard note durations (eighth note == "8n", quarter note == "4n", etc.). Here's a basic key for understanding Tone.js Time notation: https://github.com/Tonejs/Tone.js/wiki/Time 

**Example:** _Twinkle, Twinkle Little Star_ as two separate sequences:
```
[
  {
    "name": "antecedent phrase",
    "octave": 0,
    "duration": "1:0:0",
    "sequence": [
      { "time": "0:0:0", "pitch": "C4", "dur": "8n" },
      { "time": "0:0:2", "pitch": "C4", "dur": "8n" },
      { "time": "0:1:0", "pitch": "G4", "dur": "8n" },
      { "time": "0:1:2", "pitch": "G4", "dur": "8n" },
      { "time": "0:2:0", "pitch": "A4", "dur": "8n" },
      { "time": "0:2:2", "pitch": "A4", "dur": "8n" },
      { "time": "0:3:0", "pitch": "G4", "dur": "4n" }
    ]
  },
  {
    "name": "consequent phrase",
    "octave": 0,
    "duration": "1:0:0",
    "sequence": [
      { "time": "0:0:0", "pitch": "F4", "dur": "8n" },
      { "time": "0:0:2", "pitch": "F4", "dur": "8n" },
      { "time": "0:1:0", "pitch": "E4", "dur": "8n" },
      { "time": "0:1:2", "pitch": "E4", "dur": "8n" },
      { "time": "0:2:0", "pitch": "D4", "dur": "8n" },
      { "time": "0:2:2", "pitch": "D4", "dur": "8n" },
      { "time": "0:3:0", "pitch": "C4", "dur": "4n" }
    ]
  }
]

```