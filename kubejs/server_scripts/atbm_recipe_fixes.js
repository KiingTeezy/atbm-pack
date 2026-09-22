// More Villagers ships gilded_station with an old-format recipe file that the game cannot read, so the block
// is uncraftable (the mod marks it WIP). Re-add it here with the same ingredients in the current format.
ServerEvents.recipes((event) => {
  event.remove({ id: "morevillagers:gilded_station" })
  event.shaped("morevillagers:gilded_station", ["@@", "##", "##"], {
    "#": "minecraft:oak_log",
    "@": "minecraft:gold_block"
  }).id("morevillagers:gilded_station")
})
