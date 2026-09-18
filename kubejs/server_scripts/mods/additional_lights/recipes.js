// Fire for Standing Torch
if (Platform.isLoaded("additional_lights")) {
  ServerEvents.recipes((allthemods) => {
    allthemods.remove({ id: "additional_lights:fire_for_standing_torch_s" })
  })
}
