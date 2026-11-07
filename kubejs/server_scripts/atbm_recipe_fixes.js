// More Villagers ships gilded_station with an old-format recipe file that the game cannot read, so the block
// is uncraftable (the mod marks it WIP). Re-add it here with the same ingredients in the current format.
ServerEvents.recipes((event) => {
  event.remove({ id: "morevillagers:gilded_station" })
  event.shaped("morevillagers:gilded_station", ["@@", "##", "##"], {
    "#": "minecraft:oak_log",
    "@": "minecraft:gold_block"
  }).id("morevillagers:gilded_station")
})

// Ultimate Car Mod's tank and Stellaris' Tier 1 Fluid Tank share the exact same recipe (iron ingots in the
// corners, glass on the edges), so only the Stellaris one could ever be crafted. Give the car tank glass panes
// on the edges instead; no other recipe in the pack uses that layout.
ServerEvents.recipes((event) => {
  event.remove({ id: "car:tank" })
  event.shaped("car:tank", ["IGI", "G G", "IGI"], {
    "I": "#c:ingots/iron",
    "G": "#c:glass_panes/colorless"
  }).id("car:tank")
})
