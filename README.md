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
- 6: Tutorial (Oshiete Sukusuta)
- 9: MV only

## Group
- 0: µ's
- 1: Aqours
- 2: Nijigaku
- 3: Liella!

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
- 50: Challenge

Note: The difficulty in the `song_difficulty` can be different from this. Adv+ has a 40 in the live difficulty ID, but
the corresponding `song_difficulty` is 35. Similarly, Ch uses 50 in the LID, but 37 in `song_difficulty`.

## Unique Identifier
For Free Lives, this is usually the version - if a note map is retired and replaced with a new one, this counter
increases. One example is TOKIMEKI RUNNERS Adv+ - the original was version 1, while the currently available permanent
one is version 2.

For SBL, this marks the sub-difficulty. Beginner and Intermediate are split into three sub-difficulties identified by
this digit, where 1 is the easiest and 3 is the hardest. Advanced does not have sub-difficulties, so there, this digit
is always 1.

For DLP and older Story Stages, this is a counter for the amount of repeats - so for example, the live with this digit
set to 5 is the 5th occurence of this song at this difficulty across all DLPs/stories.

## Numbered Live Difficulty IDs
While the Story Stages started out with the same pattern as above, from Chapter 8 on, Klab started just numbering them.
Maybe they thought the 1-digit unique identifier will probably run out at some point. These lives have the Live
Difficulty ID `33DXXXXX`, where `XXXXX` is simply a running counter starting at 000001. The same is done for the
`6XXXXXXX` Live Difficulty IDs of Tutorial stages. `D` is the story difficulty (introduced in Season 2) - `1` for
Normal, `0` for Hard.

Because the Live Difficulty ID is missing a Difficulty ID as described above, it cannot be used to derive which note
map the Stage uses. It might seem obvious to use the `song_difficulty` field to get the difficulty instead, but in some
cases, the value here is wrong (for example, Ch19 Donna Toki mo Zutto has `song_difficulty` set to 10, but uses the
Intermediate note map). Not even the `sp_gauge_max` field matches up with the note map difficulty consistently - the
best way is probably to take the note maps for the Free Live difficulties and check which note count is the closest.

Note that after the amount of Story Stages in Chapter 15 and before was reduced in version 2.0, these counters were not
changed, so there are missing numbers if going through all the Story Stages.

# Extra Info
Depending on the Live Type (see above), additional info may be included in the `extra_info` object in the JSON root.

## Free Live
`is_available`: Whether the song is currently playable or in rotation (on the JP version)  
`is_permanent`: Whether the song is a permanent song (not time-limited)  
`can_show_on_profile`: Whether the song counts for the highest score/combo fields on player's profiles  
`daily_weekday`: An array of weekday numbers according to ISO 8601 (1 = Monday, 7 = Sunday) of the weekday on which this
Daily Live is available, or null if this live is not a Daily Live

## Story Stage
`story_chapter`: The number of the Chapter this Stage appears in (starting from 1, as in-game)  
`story_stage`: Counter for which Stage in the Chapter this is (starting from 1)  
`story_is_hard_mode`: Whether this Stage is part of the Season's Hard course or not  
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

Lists of note types, note actions and gimmick triggers can be found on [the SIFAS Wiki](https://suyo.be/sifas/wiki/internals/notes).

Note: in the server live data, there are two more types, 4 and 5, for AC start and AC end.
These notes are invisible in-game, and are at most 2 msec off, next to the start or finish note of the AC.
The JSON files you can find in the `mapdb` folder have these notes removed, so you can easily get the note count of a
song by just using the length of the `notes` array.

# Appeal Chances
`mission_type`: Mission type, see below  
`mission_value`: Target for the AC mission  
`penalty_damage`: Stamina damage taken if AC is failed  
`reward_voltage`: Voltage gained if AC is cleared  
`range_note_ids`: Position and length of AC, represented as indexes of the start and finish notes in the `notes` array  
`gimmick`: A skill object representing this AC's gimmick, see below

Lists of mission types and gimmick triggers can be found on [the SIFAS Wiki](https://suyo.be/sifas/wiki/internals/appeal-chances).

# Skills
`target`: Targeting type, see below  
`effect_type`: Effect type, see below  
`effect_amount`: Effect strength  
`trigger`: For song gimmicks, this is always 2 so far. For note and AC gimmicks, see the respective Gimmick Trigger sections above.  
`finish_type`: Finish condition, see below  
`finish_amount`: Value for the finish condition  
`scale_type` and `calc_type`: Probably something about how the skills stack (additive/multiplicative)? Haven't looked into these much

Lists of target types, effect types and finish conditions can be found on [the SIFAS Wiki](https://suyo.be/sifas/wiki/internals/skills).