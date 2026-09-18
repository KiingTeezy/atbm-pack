// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.

if (Platform.isLoaded("the_bumblezone")) {
  ServerEvents.tags("item", (event) => {
    event.add("functionalstorage:ignore_crafting_check", "the_bumblezone:pollen_puff")
  })

  ServerEvents.tags("item", (event) => {
    // TODO: Fix this with neoforge tag system
    const saplings = event.get("minecraft:saplings").getObjectIds()
    const blacklist = Ingredient.of(/productivetrees.*/)
    saplings.forEach((sapling) => {
      if (!blacklist.test(sapling)) event.add("the_bumblezone:tradeable_saplings", sapling)
    })

    event.add("megacells:compression_overrides", "the_bumblezone:pollen_puff")
  })
}
// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
