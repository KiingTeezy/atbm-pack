// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods.
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
if (Platform.isLoaded("extradisks")) {
  ServerEvents.recipes((allthemods) => {
    allthemods.remove({ id: /extradisks:blocks\/infinite_.*/ })
    allthemods.remove({ id: /extradisks:disk\/shaped\/infinite_.*/ })
    allthemods.remove({ id: /extradisks:disk\/shapeless\/infinite_.*/ })
    allthemods.remove({ id: /extradisks:part\/infinite_.*/ })
  })
}

// This File has been authored by AllTheMods Staff, or a Community contributor for use in AllTheMods
// As all AllTheMods packs are licensed under All Rights Reserved, this file is not allowed to be used in any public packs not released by the AllTheMods Team, without explicit permission.
