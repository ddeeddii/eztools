-- Generated with EzTools
-- isaac.d3d1.com/eztools

local mod = RegisterMod('%modname%', 1)
local data = include('data')
local json = require('json')
local inspect = require('inspect')

-- Load data
local jsonData = json.decode(data)

local items = {}
local trinkets = {}

local game = Game()

mod:AddCallback(
  ModCallbacks.MC_POST_GAME_STARTED,
  function (_)
    -- Parse data
    for itemType, root in pairs(jsonData) do
      for itemId, item in pairs(root) do
        local trueId = itemId

        if itemType == 'items' then
          if tonumber(itemId) == nil then
            trueId = Isaac.GetItemIdByName(itemId)
            if trueId ~= -1 then
              items[tostring(trueId)] = item
            else
              print('[ EzTools | ' .. tostring(mod.Name) .. '] Item "' .. tostring(itemId) .. '" not found, skipping custom name/description...')
            end
          else
            items[tostring(trueId)] = item
          end

        elseif itemType == 'trinkets' then
          if tonumber(itemId) == nil then
            trueId = Isaac.GetTrinketIdByName(itemId)
            if trueId ~= -1 then
              trinkets[tostring(trueId)] = item
            else
              print('[ EzTools | ' .. tostring(mod.Name) .. '] Trinket "' .. tostring(itemId) .. '" not found, skipping custom name/description...')
            end
          else
            trinkets[tostring(trueId)] = item
          end
        end
      end
    end

    print(inspect(items))
  end
)

mod:AddCallback(
  ModCallbacks.MC_POST_GAME_STARTED,
  function (_)
    if EID then
      -- Adds trinkets
      for id, trinketData in pairs(trinkets) do
        local EIDdescription = EID:getDescriptionObj(5, 350, tonumber(id)).Description
        EID:addTrinket(tonumber(id), EIDdescription, trinketData.name, 'en_us')
      end

      -- Adds items
      for id, itemData in pairs(items) do
        local EIDdescription = EID:getDescriptionObj(5, 100, tonumber(id)).Description
        EID:addCollectible(tonumber(id), EIDdescription, itemData.name, 'en_us')
      end
    end

    if Encyclopedia then
      -- Add trinkets
      for id, trinketData in pairs(trinkets) do
        Encyclopedia.UpdateTrinket(
          tonumber(id),
          {
            Name = trinketData.name,
            Description = trinketData.description
          }
        )
      end

      -- Add items
      for id, itemData in pairs(items) do
        Encyclopedia.UpdateItem(
          tonumber(id),
          {
            Name = itemData.name,
            Description = itemData.description
          }
        )
      end

    end
  end
)

-- Handle displaying trinkets
if next(jsonData.trinkets) ~= nil then
  local t_queueLastFrame
  local t_queueNow
  mod:AddCallback(
    ModCallbacks.MC_POST_PLAYER_UPDATE,

    ---@param player EntityPlayer
    function(_, player)
      t_queueNow = player.QueuedItem.Item
      if (t_queueNow ~= nil) then
        local trinket = trinkets[tostring(t_queueNow.ID)]
        if trinket and t_queueNow:IsTrinket() and t_queueLastFrame == nil then
          game:GetHUD():ShowItemText(trinket.name, trinket.description)
        end
      end
      t_queueLastFrame = t_queueNow
    end
  )
end

-- Handle displaying items
if next(jsonData.items) ~= nil then
  local i_queueLastFrame
  local i_queueNow
  mod:AddCallback(
    ModCallbacks.MC_POST_PLAYER_UPDATE,

    ---@param player EntityPlayer
    function(_, player)
      i_queueNow = player.QueuedItem.Item
      if (i_queueNow ~= nil) then
        local item = items[tostring(i_queueNow.ID)]
        if item and i_queueNow:IsCollectible() and i_queueLastFrame == nil then
          game:GetHUD():ShowItemText(item.name, item.description)
        end
      end
      i_queueLastFrame = i_queueNow
    end
  )
end
