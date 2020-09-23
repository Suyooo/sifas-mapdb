This is a repository for both the [Note Map DB site](https://suyo.be/sifas/mapdb/) and the note map files, so you can
use them for your own projects. The following is a short overview of the keys and values you'll find in those, which
you can find as JSON files in the `mapdb` folder.

These JSON files are not the live data pulled from the server, but instead are processed versions with some filtering
applied, and annotated with extra data such as full skill information. As getting the live data from the game requires
me to play the respective song in-game, so I can dump the network traffic, it might take a while until new songs appear
here (mostly depending on unlock conditions - campaign songs that are immediately available are quick, while story songs
have to wait until I reach the end of the chapter and usually take a whole day).

The values in the note map database, especially the skill ones, are as incomplete as the song database (which means, if
I don't have any songs where a certain effect appears I don't have it added. Feel free to make guesses, but I'm only
putting confirmed ones here)

# Live Difficulty
The Live Difficulty ID can be read as `ABCCCDDE`:  
`A`: Live type, see below  
`B`: Group, see below  
`CCC`: Song ID  
`DD`: (Real) Difficulty, see below  
`E`: Unique Identifier

`1BCCC` uniquely defines which song the live difficulty belongs to, and is called the Live ID.

## Live type
- 1: Free Live
- 2: Event Songs (the pre-release no-attribute versions)
- 3: Story Stage
- 4: Sukusuta Big Live
- 5: Dream Live Parade

## Group
- 0: µ's
- 1: Aqours
- 2: Nijigaku

## Attributes
- 1: Smile
- 2: Pure
- 3: Cool
- 4: Active
- 5: Natural
- 6: Elegant
- 9: None

## Difficulty
- 10: Beginner
- 20: Intermediate
- 30: Advanced
- 40: Advanced+ / Expert

Note: the difficulty in the `song_difficulty` field might be different from the one read from the live difficulty ID,
because the one in `song_difficulty` is the one the game uses for timing judgement. Advanced+ songs will have a 40 in
the live difficulty ID, but `song_difficulty` will be set to 30.

## Unique Identifier
For Free Lives, this is usually the version - if a note map is retired and replaced with a new one, this counter
increases. One example is TOKIMEKI RUNNERS Adv+ - the original was version 1, while the currently available permanent
one is version 2.

For SBL, this marks the sub-difficulty. Beginner and Intermediate are split into three sub-difficulties identified by
this digit, where 1 is the easiest and 3 is the hardest. Advanced does not have sub-difficulties, so there, this digit
is always 1.

For DLP and older Story Stages, this is a counter for the amount of repeats - so for example, the live with this digit
set to 5 is the 5th occurence of this song at this difficulty across all DLPs/stories.

## Live Difficulty IDs for newer Story Stages
While the Story Stages started out with the same pattern as above, at some point, Klab started just numbering them,
maybe they thought the 1-digit unique identifier will probably run out at some point. These lives have the Live
Difficulty ID `33XXXXXX`, where `XXXXXX` is simply a running counter starting at 000001.

# Extra Info
Depending on the Live Type (see above), additional info may be included in the `extra_info` object in the JSON root.

## Story Stage
`story_chapter`: The number of the Chapter this Stage appears in (starting from 1, as in-game)  
`story_stage`: Counter for which Stage in the Chapter this is (starting from 1)  
`story_is_super_stage`: Whether this Stage is the final Stage in the respective Chapter or not

## SBL Live
`sbl_event_id`: An unique identifier for which SBL Event this Live appeared in  
`sbl_slot`: Which slot the Live was shown in the respective SBL's home page (starting from 1)

## DLP Live
`dlp_tower_id`: An unique identifier for which DLP Tower this Live appeared in  
`dlp_floor`: Which floor this Live was played on in the respective DLP tower (starting from 1, as in-game)

# Notes
`time`: Note timing, in milliseconds  
`rail`: 1 for left, 2 for right  
`type`: Note type, see below  
`action`: Note action, see below  
`gimmick`: Index of the gimmick this note triggers, in the `note_gimmicks` array

## Types
- 1: normal note
- 2: hold
- 3: release

Note: in the server live data, there are two more types, 4 and 5, for AC start and AC end.
These notes are invisible in-game, and are at most 2 msec off, next to the start or finish note of the AC.
The JSON files you can find in the `mapdb` folder have these notes removed, so you can easily get the note count of a
song by just using the length of the `notes` array.

## Actions
- 1: tap
- 4: swipe up
- 5: swipe down
- 6: swipe left
- 7: swipe right

## Gimmick Triggers
- 1: on hit (WONDERFUL, GREAT or NICE)
- 2: on miss (BAD or MISS)
- 3: always (no matter what timing)
- 4: on hit (WONDERFUL, GREAT or NICE) with Vo type
- 5: on hit (WONDERFUL, GREAT or NICE) with Sp type
- 7: on hit (WONDERFUL, GREAT or NICE) with Sk type

# Appeal Chances
`mission_type`: Mission type, see below  
`mission_value`: Target for the AC mission  
`penalty_damage`: Stamina damage taken if AC is failed  
`reward_voltage`: Voltage gained if AC is cleared  
`range_note_ids`: Position and length of AC, represented as indexes of the start and finish notes in the `notes` array  
`gimmick`: A skill object representing this AC's gimmick, see below
## Mission Types
- 1: Get Voltage
- 2: Get NICEs
- 3: Get GREATs
- 4: Get WONDERFULs
- 5: Get Voltage in a single tap
- 6: Get Voltage from SP skills
- 7: Appeal with unique units
- 8: Get Criticals
- 9: Activate Tap Skills

## Gimmick Triggers
- 1: On AC Start (start note hit or missed)
- 2: On AC Success
- 3: On AC Failure
- 4: On AC End (finish note hit or missed)

# Skills
`target`: Targeting type, see below  
`effect_type`: Effect type, see below  
`effect_amount`: Effect strength  
`trigger`: For song gimmicks, this is always 2 so far. For note and AC gimmicks, see the respective Gimmick Trigger sections above.  
`finish_type`: Finish condition, see below  
`finish_amount`: Value for the finish condition  
`scale_type` and `calc_type`: Probably something about how the skills stack (additive/multiplicative)? Haven't looked into these much

## Targets
- 1: All units
- 29: µ's
- 30: Aqours
- 31: Nijigaku
- 38: Vo Type
- 39: Sp Type
- 40: Gd Type
- 41: Sk Type
- 58: No target (skill affects SP gauge or stamina)
- 61: Smile
- 62: Pure
- 63: Cool
- 64: Active
- 65: Natural
- 66: Elegant
- 67: Non-Smile
- 68: Non-Vo Type
- 72: Non-Pure
- 73: Non-Cool
- 74: Non-Active
- 75: Non-Natural
- 76: Non-Elegant
- 77: Non-Sp Types
- 78: Non-Gd Types
- 79: Non-Sk Types
- 83: Current Strategy
- 87: Non-Vo or Gd Types
- 88: Non-Vo or Sp Types
- 89: Non-Vo or Sk Types
- 90: Non-Gd or Sp Types
- 92: Non-Sp or Sk Types
- 96: Vo and Sk Types
- 97: Vo and Sp Types

## Effects
- 3: SP Gauge Charge (fixed amount)
- 4: Shield Gain (fixed amount)
- 5: Stamina Restore (fixed amount)
- 17: Appeal Up
- 18: Voltage Gain Up
- 19: SP Gauge Fill Rate Up
- 20: Critical Chance Up
- 21: Critical Power Up
- 22: Skill Activation Chance Up
- 23: SP Voltage Gain Up
- 26: Base Appeal Up
- 45: Base SP Gauge Fill Rate Up
- 46: Base Critical Chance Up
- 47: Base Critical Power Up
- 48: Base Skill Activation Chance Up
- 49: Base Appeal Up (dupe?)
- 50: Base SP Voltage Gain Up
- 51: Base Voltage Gain Up
- 52: Remove Buffs
- 68: Stamina Damage (fixed amount)
- 69: SP Gauge Discharge (percentage of max)
- 70: Shield Removal (fixed amount)
- 71: Appeal Down
- 73: SP Gauge Fill Rate Down
- 75: Critical Power Down
- 76: Skill Activation Chance Down
- 78: Base Skill Activation Chance Down
- 81: Base Appeal Down
- 83: Base SP Gauge Fill Rate Down
- 84: Base Appeal Down (dupe?)
- 85: Base SP Gauge Fill Rate Down (dupe?)
- 86: Base Skill Activation Chance Down (dupe?)
- 91: SP Gauge Charge (percentage of max)
- 93: Shield Gain (percentage of max)
- 96: Stamina Restore (percentage of max)
- 119: Appeal Up, based on the amount of Vo types
- 132: Stamina Restore (fixed amount), based on the amount of Sk types
- 134: Stamina Restore (fixed amount), based on the amount of Gd types
- 141: Base Appeal Up, based on the amount of Sk types
- 143: Base Appeal Up, based on the amount of Gd types
- 163: Skill Activation Chance Up, based on the amount of Sk types
- 164: Skill Activation Chance Up, based on the amount of Gd types
- 179: Critical Chance Up, based on the amount of Sk types
- 187: Base Critical Chance Up, based on the amount of Sk types
- 193: Critical Power Up, based on the amount of Vo types
- 210: SP Voltage Gain Up, based on the amount of Sp types
- 219: Base SP Voltage Gain Up, based on the amount of Sk types
- 230: Strategy Switch Bonus Up (fixed amount)

## Finish Conditions
- 1: until song end
- 2: for X notes
- 3: instant effect, no finishing (stamina or SP gauge effects)
- 4: until AC ends
- 7: one time only
- 8: until next switch