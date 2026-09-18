// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
if (Platform.isLoaded("modern_industrialization")) {
  ServerEvents.recipes((allthemods) => {
    allthemods.replaceInput(
      { mod: "modern_industrialization" },
      Fluid.ingredientOf("modern_industrialization:crude_oil"),
      Fluid.ingredientOf("#c:crude_oil")
    )
  })
}

// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
