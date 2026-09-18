// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
if (Platform.isLoaded("the_bumblezone")) {
  ServerEvents.recipes((allthemods) => {
    allthemods.remove({ id: "the_bumblezone:carvable_wax/from_honeycomb" })
    allthemods.shaped("the_bumblezone:carvable_wax", ["AAA", "A A", "AAA"], {
      A: "productivebees:wax"
    })
  })
}

// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
