// All The Better Mooks: join/leave chat messages and sounds, changeable live with /joinmsg (owner 2026-11-12).
// Settings are saved with the world (server persistentData), so changing them needs no file edit and no restart.
// The first-time welcome (rules + guide) stays in atbm_welcome.js; this fires on every join/leave.
//
// /joinmsg (operators and the server console only):
//   joinmsg help                                 this list
//   joinmsg show                                 the current settings, in chat
//   joinmsg export                               the settings as one JSON line (Mook HQ's dashboard reads it)
//   joinmsg player <name> display <text>         show <name> as <text> in these messages ("-" = their own name)
//   joinmsg player <name> namecolor <colour>     colour of their name
//   joinmsg player <name> joincolor <colour>     colour of the rest of their join line
//   joinmsg player <name> leavecolor <colour>    colour of the rest of their leave line
//   joinmsg player <name> join <text>            their own join line, {name} = their name ("-" = random)
//   joinmsg player <name> leave <text>           their own leave line ("-" = random)
//   joinmsg player <name> sound <jingle|fanfare|none>
//   joinmsg player <name> reset                  back to the normal messages
//   joinmsg default <namecolor|joincolor|leavecolor> <colour>
//   joinmsg add <join|leave> <text>              add a random line ({name} = the player)
//   joinmsg remove <join|leave> <number>         remove random line <number> (see `joinmsg show`)
//   joinmsg sounds <on|off>
//   joinmsg preview <name> <join|leave>          show only you what it looks like
//   joinmsg resetall                             every setting back to the pack's defaults
// Colours: black dark_blue dark_green dark_aqua dark_red dark_purple gold gray dark_gray blue green aqua red
// light_purple yellow white, or #RRGGBB.

const JOINMSG_KEY = "atbm_joinmsg"
const COLOURS = ["black", "dark_blue", "dark_green", "dark_aqua", "dark_red", "dark_purple", "gold", "gray",
  "dark_gray", "blue", "green", "aqua", "red", "light_purple", "yellow", "white"]

function defaultSettings() {
  return {
    sounds: true,
    nameColor: "gold",
    joinColor: "green",
    leaveColor: "red",
    join: [
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
    ],
    leave: [
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
    ],
    // keyed by lower-case username
    players: {
      kiingteezy: {
        display: "Himothy Himtaro",
        nameColor: "gold",
        joinColor: "green",
        leaveColor: "green",
        join: "The Overseer {name} has joined the Province",
        sound: "fanfare"
      }
    }
  }
}

// --- settings storage --------------------------------------------------------------------------------------
function loadSettings(server) {
  // 26.1: CompoundTag.getString returns Optional<String> (Rhino passes it through as "Optional[...]"); getStringOr is plain
  let raw = String(server.persistentData.getStringOr(JOINMSG_KEY, ""))
  if (raw) {
    try {
      let s = JSON.parse(raw)
      if (s && Array.isArray(s.join) && s.join.length && Array.isArray(s.leave) && s.leave.length &&
          s.players && typeof s.players === "object") return s
    } catch (e) {
      console.warn("joinmsg: saved settings unreadable, using defaults: " + e)
    }
  }
  return defaultSettings()
}

function saveSettings(server, s) {
  server.persistentData.putString(JOINMSG_KEY, JSON.stringify(s))
}

// --- pure helpers (tests/test_joinmsg.js runs these under node) --------------------------------------------
function validColour(c) {
  c = String(c || "").toLowerCase()
  return COLOURS.indexOf(c) >= 0 || /^#[0-9a-f]{6}$/.test(c) ? c : null
}

// Rhino's JSON.stringify escapes only quotes: a backslash or control character would break the tellraw JSON and the
// saved settings (2026-11-12 audit), so free text may not contain them.
const BAD_TEXT = /[\\\u0000-\u001f\u007f]/

// A player's own settings: own properties only ("constructor" is a valid Minecraft name).
function own(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// The tellraw component list for one message: the name in its colour (bold), every other part in textColour.
function buildMessage(template, display, nameColour, textColour) {
  let parts = String(template).split("{name}")
  let msg = [""]
  if (parts.length === 1) parts = ["", " " + parts[0]]          // a line without {name}: put the name first
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) msg.push({ text: display, color: nameColour, bold: true })
    if (parts[i].length > 0) msg.push({ text: parts[i], color: textColour })
  }
  return msg
}

// What a join/leave looks like for one player: { msg, sound }.
function messageFor(s, username, kind) {
  let p = own(s.players, String(username).toLowerCase()) || {}
  let display = p.display || username
  let template = p[kind] || pickRandom(s[kind])
  let textColour = p[kind + "Color"] || s[kind + "Color"]
  return { msg: buildMessage(template, display, p.nameColor || s.nameColor, textColour), sound: p.sound || "jingle" }
}

// Apply one /joinmsg command to the settings. Returns { reply, changed }.
function applyCommand(s, input) {
  let words = String(input || "").trim().split(/\s+/)
  let rest = (n) => String(input).trim().split(/\s+/).slice(n).join(" ")
  let cmd = (words[0] || "help").toLowerCase()
  let fail = (t) => ({ reply: t, changed: false })
  let ok = (t) => ({ reply: t, changed: true })
  if (cmd === "help" || cmd === "") return fail("joinmsg: show | export | player <name> <display|namecolor|joincolor|leavecolor|join|leave|sound|reset> [value] | default <namecolor|joincolor|leavecolor> <colour> | add <join|leave> <text> | remove <join|leave> <number> | sounds <on|off> | preview <name> <join|leave> | resetall")
  if (cmd === "player") {
    let name = (words[1] || "").toLowerCase(), field = (words[2] || "").toLowerCase(), value = rest(3)
    if (!/^[a-z0-9_]{2,16}$/.test(name) || name === "__proto__") return fail("Give a Minecraft username: joinmsg player <name> ...")
    let p = own(s.players, name) || {}
    if (field === "reset") {
      delete s.players[name]
      return ok(name + " now gets the normal messages.")
    }
    if (field === "display" || field === "join" || field === "leave") {
      if (!value) return fail("Give the text (or - to clear it).")
      if (value.length > 200) return fail("Keep it under 200 characters.")
      if (BAD_TEXT.test(value)) return fail("Backslashes and special control characters are not allowed in messages.")
      if (value === "-") delete p[field]; else p[field] = value
    } else if (field === "namecolor" || field === "joincolor" || field === "leavecolor") {
      let c = value === "-" ? "-" : validColour(value)
      if (!c) return fail("Unknown colour '" + value + "'. Use a name like gold or green, or #RRGGBB.")
      let key = { namecolor: "nameColor", joincolor: "joinColor", leavecolor: "leaveColor" }[field]
      if (c === "-") delete p[key]; else p[key] = c
    } else if (field === "sound") {
      if (["jingle", "fanfare", "none"].indexOf(value) < 0) return fail("Sound is jingle, fanfare or none.")
      p.sound = value
    } else {
      return fail("Unknown setting '" + field + "'. Use display, namecolor, joincolor, leavecolor, join, leave, sound or reset.")
    }
    s.players[name] = p
    return ok("Saved " + field + " for " + name + ".")
  }
  if (cmd === "default") {
    let key = { namecolor: "nameColor", joincolor: "joinColor", leavecolor: "leaveColor" }[(words[1] || "").toLowerCase()]
    let c = validColour(words[2])
    if (!key) return fail("Use: joinmsg default <namecolor|joincolor|leavecolor> <colour>")
    if (!c) return fail("Unknown colour '" + (words[2] || "") + "'.")
    s[key] = c
    return ok("Everyone's " + words[1].toLowerCase() + " is now " + c + " (unless set per player).")
  }
  if (cmd === "add" || cmd === "remove") {
    let kind = (words[1] || "").toLowerCase()
    if (kind !== "join" && kind !== "leave") return fail("Use join or leave: joinmsg " + cmd + " <join|leave> ...")
    if (cmd === "add") {
      let text = rest(2)
      if (!text || text.length > 200) return fail("Give the line (under 200 characters), with {name} for the player.")
      if (BAD_TEXT.test(text)) return fail("Backslashes and special control characters are not allowed in messages.")
      s[kind].push(text)
      return ok("Added " + kind + " line " + s[kind].length + ".")
    }
    let n = parseInt(words[2], 10)
    if (!(n >= 1 && n <= s[kind].length)) return fail("Give a line number from 1 to " + s[kind].length + ".")
    if (s[kind].length === 1) return fail("Keep at least one " + kind + " line.")
    let gone = s[kind].splice(n - 1, 1)[0]
    return ok("Removed " + kind + " line " + n + ": " + gone)
  }
  if (cmd === "sounds") {
    let v = (words[1] || "").toLowerCase()
    if (v !== "on" && v !== "off") return fail("Use: joinmsg sounds <on|off>")
    s.sounds = v === "on"
    return ok("Join/leave sounds are " + v + ".")
  }
  if (cmd === "resetall") {
    let d = defaultSettings()
    for (let k in s) delete s[k]
    for (let k in d) s[k] = d[k]
    return ok("Every join/leave setting is back to the pack's defaults.")
  }
  return fail("Unknown: joinmsg " + cmd + ". Try joinmsg help.")
}

// --- sounds --------------------------------------------------------------------------------------------------
// Each note: { instrument, pitch, volume, delayTicks }. Pitch 1.0 = F#4; C4=0.5946 E4=0.7491 G4=0.8909 C5=1.1892
const JINGLES = {
  join: [
    { instrument: "block.note_block.bell", pitch: 0.7491, volume: 0.35, delayTicks: 0 },
    { instrument: "block.note_block.pling", pitch: 0.8909, volume: 0.35, delayTicks: 3 },
    { instrument: "block.note_block.bell", pitch: 1.1892, volume: 0.4, delayTicks: 3 }
  ],
  leave: [
    { instrument: "block.note_block.harp", pitch: 0.8909, volume: 0.35, delayTicks: 0 },
    { instrument: "block.note_block.harp", pitch: 0.7491, volume: 0.3, delayTicks: 3 },
    { instrument: "block.note_block.bass", pitch: 0.5946, volume: 0.3, delayTicks: 3 }
  ],
  fanfare: [
    { instrument: "block.note_block.pling", pitch: 1.1892, volume: 0.4, delayTicks: 0 },
    { instrument: "block.note_block.pling", pitch: 1.4983, volume: 0.4, delayTicks: 2 },
    { instrument: "block.note_block.bell", pitch: 1.7818, volume: 0.45, delayTicks: 2 },
    { instrument: "block.note_block.bell", pitch: 2.0, volume: 0.5, delayTicks: 3 }
  ]
}

function playJingle(server, notes) {
  let tick = 0
  for (let i = 0; i < notes.length; i++) {
    let n = notes[i]
    if (i > 0) tick += n.delayTicks
    let cmd = "execute as @a at @s run playsound minecraft:" + n.instrument + " master @s ~ ~ ~ " + (n.volume || 0.4) + " " + n.pitch
    if (tick === 0) {
      server.runCommandSilent(cmd)
    } else {
      // callback.server is undefined in scheduleInTicks callbacks on this KubeJS: use the outer server (2026-11-12)
      server.scheduleInTicks(tick, () => { server.runCommandSilent(cmd) })
    }
  }
}

function announce(server, username, kind) {
  let s = loadSettings(server)
  let m = messageFor(s, username, kind)
  server.runCommandSilent("tellraw @a " + JSON.stringify(m.msg))
  if (!s.sounds || m.sound === "none") return
  if (m.sound === "fanfare") {
    server.runCommandSilent("execute as @a at @s run playsound minecraft:entity.firework_rocket.launch master @s ~ ~ ~ 0.6 1.0")
    playJingle(server, JINGLES.fanfare)
  } else {
    playJingle(server, JINGLES[kind])
  }
}

// --- KubeJS hooks (skipped when tests/test_joinmsg.js loads this file under node) ---------------------------
if (typeof PlayerEvents !== "undefined") {
  PlayerEvents.loggedIn((event) => announce(event.server, event.player.username, "join"))
  PlayerEvents.loggedOut((event) => announce(event.server, event.player.username, "leave"))

  ServerEvents.basicCommand("joinmsg", (event) => {
    let server = event.server
    let input = String(event.input || "").trim()
    let s = loadSettings(server)
    let first = (input.split(/\s+/)[0] || "").toLowerCase()
    if (first === "export") {
      event.respond("[ATBM-JOINMSG] " + JSON.stringify(s))
      return
    }
    if (first === "show") {
      let lines = ["Join/leave settings (sounds " + (s.sounds ? "on" : "off") + "; colours: name " + s.nameColor +
        ", join " + s.joinColor + ", leave " + s.leaveColor + ")"]
      for (let k in s.players) {
        let p = s.players[k]
        lines.push("  " + k + ": " + JSON.stringify(p))
      }
      s.join.forEach((t, i) => lines.push("  join " + (i + 1) + ": " + t))
      s.leave.forEach((t, i) => lines.push("  leave " + (i + 1) + ": " + t))
      lines.forEach((l) => event.respond(l))
      return
    }
    if (first === "preview") {
      let w = input.split(/\s+/)
      let kind = (w[2] || "join").toLowerCase() === "leave" ? "leave" : "join"
      if (!w[1]) { event.respond("Use: joinmsg preview <name> <join|leave>"); return }
      let m = messageFor(s, w[1], kind)
      if (event.player) server.runCommandSilent("tellraw " + event.player.username + " " + JSON.stringify(m.msg))
      event.respond("[ATBM-JOINMSG-PREVIEW] " + JSON.stringify(m.msg))
      return
    }
    let r = applyCommand(s, input)
    if (r.changed) saveSettings(server, s)
    event.respond(r.reply)
  })
}

if (typeof module !== "undefined") {
  module.exports = { defaultSettings, applyCommand, messageFor, buildMessage, validColour, loadSettings, saveSettings }
}
