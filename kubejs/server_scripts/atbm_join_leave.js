// All The Better Mooks: custom join/leave chat messages and sounds.
// Broadcasts to all online players whenever someone logs in or out.
// The first-time welcome (rules + guide) stays in atbm_welcome.js; this fires every time.

// --- Join message templates (use {name} as placeholder) ---
const JOIN_MESSAGES = [
  "{name} mined their way into the server!",
  "{name} just showed up like a creeper behind you.",
  "Alert! {name} has spawned in the Province!",
  "{name} emerged from a Nether portal. Welcome back!",
  "A new challenger approaches! It is {name}!",
  "{name} found a diamond... and it was this server.",
  "{name} traded an emerald with a villager to get here.",
  "{name} slept through the night and woke up here!",
  "{name} broke through bedrock to join us!",
  "The prophecy is true... {name} has returned!"
]

// --- Leave message templates (use {name} as placeholder) ---
const LEAVE_MESSAGES = [
  "{name} fell into lava. Probably.",
  "{name} was blown up by a creeper. Or just left.",
  "{name} went to go punch some trees in real life.",
  "{name} tried to sleep in the Nether. Oops.",
  "{name} got distracted by a wandering trader.",
  "{name} is off to find a village with better deals.",
  "{name} left the game to eat. Even Steve gets hungry.",
  "A skeleton shot {name} offline. We think.",
  "{name} dug straight down and disappeared!",
  "{name} set their spawn point somewhere else."
]

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// --- Note block jingle helpers ---
// Plays a short sequence of note block sounds with delays between notes.
// Each note is { instrument, pitch, volume, delayTicks }.
// instrument: e.g. "block.note_block.bell", "block.note_block.pling", "block.note_block.harp", "block.note_block.bass"
// pitch: Minecraft note pitch (0.5 = F#3, 1.0 = F#4, 2.0 = F#5; each semitone is * 2^(1/12))
// NBS reference pitches for common notes:
//   C4=0.5946, D4=0.6674, E4=0.7491, F4=0.7937, G4=0.8909, A4=1.0, B4=1.1225
//   C5=1.1892, D5=1.3348, E5=1.4983, F5=1.5874, G5=1.7818, A5=2.0

function playJingle(server, notes) {
  let tick = 0
  for (let i = 0; i < notes.length; i++) {
    let n = notes[i]
    if (i > 0) {
      tick += n.delayTicks
    }
    let vol = n.volume || 0.4
    let cmd = "execute as @a at @s run playsound minecraft:" + n.instrument + " master @s ~ ~ ~ " + vol + " " + n.pitch
    if (tick === 0) {
      server.runCommandSilent(cmd)
    } else {
      server.scheduleInTicks(tick, (callback) => {
        callback.server.runCommandSilent(cmd)
      })
    }
  }
}

// Join jingle: cheerful rising 3-note chime (bell/pling)
// E4 -> G4 -> C5, quick and bright
const JOIN_JINGLE = [
  { instrument: "block.note_block.bell", pitch: 0.7491, volume: 0.35, delayTicks: 0 },
  { instrument: "block.note_block.pling", pitch: 0.8909, volume: 0.35, delayTicks: 3 },
  { instrument: "block.note_block.bell", pitch: 1.1892, volume: 0.4, delayTicks: 3 }
]

// Leave jingle: short falling 3-note tune (harp/bass)
// G4 -> E4 -> C4, gentle descent
const LEAVE_JINGLE = [
  { instrument: "block.note_block.harp", pitch: 0.8909, volume: 0.35, delayTicks: 0 },
  { instrument: "block.note_block.harp", pitch: 0.7491, volume: 0.3, delayTicks: 3 },
  { instrument: "block.note_block.bass", pitch: 0.5946, volume: 0.3, delayTicks: 3 }
]

// KiingTeezy fanfare: firework + short triumphant pling fanfare
// C5 -> E5 -> G5 -> C6(high), bold and regal
const TEEZY_FANFARE = [
  { instrument: "block.note_block.pling", pitch: 1.1892, volume: 0.4, delayTicks: 0 },
  { instrument: "block.note_block.pling", pitch: 1.4983, volume: 0.4, delayTicks: 2 },
  { instrument: "block.note_block.bell", pitch: 1.7818, volume: 0.45, delayTicks: 2 },
  { instrument: "block.note_block.bell", pitch: 2.0, volume: 0.5, delayTicks: 3 }
]

PlayerEvents.loggedIn((event) => {
  let name = event.player.username
  let isOverseer = name.toLowerCase() === "kiingteezy"
  let msg

  if (isOverseer) {
    msg = [
      "",
      { text: "The Overseer ", color: "#DAA520" },
      { text: "Himothy Himtaro", color: "gold", bold: true },
      { text: " has joined the Province", color: "#DAA520" }
    ]
    // Firework launch + fanfare
    event.server.runCommandSilent("execute as @a at @s run playsound minecraft:entity.firework_rocket.launch master @s ~ ~ ~ 0.6 1.0")
    playJingle(event.server, TEEZY_FANFARE)
  } else {
    let template = pickRandom(JOIN_MESSAGES)
    let parts = template.split("{name}")
    msg = [""]
    for (let i = 0; i < parts.length; i++) {
      if (i > 0) {
        msg.push({ text: name, color: "gold", bold: true })
      }
      if (parts[i].length > 0) {
        msg.push({ text: parts[i], color: "green" })
      }
    }
    playJingle(event.server, JOIN_JINGLE)
  }

  event.server.runCommandSilent("tellraw @a " + JSON.stringify(msg))
})

PlayerEvents.loggedOut((event) => {
  let name = event.player.username
  let isOverseer = name.toLowerCase() === "kiingteezy"
  let displayName = isOverseer ? "Himothy Himtaro" : name
  let template = pickRandom(LEAVE_MESSAGES)
  let parts = template.split("{name}")
  let msg = [""]
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) {
      msg.push({ text: displayName, color: "gold", bold: true })
    }
    if (parts[i].length > 0) {
      msg.push({ text: parts[i], color: "red" })
    }
  }

  event.server.runCommandSilent("tellraw @a " + JSON.stringify(msg))
  if (isOverseer) {
    event.server.runCommandSilent("execute as @a at @s run playsound minecraft:entity.firework_rocket.launch master @s ~ ~ ~ 0.6 1.0")
    playJingle(event.server, TEEZY_FANFARE)
  } else {
    playJingle(event.server, LEAVE_JINGLE)
  }
})
