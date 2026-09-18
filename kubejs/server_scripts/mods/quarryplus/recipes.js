// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
if (Platform.isLoaded("quarryplus")) {
  ServerEvents.recipes((allthemods) => {
    allthemods.remove("quarryplus:adv_quarry")
  })

  ServerEvents.recipes((allthemods) => {
    allthemods.remove({ id: "quarryplus:quarry" })
    allthemods.shaped("quarryplus:quarry", ["ABA", "DED", "ACA"], {
      A: "allthemodium:allthemodium_ingot",
      B: "justdirethings:eclipsealloy_pickaxe",
      C: "allthemodium:unobtainium_pickaxe",
      D: "productivelib:upgrade_productivity_4",
      E: "justdirethings:blockbreakert2"
    })
  })
}

// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
