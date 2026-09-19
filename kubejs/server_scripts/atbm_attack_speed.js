// All The Better Mooks: 1.5x attack speed for every weapon (player base attack speed 4 -> 6), closer to Bedrock combat.
// Pairs with config/bettercombat/server.json5 (upswing_multiplier 0.25, movement_speed_while_attacking 1.0).
const $Attributes = Java.loadClass("net.minecraft.world.entity.ai.attributes.Attributes")
const ATBM_BASE_ATTACK_SPEED = 6.0

function atbmSetAttackSpeed(player) {
  let attackSpeed = player.getAttribute($Attributes.ATTACK_SPEED)
  if (attackSpeed != null && attackSpeed.getBaseValue() != ATBM_BASE_ATTACK_SPEED) attackSpeed.setBaseValue(ATBM_BASE_ATTACK_SPEED)
}

PlayerEvents.loggedIn((event) => atbmSetAttackSpeed(event.player))
PlayerEvents.respawned((event) => atbmSetAttackSpeed(event.player))
