-- Generated with EzTools
-- isaac.d3d1.com/eztools

local mod = RegisterMod('%modname%', 1)
local data = include('data')
local json = require('json')

-- Load data
local jsonData = json.decode(data)

local changes = {
  ---@ type {[number]: {name: string, description: string}}
  items = {},
  ---@ type {[number]: {name: string, description: string}}
  trinkets = {},
  ---@ type {[number]: {name: string, description: string, type: 'card' | 'rune' | 'soul'}}
  cards = {},
  ---@ type {[number]: {name: string, description: string}}
  pills = {}
}

if not EZITEMS then
  EZITEMS = {}

  EZITEMS.items = {}
  EZITEMS.trinkets = {}
  EZITEMS.cards = {}
  EZITEMS.pills = {}
end

local function addItem(id, name, description, type, cardVariant)
  if not EZITEMS[type][tostring(id)] then
    EZITEMS[type][tostring(id)] = {}
  end

  table.insert(EZITEMS[type][tostring(id)], {name = name, description = description, mod = mod.Name})
  if(type == 'cards') then
    changes[type][tostring(id)] = {name = name, description = description, type = cardVariant}
  else
    changes[type][tostring(id)] = {name = name, description = description}
  end
end

local getterFunctions = {
  items = Isaac.GetItemIdByName,
  trinkets = Isaac.GetTrinketIdByName,
  cards = Isaac.GetCardIdByName,
  pills = Isaac.GetPillEffectByName
}

local function parseJsonData()
  -- Parse data
  for itemType, root in pairs(jsonData) do
    for itemId, item in pairs(root) do
      if itemType == 'metadata' then
        goto continue
      end

      local trueId = itemId

      if tonumber(itemId) == nil then
        trueId = getterFunctions[itemType](itemId)
        if trueId ~= -1 then
          addItem(trueId, item.name, item.description, itemType, item.type)
        else
          print('[ EzTools | ' .. tostring(mod.Name) .. ']' .. itemType .. ' "' .. tostring(itemId) .. '" not found, skipping custom name/description...')
        end
      else
        addItem(trueId, item.name, item.description, itemType, item.type)
      end

      ::continue::
    end
  end
end

local eidFunctions = {
  items = {
   add = EID.addCollectible,
   objId = 100
  },
  trinkets = {
   add = EID.addTrinket,
   objId = 350
  },
  cards = {
   add = EID.addCard,
   objId = 300
  },
}
local function updateEid ()
  for type, itemTypeData in pairs(changes) do
    for id, itemData in pairs(itemTypeData) do
      if type == 'pills' then
        goto continue
      end

      local EIDdescription = EID:getDescriptionObj(5, eidFunctions[type].objId, tonumber(id)).Description
      eidFunctions[type].add(EID, tonumber(id), EIDdescription, itemData.name, 'en_us')

      ::continue::
    end
  end
end

local encyclopediaFunctions = {
  items = Encyclopedia.UpdateItem,
  trinkets = Encyclopedia.UpdateTrinket,
  cards = {
    card = Encyclopedia.UpdateCard,
    rune = Encyclopedia.UpdateRune,
    soul = Encyclopedia.UpdateSoul
  },
  pills = Encyclopedia.UpdatePill
}
local function updateEncyclopedia()
  for type, itemTypeData in pairs(changes) do
    for id, itemData in pairs(itemTypeData) do
      if type == 'cards' then
        encyclopediaFunctions.cards[itemData.type](
          tonumber(id),
          {
            Name = itemData.name,
            Description = itemData.description
          }
        )
      elseif type == 'pills' then
        encyclopediaFunctions.pills(
          tonumber(id),
          {
            Name = itemData.name,
          }
        )
      else
        encyclopediaFunctions[type](
          tonumber(id),
          {
            Name = itemData.name,
            Description = itemData.description
          }
        )
      end
    end
  end
end

local itemconfig = Isaac.GetItemConfig()
local updaterFunctions = {
  items = itemconfig.GetCollectible,
  trinkets = itemconfig.GetTrinket,
  cards = itemconfig.GetCard,
  pills = itemconfig.GetPillEffect
}
local function updateNames()
  for type, itemTypeData in pairs(changes) do
    for id, itemData in pairs(itemTypeData) do
      local item = updaterFunctions[type](itemconfig, id)
      item.Name = itemData.name

      if type ~= 'pills' then
        item.Description = itemData.description
      end
    end
  end
end

local function checkConflicts()
  for type, itemTypeData in pairs(changes) do
    for id, itemData in pairs(itemTypeData) do
      if EZITEMS[type][tostring(id)] then
        for idx, conflict in pairs(EZITEMS[type][tostring(id)]) do
          if conflict.mod ~= mod.Name then
            if not conflict.resolved then

              print('')
              print('[ EzTools Error ] Item with id ' .. tostring(id) .. ' (name: ' .. itemData.name .. ') is already in use by mod ' .. conflict.mod)
              print('[ EzTools Error ] Mod ' .. mod.Name .. ' has higher priority, so it will be used instead')
              print('[ EzTools Error ] Summary: (' .. conflict.name .. ') -> (' .. itemData.name .. ')')
              print('')

              conflict.resolved = true
            end
          end
        end
      end
    end
  end

end

mod:AddCallback(
  ModCallbacks.MC_POST_GAME_STARTED,
  function (_)
    parseJsonData()
    checkConflicts()

    if EID then
      updateEid()
    end

    if Encyclopedia then
      updateEncyclopedia()
    end

    updateNames()
  end
)