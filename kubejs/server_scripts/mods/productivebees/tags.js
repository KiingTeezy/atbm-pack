// priority 1
// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.

ServerEvents.tags("item", (event) => {
  event.add("functionalstorage:ignore_crafting_check", "productivebees:draconic_dust")
  if (Platform.isLoaded("railcraft")) {
    event.add("c:dusts/niter", "#c:dusts/saltpeter")
  }
  event.add("functionalstorage:ignore_crafting_check", "productivebees:obsidian_shard")
  event.add("megacells:compression_overrides", "productivebees:obsidian_shard")
  event.add("productivebees:flowers/plastic", "industrialforegoing:plastic")
})

// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
