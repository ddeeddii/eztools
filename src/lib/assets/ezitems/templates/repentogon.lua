-- Generated with EzTools
-- isaac.d3d1.xyz

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

  table.insert(EZITEMS[type][tostring(id)], {name = name, description = description, mod = mod.Name, modTemplate = 'repentogon'})
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

local itemVariants = {
  items = 100,
  trinkets = 350,
  cards = 300,
  pills = 70
}

local function updateEid ()
  for type, itemTypeData in pairs(changes) do
    for id, itemData in pairs(itemTypeData) do
      if type == 'pills' then
        EID:addDescriptionModifier(
          'EZITEMS | ' .. tostring(mod.Name) .. ' | ' .. itemData.name,
            function (descObj) return descObj.ObjType == 5 and descObj.ObjVariant == itemVariants.pills and descObj.Name == itemData.description end,
            function (descObj) descObj.Name = itemData.name; return descObj end
          )
        goto continue
      end

      EID:addDescriptionModifier(
        'EZITEMS | ' .. tostring(mod.Name) .. ' | ' .. itemData.name,
        function (descObj) return descObj.ObjType == 5 and descObj.ObjVariant == itemVariants[type] and descObj.ObjSubType == tonumber(id) end,
        function (descObj) descObj.Name = itemData.name; return descObj end
      )

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
        local removeOwn = false
        for idx, conflict in ipairs(EZITEMS[type][tostring(id)]) do
          if conflict.mod ~= mod.Name then
            print('')
            print('[ ' .. tostring(mod.Name) .. ' ]')
            print('[ EzTools Conflict ] Item (type "' .. type .. '") with id "' .. tostring(id) .. '" (name: "' .. itemData.name .. '") is already in use by mod "' .. conflict.mod .. '"')
            print('[ EzTools Conflict ] Mod "' .. conflict.mod .. '" has higher priority, so "' .. mod.Name .. '"\'s item will not be loaded')
            print('[ EzTools Conflict ] Summary: (' .. itemData.name .. ') -> (' .. conflict.name .. ')')
            print('')

            changes[type][tostring(id)] = nil
            removeOwn = true
            conflict.resolved = true
          elseif conflict.mod == mod.Name and removeOwn then
            EZITEMS[type][tostring(id)][idx] = nil
            removeOwn = false
          end
        end
      end
    end
  end
end

parseJsonData()
checkConflicts()

if EID then
  updateEid()
end

updateNames()

if Encyclopedia then
  updateEncyclopedia()
end