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
  trinkets = {}
}

local game = Game()

if not EZITEMS then
  EZITEMS = {}

  EZITEMS.items = {}
  EZITEMS.trinkets = {}
  EZITEMS.cards = {}
  EZITEMS.pills = {}
end

local function addItem(id, name, description, type)
  if not EZITEMS[type][tostring(id)] then
    EZITEMS[type][tostring(id)] = {}
  end

  table.insert(EZITEMS[type][tostring(id)], {name = name, description = description, mod = mod.Name, modTemplate = 'vanilla'})
  changes[type][tostring(id)] = {name = name, description = description}
end

local getterFunctions = {
  items = Isaac.GetItemIdByName,
  trinkets = Isaac.GetTrinketIdByName,
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
          addItem(trueId, item.name, item.description, itemType)
        else
          print('[ EzTools | ' .. tostring(mod.Name) .. ']' .. itemType .. ' "' .. tostring(itemId) .. '" not found, skipping custom name/description...')
        end
      else
        addItem(trueId, item.name, item.description, itemType)
      end

      ::continue::
    end
  end
end

local itemVariants = {
  items = 100,
  trinkets = 350
}
local function updateEid ()
  for type, itemTypeData in pairs(changes) do
    for id, itemData in pairs(itemTypeData) do
      EID:addDescriptionModifier(
        'EZITEMS | ' .. tostring(mod.Name) .. ' | ' .. itemData.name,
        function (descObj) return descObj.ObjType == 5 and descObj.ObjVariant == itemVariants[type] and descObj.ObjSubType == tonumber(id) end,
        function (descObj) descObj.Name = itemData.name; return descObj end
      )
    end
  end
end


local encyclopediaFunctions = {
  items = Encyclopedia.UpdateItem,
  trinkets = Encyclopedia.UpdateTrinket
}
local function updateEncyclopedia()
  for type, itemTypeData in pairs(changes) do
    for id, itemData in pairs(itemTypeData) do
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

-- 

parseJsonData()
checkConflicts()

if EID then
  updateEid()
end

if Encyclopedia then
  updateEncyclopedia()
end

-- Handle displaying trinkets
if next(changes.trinkets) ~= nil then
  local t_queueLastFrame
  local t_queueNow
  mod:AddCallback(
    ModCallbacks.MC_POST_PLAYER_UPDATE,

    ---@param player EntityPlayer
    function(_, player)
      t_queueNow = player.QueuedItem.Item
      if (t_queueNow ~= nil) then
        local trinket = changes.trinkets[tostring(t_queueNow.ID)]
        if trinket and t_queueNow:IsTrinket() and t_queueLastFrame == nil then
          game:GetHUD():ShowItemText(trinket.name, trinket.description)
        end
      end
      t_queueLastFrame = t_queueNow
    end
  )
end

-- Handle displaying items
if next(changes.items) ~= nil then
  local i_queueLastFrame
  local i_queueNow
  mod:AddCallback(
    ModCallbacks.MC_POST_PLAYER_UPDATE,

    ---@param player EntityPlayer
    function(_, player)
      i_queueNow = player.QueuedItem.Item
      if (i_queueNow ~= nil) then
        local item = changes.items[tostring(i_queueNow.ID)]
        if item and i_queueNow:IsCollectible() and i_queueLastFrame == nil then
          game:GetHUD():ShowItemText(item.name, item.description)
        end
      end
      i_queueLastFrame = i_queueNow
    end
  )
end
