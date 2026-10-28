# Opens the Server Guide (FancyMenu custom screen atbm_guide_1) for players atbm_welcome.js marked on their first join.
# Scheduled a few seconds after login so the screen is not swallowed by the world-loading screen. Anyone who left
# before it fired keeps the tag and gets it on their next login.
execute as @a[tag=atbm.guide_pending] run openguiscreen atbm_guide_1 @s
tag @a[tag=atbm.guide_pending] remove atbm.guide_pending
