// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.

if (Platform.isLoaded("the_bumblezone")) {
  ServerEvents.tags("item", (event) => {
    event.add("functionalstorage:ignore_crafting_check", "the_bumblezone:pollen_puff")
  })

  ServerEvents.tags("item", (event) => {
    // ATBM 3.5.2: KubeJS 8 has no getObjectIds(), so a tag's contents cannot be read here. Take every item
    // named like a sapling instead, still leaving out Productive Trees as ATM intended.
    event.getElementIds().forEach((id) => {
      let s = String(id)
      if (/(_sapling|_propagule)$/.test(s) && !s.startsWith("productivetrees:")) event.add("the_bumblezone:tradeable_saplings", s)
    })

    event.add("megacells:compression_overrides", "the_bumblezone:pollen_puff")
  })
}
// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
