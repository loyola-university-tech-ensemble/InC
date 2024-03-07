/**
 * Ostinato Patterns for the Conductor Page of the InC mobile web app
 * 
 * Use the selector menu in the conductor App to choose different ostinato patterns during performance
 * The const 'ostPatterns' is referenced in 'scripts/conductor.js'
 * 
 * - DBW March 7, 2024
 */
const ostPatterns = [
    {
      "name" : "Eighth Notes on C5",
      "pattern" : [
        {"time" : 0, "note" : ["C5"], "vel": 1}, 
        {"time" : "0:0:2", "note" : ["C5"], "vel": 0.5}, 
        {"time" : "0:1:0", "note" : ["C5"], "vel": 1},
        {"time" : "0:1:2", "note" : ["C5"], "vel": 0.5}, 
        {"time" : "0:2:0", "note" : ["C5"], "vel": 1},
        {"time" : "0:2:2", "note" : ["C5"], "vel": 0.5}, 
        {"time" : "0:3:0", "note" : ["C5"], "vel": 1},
        {"time" : "0:3:2", "note" : ["C5"], "vel": 0.5}
      ]
    },
    {
      "name" : "Quarter Notes on C5",
      "pattern" : [
        {"time" : 0, "note" : ["C5"], "vel": 1}, 
        {"time" : "0:1:0", "note" : ["C5"], "vel": 1},
        {"time" : "0:2:0", "note" : ["C5"], "vel": 1},
        {"time" : "0:3:0", "note" : ["C5"], "vel": 1}
      ]
    },
    {
        "name" : "3-8n pickup on C5",
        "pattern" : [
            {"time" : "0:0:2", "note" : ["C5"], "vel": 0.5}, 
            {"time" : "0:1:0", "note" : ["C5"], "vel": 1},
            {"time" : "0:1:2", "note" : ["C5"], "vel": 0.5}, 
            {"time" : "0:2:2", "note" : ["C5"], "vel": 0.5}, 
            {"time" : "0:3:0", "note" : ["C5"], "vel": 1},
            {"time" : "0:3:2", "note" : ["C5"], "vel": 0.5}
        ]
      }
    ]