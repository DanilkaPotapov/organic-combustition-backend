local cursor = "0"
local result = {}
local seen = {}
repeat
  local page = redis.call("SCAN", cursor, "MATCH", "session:*", "COUNT", 100)
  cursor = page[1]
  for _, key in ipairs(page[2]) do
    local value = redis.call("GET", key)
    if value then
      local ok, user = pcall(cjson.decode, value)
      if ok and type(user) == "table" and type(user.email) == "string" and not seen[user.email] then
        seen[user.email] = true
        table.insert(result, user.email)
      end
    end
  end
until cursor == "0"
table.sort(result)
return result
