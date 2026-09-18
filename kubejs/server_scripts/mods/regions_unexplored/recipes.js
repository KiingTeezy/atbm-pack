// This file adds a recipe to craft Redstone from the Pointed Redstone item
if (Platform.isLoaded("regions_unexplored")) {
  ServerEvents.recipes((allthemods) => {
    allthemods.shapeless(Item.of("minecraft:redstone", 1), ["regions_unexplored:pointed_redstone"])
  })
}
