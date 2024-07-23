# EzItems Data Specification

Current template version: `1.0.0`

## Introduction

This file describes the data format used by EzItems mods. It is a JSON file with the following structure:

```json
{
  "metadata": {
    "templateType": "vanilla" | "repentogon",
    "templateVersion": "1.0.0",
    "dataVersion": "1.0.0",
    "webVersion": "1.0.0"
  },

  "items": {
    "item-id": { "name": "", "description": "" },
  },

  "trinkets": {
    "item-id": { "name": "", "description": "" },
  },

  "cards": {
    "item-id": { "name": "", "description": "", "type": "card" | "rune" | "soul" },
  },

  "pills": {
    "item-id": { "name": "", "description": "" },
  }
}
```

## Metadata

The `metadata` field contains information about the template and the data version. Do note they are mostly redundant and are not currently used anywhere. They are still included for potential future compatibility.

`templateType` indicates the intended template for this data.

`templateVersion` indicates the version of the template which this data was created for.

`dataVersion` indicates the version of the data format used.

`webVersion` indicates the version of EzItems used to create the data.

Note all version numbers are in the SemVer format.

## Item Data

Fields `"items"`, `"trinkets"`, `"cards"` and `"pills"` contain the data for the items, trinkets, cards and pills respectively.

Each one is a key-value pair where the key is the origin item. The origin item is always a string however inside that string is either a number or text. If it is a number, it is the origin item id. If it is text, it is the name of the origin item (custom origin item)

The value of each item is an object with the following fields (with the exception of card data):

- `name`: The new name of the item.
- `description`: The new description of the item.

Card data contains the following additional field:

- `type`: The type of the origin card. Can be one of the following: `"card"`, `"rune"`, `"soul"`. This is done for [Encyclopedia](https://steamcommunity.com/workshop/filedetails/?id=2376005362) support
