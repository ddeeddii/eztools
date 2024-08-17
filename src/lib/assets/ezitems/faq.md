# Mod Templates

## What features does the REPENTOGON template add?

- Partial support for pocket items - cards, runes, souls can have their names and descriptions changed (not sprites). Pills can only have their name changed (EID is not supported for pills)
- Built-in mod conflict notifier - if a mod is installed that changes the same item, a warning will be shown to the user
- More frequent updates - [REPENTOGON](https://repentogon.com/) is constantly updated, unlike the vanilla game. Maintaining this template takes priority over the vanilla template because frankly there isn't a reason to not use it

## How are the mod templates different?

There are currently 2 available templates:

- `Vanilla`: Basic template that supports items and trinkets. Works in the vanilla game.
- `REPENTOGON`: This template partially supports pocket items (pills, cards, runes, souls, etc.) and has a built-in mod conflict notifier. However, it **requires the user to have [REPENTOGON](https://repentogon.com/) installed**.

## Which one should I use?

For most people, `REPENTOGON` is the better choice simply because it has more features (hence why it's the default template).

# REPENTOGON Support

## What features does the REPENTOGON template add?

- **Partial support for pocket items** - cards, runes, souls can have their names and descriptions changed (not sprites). Pills can only have their name changed (EID is not supported for pills)
- **Built-in mod conflict notifier** - if a mod is installed that changes the same item, a warning will be shown to the user
- **More frequent updates** - REPENTOGON is constantly updated, unlike the vanilla game. Maintaining it takes priority over the `Vanilla` template.

## Why can't I change sprites of pocket items?

**TL;DR - Pocket item sprites are very different from regular item sprites**
The most important reason is that they are extremely incompatible with other mods that change pocket item sprites.
This is because they are stored in two different files (`ui_cardfronts.png` and `ui_cardspills.png`) which contain all of the vanilla pocket items.
Modifying either file is not only difficult (due to fact the all of the sprites are in one file) but will overwrite any/all changes some other mode has made to the other file.
On top of that, if the vanilla game were to one day update the sprite of any pocket item, a mod that hasn't been updated will overwrite the new vanilla sprite.

## How do I add REPENTOGON as a dependency to my mod on the Steam Workshop?

Follow the instructions on the video below (do note you need to have the **[REPENTOGON mod](https://steamcommunity.com/sharedfiles/filedetails/?id=3127536138)** downloaded in order to include it as a dependency):
<video controls class="mt-2" src="https://raw.githubusercontent.com/ddeeddii/eztools/main/static/ezitems/mod-dependency.mp4" type="video/mp4" /></video>
