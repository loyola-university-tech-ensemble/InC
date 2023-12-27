/**
* Make a sequence player interface with Tone.js and P5.js
* adapted from COMP/MUSC 122 Player project
* December 24, 2023
*/
//let sequencePromise = loadSequenceData("sequences.json")

// read in the JSON file with sampler meta-data
//console.log(JSON.stringify(inC_phrases));
const InC_phrases = 
  [
  {  /** #1 */
    num: 1,
    duration: "0:3:0",
    octave: 0,
    image: "sco1.png",
    sequence: [
      { time: 0, pitch: "C4", dur: "32n" },
      { time: "0:0:0.3", pitch: "e4", dur: "4n" },
      { time: "0:1:0", pitch: "c4", dur: "32n" },
      { time: "0:1:0.3", pitch: "e4", dur: "4n" },
      { time: "0:2:0", pitch: "C4", dur: "32n" },
      { time: "0:2:0.3", pitch: "e4", dur: "4n" }
    ]
  },
  { /** #2 */
    num: 2,
    duration: "0:2:0",
    octave: 0,
    image: "sco2.png",
    sequence: [{ time: 0, pitch: "C4", dur: "32n" },
    { time: "0:0:0.3", pitch: "e4", dur: "8n" },
    { time: "0:0:2", pitch: "f4", dur: "8n" },
    { time: "0:1:0", pitch: "e4", dur: "4n" }
    ]
  },
  { /** #3 */
    num: 3,
    duration: "0:2:0",
    octave: 0,
    image: "sco3.png",
    sequence: [{ time: "0:0:2", pitch: "e4", dur: "8n" },
    { time: "0:1:0", pitch: "f4", dur: "8n" },
    { time: "0:1:2", pitch: "e4", dur: "8n" }
    ]
  },
  { /** #4 */
    num: 4,
    duration: "0:2:0",
    octave: 0,
    image: "sco4.png",
    sequence: [{ time: "0:0:2", pitch: "e4", dur: "8n" },
    { time: "0:1:0", pitch: "f4", dur: "8n" },
    { time: "0:1:2", pitch: "g4", dur: "8n" }
    ]
  },
  { /** #5 */
    num: 5,
    duration: "0:2:0",
    octave: 0,
    image: "sco5.png",
    sequence: [{ time: 0, pitch: "e4", dur: "8n" },
    { time: "0:0:2", pitch: "f4", dur: "8n" },
    { time: "0:1:0", pitch: "g4", dur: "8n" }
    ]
  },
  { /** #6 */
    num: 6,
    duration: "2:0:0",
    octave: 0,
    image: "sco6.png",
    sequence: [
      { time: 0, pitch: "c5", dur: "2m" }
    ]
  },
  { /** #7 */
    num: 7,
    duration: "2:1:0",
    octave: 0,
    image: "sco7.png",
    sequence: [{ time: "0:3:2", pitch: "c4", dur: "16n" },
    { time: "0:3:3", pitch: "c4", dur: "16n" },
    { time: "1:0:0", pitch: "c4", dur: "8n" }
    ]
  },
  {/** #8 */
    num: 8,
    duration: "3:2:0",
    octave: 0,
    image: "sco8.png",
    sequence: [{ time: 0, pitch: "g4", dur: "1n." },
    { time: "1:2:0", pitch: "f4", dur: "2m" }
    ]
  }, 
  {/** #9 */
    num: 9,
    duration: "1:0:0",
    octave: 0,
    image: "sco9.png",
    sequence: [{ time: 0, pitch: "b4", dur: "16n" },
    { time: "0:0:1", pitch: "g4", dur: "16n" }
    ]
  },
  {/** #10 */
    num: 10,
    duration: "0:0:2",
    octave: 0,
    image: "sco10.png",
    sequence: [{ time: 0, pitch: "b4", dur: "16n" },
    { time: "0:0:1", pitch: "g4", dur: "16n" }
    ]
  },
  {/** #11 */
    num: 11,
    duration: "0:1:2",
    octave: 0,
    image: "sco11.png",
    sequence: [{ time: 0, pitch: "f4", dur: "16n" },
    { time: "0:0:1", pitch: "g4", dur: "16n" },
    { time: "0:0:2", pitch: "b4", dur: "16n" },
    { time: "0:0:3", pitch: "g4", dur: "16n" },
    { time: "0:1:0", pitch: "b4", dur: "16n" },
    { time: "0:1:1", pitch: "g4", dur: "16n" }
    ]
  },
  {/** #12 */
    num: 12,
    duration: "1:2:0",
    octave: 0,
    image: "sco12.png",
    sequence: [{ time: "0:0:0", pitch: "f4", dur: "8n" },
    { time: "0:0:2", pitch: "g4", dur: "8n" },
    { time: "0:1:0", pitch: "b4", dur: "1n" },
    { time: "1:1:0", pitch: "c5", dur: "4n" }
    ]
  },
  {  /** #13 by **/
    num: 13,
    duration: "1:2:0", //loop duration
    octave: 0, // leave this
    image: "sco13.png",
    sequence: [
      { time: 0, pitch: "B4", dur: "16n" },
      { time: "0:0:1", pitch: "G4", dur: "8n." },
      { time: "0:1:0", pitch: "G4", dur: "16n" },
      { time: "0:1:1", pitch: "F4", dur: "16n" },
      { time: "0:1:2", pitch: "G4", dur: "8n" },
      { time: "0:2:3", pitch: "G4", dur: "0:3:1" }
    ]
  },
  {  /** #14 by **/
    num: 14,
    duration: "4:0:0", //loop duration
    octave: 0, // leave this
    image: "sco14.png",
    sequence: [
      { time: "0:0:0", pitch: "C5", dur: "1m" },
      { time: "1:0:0", pitch: "B4", dur: "1m" },
      { time: "2:0:0", pitch: "G4", dur: "1m" },
      { time: "3:0:0", pitch: "F#4", dur: "1m" }
    ]
  },
  { /** #15 by **/
    num: 15,
    duration: "1:0:0",
    octave: 0,
    image: "sco15.png",
    sequence: [
      { time: 0, pitch: "G4", dur: "16n" }
    ]
  },
  {  /** #16 by **/
    num: 16, // update this
    duration: "0:1:0", //loop duration
    octave: 0, // leave this
    image: "sco16.png", // update this
    sequence: [
      { time: "0:0:0", pitch: "g4", dur: "16n" },
      { time: "0:0:1", pitch: "b4", dur: "16n" },
      { time: "0:0:2", pitch: "c5", dur: "16n" },
      { time: "0:0:3", pitch: "b4", dur: "16n" }
    ]
  },
  {  /** #17 by **/
    num: 17,
    duration: "0:1:2", //loop duration
    octave: 0, // leave this
    image: "sco17.png",
    sequence: [
      { time: 0, pitch: "B4", dur: "16n" },
      { time: "0:0:1", pitch: "C5", dur: "16n" },
      { time: "0:0:2", pitch: "B4", dur: "16n" },
      { time: "0:0:3", pitch: "C5", dur: "16n" },
      { time: "0:1:0", pitch: "B4", dur: "16n" }
    ]
  },
  { /** #18 by **/
    num: 18,
    duration: "0:2:0",
    octave: 0,
    image: "sco18.png",
    sequence: [
      { time: "0:0:0", pitch: "e4", dur: "16n" },
      { time: "0:0:1", pitch: "f#4", dur: "16n" },
      { time: "0:0:2", pitch: "e4", dur: "16n" },
      { time: "0:0:3", pitch: "f#4", dur: "16n" },
      { time: "0:1:0", pitch: "e4", dur: "8n." },
      { time: "0:1:3", pitch: "e4", dur: "16n" }
    ]
  },
  {  /** #19 by **/
    num: 19,
    duration: "0:3:0", //loop duration
    octave: 0, // leave this
    image: "sco19.png",
    sequence: [
      { time: "0:1:2", pitch: "G5", dur: "4n." }
    ]
  },
  {  /** #20 by **/
    num: 20,
    duration: "0:3:0", //loop duration
    octave: 0, // leave this
    image: "sco20.png",
    sequence: [
      { time: 0, pitch: "E4", dur: "16n" },
      { time: "0:0:1", pitch: "F#4", dur: "16n" },
      { time: "0:0:2", pitch: "E4", dur: "16n" },
      { time: "0:0:3", pitch: "F#4", dur: "16n" },
      { time: "0:1:0", pitch: "G3", dur: "8n." },
      { time: "0:1:3", pitch: "E4", dur: "16n" },
      { time: "0:2:0", pitch: "F#4", dur: "16n" },
      { time: "0:2:1", pitch: "E4", dur: "16n" },
      { time: "0:2:2", pitch: "F#4", dur: "16n" },
      { time: "0:2:3", pitch: "E4", dur: "16n" }
    ]
  },
  { /** #21 by **/
    num: 21, // update this
    duration: "0:3:0", //loop duration
    octave: 0, // leave this
    image: "sco21.png", // update this
    sequence: [ // change this sequence
      { time: "0:0:0", pitch: "F#4", dur: "2n." }
    ]
  },
  { /** #22 by **/
    num: 22,
    duration: "3:0:2",
    octave: 0,
    image: "sco22.png",
    sequence: [
      { time: 0, pitch: "e4", dur: "4n." },
      { time: "0:1:2", pitch: "e4", dur: "4n." },
      { time: "0:3:0", pitch: "e4", dur: "4n." },
      { time: "1:0:2", pitch: "e4", dur: "4n." },
      { time: "1:2:0", pitch: "e4", dur: "4n." },
      { time: "1:3:2", pitch: "f#4", dur: "4n." },
      { time: "2:1:0", pitch: "g4", dur: "4n." },
      { time: "2:2:2", pitch: "a4", dur: "4n." },
      { time: "3:0:0", pitch: "b4", dur: "16n" }
    ]
  },
  {  /** #23 by **/
    num: 23,
    duration: "3:0:0", //loop duration
    octave: 0, // leave this
    image: "sco1.png",
    sequence: [
      { time: "0:0:0", pitch: "E4", dur: "8n" },
      { time: "0:0:2", pitch: "F#4", dur: "4n." },
      { time: "0:2:0", pitch: "F#4", dur: "4n." },
      { time: "0:3:2", pitch: "F#4", dur: "4n." },
      { time: "1:1:0", pitch: "F#4", dur: "4n." },
      { time: "1:2:2", pitch: "F#4", dur: "4n." },
      { time: "2:0:0", pitch: "G4", dur: "4n." },
      { time: "2:1:2", pitch: "A4", dur: "4n." },
      { time: "2:3:0", pitch: "B4", dur: "4n" }
    ]
  },
  {  /** #24 by Sara Kolli */
    num: 24, // update this
    duration: "2:2:2", //loop duration
    octave: 0, // leave this
    image: "sco24.png", // update this
    sequence: [
      { time: "0:0:0", pitch: "e4", dur: "8n" },
      { time: "0:0:2", pitch: "f#4", dur: "8n" },
      { time: "0:1:0", pitch: "g4", dur: "4n." },
      { time: "0:2:2", pitch: "g4", dur: "4n." },
      { time: "1:0:0", pitch: "g4", dur: "4n." },
      { time: "1:1:2", pitch: "g4", dur: "4n." },
      { time: "1:1:2", pitch: "g4", dur: "4n." },
      { time: "1:3:0", pitch: "g4", dur: "4n." },
      { time: "2:0:2", pitch: "a4", dur: "4n." },
      { time: "2:2:0", pitch: "b4", dur: "8n" }
    ]
  },
  {  /** #25 by Alex Kopetz */
    num: 25,
    duration: "2:2:2", //loop duration
    octave: 0, // leave this
    image: "sco25.png",
    sequence: [
      { time: 0, pitch: "E4", dur: "8n" },
      { time: "0:0:2", pitch: "f#4", dur: "8n" },
      { time: "0:1:0", pitch: "g4", dur: "8n" },
      { time: "0:1:2", pitch: "a4", dur: "4n." },
      { time: "0:3:0", pitch: "a4", dur: "4n." },
      { time: "1:0:2", pitch: "a4", dur: "4n." },
      { time: "1:2:0", pitch: "a4", dur: "4n." },
      { time: "1:3:2", pitch: "a4", dur: "4n." },
      { time: "2:1:0", pitch: "b4", dur: "4n." }
    ]
  },
  {  /** #26 by Andrea Lopezmalo */
    num: 26,
    duration: "2:1:2", //loop duration
    octave: 0, // leave this
    image: "sco26.png",
    sequence: [
      { time: 0, pitch: "e4", dur: "8n" },
      { time: "0:0:2", pitch: "f#4", dur: "8n" },
      { time: "0:0:4", pitch: "G4", dur: "8n" },
      { time: "0:0:6", pitch: "A4", dur: "8n" },
      { time: "0:0:8", pitch: "B4", dur: "2n" },
      { time: "0:0:14", pitch: "B4", dur: "2n" },
      { time: "0:0:20", pitch: "B4", dur: "3n" },
      { time: "0:0:26", pitch: "B4", dur: "3n" },
      { time: "0:0:32", pitch: "B4", dur: "3n" }
    ]
  },
  {  /** # 27 by Dominic Mattiello */
    num: 27, // update this
    duration: "0:3:0", //loop duration
    octave: 0, // leave this
    image: "sco27.png", // update this
    sequence: [ // change this sequence
      { time: 0, pitch: "e4", dur: "16n" },
      { time: "0:0:1", pitch: "f#4", dur: "16n" },
      { time: "0:0:2", pitch: "e4", dur: "16n" },
      { time: "0:0:3", pitch: "f#4", dur: "16n" },
      { time: "0:1:0", pitch: "g4", dur: "8n" },
      { time: "0:1:2", pitch: "e4", dur: "16n" },
      { time: "0:1:3", pitch: "g4", dur: "16n" },
      { time: "0:2:0", pitch: "f#4", dur: "16n" },
      { time: "0:2:1", pitch: "e4", dur: "16n" },
      { time: "0:2:2", pitch: "f#4", dur: "16n" },
      { time: "0:2:3", pitch: "e4", dur: "16n" }
    ]
  },
  { /** #28 by Shawn McElligott */
    num: 28,
    duration: "0:2:0",
    octave: 0,
    image: "sco28.png",
    sequence: [
      { time: "0:0:0", pitch: "E4", dur: "16n" },
      { time: "0:0:1", pitch: "f#4", dur: "16n" },
      { time: "0:0:2", pitch: "e4", dur: "16n" },
      { time: "0:0:3", pitch: "f#4", dur: "16n" },
      { time: "0:1:0", pitch: "e4", dur: "8n." },
      { time: "0:1:3", pitch: "e4", dur: "16n" }
    ]
  },
  {  /** #29 by Anna Newcorn */
    num: 29, // update this
    duration: "2:1:0", //loop duration
    octave: 0, // leave this
    image: "sco29.png", // update this
    sequence: [ // change this sequence
      { time: "0:0:0", pitch: "E4", dur: "2n." },
      { time: "0:3:0", pitch: "G4", dur: "2n." },
      { time: "1:2:0", pitch: "C5", dur: "2n." }
    ]
  },
  {  /** #30 by DBW */
    num: 30,
    duration: "1:2:0", //loop duration
    octave: 0, // leave this
    image: "sco30.png",
    sequence: [
      { time: 0, pitch: "C5", dur: "1:2:0" }
    ]
  },
  {  /** #31 by Madalyn Schroeder */
    num: 31,
    duration: "0:1:2", //loop duration 
    octave: 0, // leave this
    image: "Sco31.png",
    sequence: [
      { time: "0:0:0", pitch: "G4", dur: "16n" },
      { time: "0:0:1", pitch: "F4", dur: "16n" },
      { time: "0:0:2", pitch: "G4", dur: "16n" },
      { time: "0:0:3", pitch: "B4", dur: "16n" },
      { time: "0:1:0", pitch: "G4", dur: "16n" },
      { time: "0:1:1", pitch: "B4", dur: "16n" }
    ]
  },
  {  /** #32 by Dani Rojas */
    num: 32,
    duration: "1:2:0", //loop duration
    octave: 0, // leave this
    image: "sco32.png", // update this
    sequence: [ // change this sequence
      { time: "0.0.0", pitch: "F4", dur: "16n" },
      { time: "0:0:1", pitch: "G4", dur: "16n" },
      { time: "0:0:2", pitch: "F4", dur: "16n" },
      { time: "0:0:3", pitch: "G4", dur: "16n" },
      { time: "0:1:0", pitch: "B4", dur: "16n" },
      { time: "0:1:1", pitch: "F4", dur: "0:3:1" },
      { time: "1:0:2", pitch: "G4", dur: "4n." }
    ]
  },
  { /** #33 by **/
    num: 33,
    duration: "4n",
    octave: 0,
    image: "sco33.png",
    sequence: [
      { time: "0:0:0", pitch: "G4", dur: "16n" },
      { time: "0:0:1", pitch: "F4", dur: "16n" }
    ]
  },
  {  /** #34 by Harrison Snyder */
    num: 34, // update this
    duration: "0:0:2", //loop duration
    octave: 0, // leave this
    image: "sco34.png", // update this
    sequence: [ // change this sequence
      { time: 0, pitch: "G4", dur: "16n" },
      { time: "0:0:1", pitch: "F4", dur: "16n" }
    ]
  },
  {/** #35 by DBW **/
    num: 35,
    duration: "9:0:0",
    octave: 0,
    image: "sco35.png",
    sequence: [
      { time: 0, pitch: "F4", dur: "16n" },
      { time: "0:0:1", pitch: "G4", dur: "16n" },
      { time: "0:0:2", pitch: "B4", dur: "16n" },
      { time: "0:0:3", pitch: "G4", dur: "16n" },
      { time: "0:1:0", pitch: "B4", dur: "16n" },
      { time: "0:1:1", pitch: "G4", dur: "16n" },
      { time: "0:1:2", pitch: "B4", dur: "16n" },
      { time: "0:1:3", pitch: "G4", dur: "16n" },
      { time: "0:2:0", pitch: "B4", dur: "16n" },
      { time: "0:2:1", pitch: "G4", dur: "16n" },
      { time: "2:2:0", pitch: "Bb4", dur: "4n" },
      { time: "2:3:0", pitch: "G5", dur: "2n." },
      { time: "3:2:0", pitch: "A5", dur: "8n" },
      { time: "3:2:2", pitch: "G5", dur: "4n" },
      { time: "3:3:2", pitch: "B5", dur: "8n" },
      { time: "4:0:0", pitch: "A5", dur: "4n." },
      { time: "4:1:2", pitch: "G5", dur: "8n" },
      { time: "4:2:0", pitch: "E5", dur: "2n." },
      { time: "5:1:0", pitch: "G5", dur: "8n" },
      { time: "5:1:2", pitch: "F#5", dur: "0:3:2" },
      { time: "6:3:2", pitch: "E5", dur: "0:2:2" },
      { time: "7:2:0", pitch: "F5", dur: "1:2:0" }
    ]
  },
  {  /** #36 by Natalia Sorbjan */
    num: 36,
    duration: "0:1:2", //loop duration
    octave: 0, // leave this
    image: "sco36.png",
    sequence: [
      { time: "0:0:0", pitch: "F4", dur: "16n" },
      { time: "0:0:1", pitch: "G4", dur: "16n" },
      { time: "0:0:2", pitch: "B4", dur: "16n" },
      { time: "0:0:3", pitch: "G4", dur: "16n" },
      { time: "0:1:0", pitch: "B4", dur: "16n" },
      { time: "0:1:1", pitch: "G4", dur: "16n" }
    ]
  },
  {  /** #37 by Will Stevens*/
    num: 37, // update this
    duration: " 0:0:2 ", //loop duration
    octave: 0, // leave this
    image: "sco37.png", // update this
    sequence: [ // change this sequence
      { time: "0:0:0", pitch: "F4", dur: "16n" },
      { time: "0:0:1", pitch: "G4", dur: "16n" }
    ]
  },
  { /** #38 by **/
    num: 38,
    duration: "0:0:3",
    octave: 0,
    image: "sco38.png",
    sequence: [
      { time: "0:0:0", pitch: "F4", dur: "16n" },
      { time: "0:0:1", pitch: "G4", dur: "16n" },
      { time: "0:0:2", pitch: "B4", dur: "16n" }
    ]
  },
  { /** #39 by **/
    num: 39,
    duration: "0:1:2",
    octave: 0,
    image: "sco39.png",
    sequence: [
      { time: "0:0:0", pitch: "b4", dur: "16n" },
      { time: "0:0:1", pitch: "g4", dur: "16n" },
      { time: "0:0:2", pitch: "f4", dur: "16n" },
      { time: "0:0:3", pitch: "g4", dur: "16n" },
      { time: "0:1:0", pitch: "b4", dur: "16n" },
      { time: "0:1:1", pitch: "c5", dur: "16n" }
    ]
  },
  {  /** #40 by **/
    num: 40,
    duration: "0:0:2", //loop duration
    octave: 0, // leave this
    image: "sco40.png", // update this
    sequence: [ // change this sequence
      { time: 0, pitch: "b4", dur: "32n" },
      { time: "0:0:1", pitch: "f4", dur: "32n" }
    ]
  },
  {  /** #41 by Ethan Wang **/
    num: 41,
    duration: "0:0:2", //loop duration
    octave: 0, // leave this
    image: "sco41.png",
    sequence: [
      { time: 0, pitch: "b4", dur: "16n" },
      { time: "0:0:1", pitch: "g4", dur: "16n" }
    ]
  },
  { /** #42 by Ethan Wang **/
    num: 42,
    duration: "4:0:0", //loop duration
    octave: 0, // leave this
    image: "sco42.png",
    sequence: [
      { time: 0, pitch: "c5", dur: "1n" },
      { time: "1:0:0", pitch: "b4", dur: "1n" },
      { time: "2:0:0", pitch: "a4", dur: "1n" },
      { time: "3:0:0", pitch: "c5", dur: "1n" }
    ]
  },
  { /** #43 by **/
    num: 43,
    duration: "0:3:0", //loop duration
    octave: 0, // leave this
    image: "sco43.png",
    sequence: [ // change this sequence
      { time: 0, pitch: "f5", dur: "16n" },
      { time: "0:0:1", pitch: "e5", dur: "16n" },
      { time: "0:0:2", pitch: "f5", dur: "16n" },
      { time: "0:0:3", pitch: "e5", dur: "16n" },
      { time: "0:1:0", pitch: "e5", dur: "8n" },
      { time: "0:1:2", pitch: "e5", dur: "8n" },
      { time: "0:2:0", pitch: "e5", dur: "8n" },
      { time: "0:2:2", pitch: "f5", dur: "16n" },
      { time: "0:2:3", pitch: "e5", dur: "16n" }
    ]
  },
  { /** #44 by Will Stevens **/
    num: 44,
    duration: " 0:3:0 ", //loop duration
    octave: 0, // leave this
    image: "sco44.png",
    sequence: [
      { time: "0:0:0", pitch: "F5", dur: "8n" },
      { time: "0:0:2", pitch: "E5", dur: "4n" },
      { time: "0:1:2", pitch: "E5", dur: "8n" },
      { time: "0:2:0", pitch: "C5", dur: "4n" }
    ]
  },
  { /** #45 by Harrison Snyder**/
    num: 45,
    duration: "0:3:0", //loop duration
    octave: 0, // leave this
    image: "sco45.png",
    sequence: [
      { time: 0, pitch: "D5", dur: "4n" },
      { time: "0:1:0", pitch: "D5", dur: "4n" },
      { time: "0:2:0", pitch: "G4", dur: "4n" }
    ]
  },
  { /** #46 by **/
    num: 46,
    duration: "1:1:0",
    octave: 0,
    image: "sco46.png",
    sequence: [
      { time: "0:0:0", pitch: "G4", dur: "16n" },
      { time: "0:0:1", pitch: "D5", dur: "16n" },
      { time: "0:0:2", pitch: "E5", dur: "16n" },
      { time: "0:0:3", pitch: "D5", dur: "16n" },
      { time: "0:1:2", pitch: "G4", dur: "8n" },
      { time: "0:2:2", pitch: "G4", dur: "8n" },
      { time: "0:3:2", pitch: "G4", dur: "8n" },
      { time: "1:0:0", pitch: "G4", dur: "16n" },
      { time: "1:0:1", pitch: "D5", dur: "16n" },
      { time: "1:0:2", pitch: "E5", dur: "16n" },
      { time: "1:0:3", pitch: "D5", dur: "16n" }
    ]
  },
  { /** #47 by **/
    num: 47,
    duration: "0:1:0",
    octave: 0,
    image: "sco47.png",
    sequence: [
      { time: "0:0:0", pitch: "D5", dur: "16n" },
      { time: "0:0:1", pitch: "E5", dur: "16n" },
      { time: "0:0:2", pitch: "D5", dur: "16n" }
    ]
  },
  { /** #48 by **/
    num: 48, // update this
    duration: "3:3:0", //loop duration
    octave: 0, // leave this
    image: "sco48.png",
    sequence: [ // change this sequence
      { time: "0:0", pitch: "G4", dur: "1:2" },
      { time: "1:2", pitch: "G4", dur: "1:0" },
      { time: "2:2", pitch: "F4", dur: "1:1:0" }
    ]
  },
  { /** #49 by **/
    num: 49,
    duration: "0:1:2",
    octave: 0,
    image: "sco49.png",
    sequence: [
      { time: "0:0:0", pitch: "F4", dur: "16n" },
      { time: "0:0:1", pitch: "G4", dur: "16n" },
      { time: "0:0:2", pitch: "A#4", dur: "16n" },
      { time: "0:0:3", pitch: "G4", dur: "16n" },
      { time: "0:1:0", pitch: "A#4", dur: "16n" },
      { time: "0:1:1", pitch: "G4", dur: "16n" }
    ]
  },
  { /** #50 by DBW**/
    num: 50, // update this
    duration: "0:2:0", //loop duration
    octave: 0, // leave this
    image: "sco50.png",
    sequence: [ // change this sequence
      { time: 0, pitch: "f4", dur: "16n" },
      { time: "0:0:1", pitch: "g4", dur: "16n" }
    ]
  },
  { /** #51 by Anna Newcorn**/
    num: 51,
    duration: "8n.", //loop duration
    octave: 0, // leave this
    image: "sco51.png",
    sequence: [
      { time: "0:0:0", pitch: "F4", dur: "16n" },
      { time: "0:0:1", pitch: "G4", dur: "16n" },
      { time: "0:0:2", pitch: "B4", dur: "16n" }
    ]
  },
  { /** #52 by Natalia Sorbjan**/
    num: 52, // update this
    duration: "0:0:2", //loop duration
    octave: 0, // leave this
    image: "sco52.png",
    sequence: [ // change this sequence
      { time: "0:0:0", pitch: "G4", dur: "16n" },
      { time: "0:0:1", pitch: "Bb4", dur: "16n" }
    ]
  },
  { /** #53 by **/
    num: 53,
    duration: "0:0:2",
    octave: 0,
    image: "sco53.png",
    sequence: [
      { time: "0:0:0", pitch: "a#4", dur: "16n" },
      { time: "0:0:1", pitch: "g4", dur: "16n" }
    ]
  }
];
var sketches = new Array(); // global array of sequence GUI sketches

makeSeqPlayer(InC_phrases);

function makeSeqPlayer(obj){
  //document.getElementById("sequences").innerHTML = JSON.stringify(obj);

  if(Array.isArray(obj)){
  //  let seqDiv = document.getElementById("sequences");
  //  let p = document.createElement('p');
  //  p.innerHTML = JSON.stringify(obj);
  //  seqDiv.appendChild(p);
  

    for(let i = 0; i < obj.length; i++){
      //console.log(obj[i].name);
      let seqDiv = document.getElementById("sequences");
      let d = document.createElement('div');
      d.className = "seqPlayer";
      d.id = "seqence_" + (i + 1);
      seqDiv.appendChild(d);
      let sketch = new p5(seqGUI, d); // invoke p5 and add it to the div
      sketch.setObj(obj[i]); // hand a reference to the sequence to the sketch
      sketches.push(sketch); // add to a global array for later
    }

  }  
}



