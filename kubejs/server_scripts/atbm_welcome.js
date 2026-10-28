// All The Better Mooks: rules + Discord link for players joining for the first time (going public, 3.4.0).
// The vanilla entity tag marks who has seen it, so it shows once per player and survives restarts.
// 3.4.2: new players also get the Server Guide opened for them (kubejs/data/atbm/function/open_guide.mcfunction).
const ATBM_WELCOMED = "atbm.welcomed"
const ATBM_GUIDE_PENDING = "atbm.guide_pending"
const ATBM_DISCORD = "https://discord.gg/24euSkCfkn"

const ATBM_WELCOME = [
  { text: "Welcome to All The Better Mooks!", color: "gold", bold: true },
  { text: "\nThe rules, short version:", color: "yellow" },
  { text: "\n 1. Be decent. No harassment, slurs or spam.", color: "white" },
  { text: "\n 2. No griefing or stealing, claimed or not. Every block is logged.", color: "white" },
  { text: "\n 3. No x-ray, hacked clients or dupe exploits.", color: "white" },
  { text: "\nEverything else - first steps, keys, voice chat - is in the ", color: "yellow" },
  { text: "Server Guide", color: "gold", bold: true },
  { text: ". Open it any time: Esc, then Server Guide (top left).", color: "yellow" },
  { text: "\nQuestions, bugs, or someone breaking the rules? ", color: "yellow" },
  { text: "Join our Discord", color: "aqua", underlined: true,
    click_event: { action: "open_url", url: ATBM_DISCORD } },
]

// Pure commands, no Java calls on the player: getTags and getStringUUID are both missing under those
// names on 26.1. The selector picks whoever has not been welcomed yet, i.e. the player who just joined.
const ATBM_NEW = "@a[tag=!" + ATBM_WELCOMED + "]"
PlayerEvents.loggedIn((event) => {
  event.server.runCommandSilent("execute as " + ATBM_NEW + " run tellraw @s " + JSON.stringify([""].concat(ATBM_WELCOME)))
  event.server.runCommandSilent("tag " + ATBM_NEW + " add " + ATBM_GUIDE_PENDING)
  event.server.runCommandSilent("tag " + ATBM_NEW + " add " + ATBM_WELCOMED)
  event.server.runCommandSilent("schedule function atbm:open_guide 200t replace")
})
