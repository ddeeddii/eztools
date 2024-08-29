# General Information

## What is EzItems?

EzItems is a mod generator for Isaac that allows you to easily change the names, descriptions and sprites of vanilla items.

## Why should I use it over renaming items in items.xml?

Changing `items.xml` is a terrible idea because `items.xml` is not meant to be edited by mods. Changing this file will work for the time being, **however** if the game ever updates this file, any mod that relies on changing this file will overwrite the new changes.

For example, if a new item is added to the game and you have a mod that still uses the old `items.xml`, the mod's old `items.xml` will overwrite the new one and the item will simply not exist in the game because it's not in the new `items.xml`.

Another side effect of this file being "global" is that there may only exist one mod that changes this file. Only the mod that loads last will load its own `items.xml` and other mods' `items.xml` will be ignored.

## Terminology

**Origin Item** - An "origin item" is the item that is going to be changed.
For example, if you wanted to change the name of "The Sad Onion", the origin item would be "The Sad Onion".

**Custom Item Origin** - This is a setting that allows you to use a custom origin item. This is useful for more advanced users that wish to change the name of an item that is not in the vanilla game (like a modded item). Due to how custom items work, sprites are not supported for custom items.

# Mod Templates

## How are the mod templates different?

- `Vanilla`: Supports items and trinkets. Works in the vanilla game.
- `REPENTOGON`: Supports items, trinkets and partially supports pocket items (pills, cards, runes, souls, etc.). **Requires the user to have [REPENTOGON](https://repentogon.com/) installed**.

## Which one should I use?

It's mostly up to personal preference.

- `REPENTOGON` is better because it has more features
- `Vanilla` is better because it will always work, regardless of whether the player has REPENTOGON installed or not

## What is the conflict notifier?

The conflict notifier is a built-in feature that will notify you if there exists a conflict between two EzItems mods (for example when two or more mods try to change the same item).

This would result in a race condition which could be unpredictable. To solve this, the conflict notifier will show a warning in the console informing you of the conflict and how it has been "resolved".

The conflict between two items is "resolved" by using the item which was edited by the mod with higher priority (the one that loads first) - this is because the mod with the higher priority will always load the sprite for the item (if the sprite is changed). This is done in order to avoid a situation in which an item has mod A's name and description but mod B's sprite.

# REPENTOGON Support

## What features does the REPENTOGON template add?

- **Partial support for pocket items** - cards, runes, souls can have their names and descriptions changed (not sprites). Pills can only have their name changed
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
