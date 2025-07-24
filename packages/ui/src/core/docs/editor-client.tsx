"use client";

import { BorderBeam } from "@ui/components";
import { CodeEditor } from "@ui/components";
import { Wrench } from "@ui/icons";
import { motion } from "motion/react";
import { useState } from "react";

type Tab = "lua" | "javascript" | "csharp";

interface CodeExample {
  title: string;
  code: string;
}

interface LanguageExamples {
  [key: string]: CodeExample[];
}

const examples: LanguageExamples = {
  lua: [
    {
      title: "Database Query Optimization",
      code: `local userCache = {}
local function getUsers()
    if not userCache.lastUpdate or (GetGameTimer() - userCache.lastUpdate) > 60000 then
        MySQL.Async.fetchAll('SELECT * FROM users', {}, function(result)
            userCache.data = result
            userCache.lastUpdate = GetGameTimer()
        end)
    end
    return userCache.data
end`
    },
    {
      title: "Event Handler with Rate Limiting",
      code: `local lastCall = 0
RegisterNetEvent('event:name')
AddEventHandler('event:name', function()
    local currentTime = GetGameTimer()
    if currentTime - lastCall > 1000 then
        lastCall = currentTime
        -- Process event
    end
end)`
    }
  ],
  javascript: [
    {
      title: "Database Query Optimization",
      code: `const userCache = {
    data: null,
    lastUpdate: 0
};

async function getUsers() {
    const currentTime = GetGameTimer();
    if (!userCache.lastUpdate || (currentTime - userCache.lastUpdate) > 60000) {
        const result = await exports.oxmysql.query_async('SELECT * FROM users');
        userCache.data = result;
        userCache.lastUpdate = currentTime;
    }
    return userCache.data;
}`
    },
    {
      title: "Event Handler with Rate Limiting",
      code: `let lastCall = 0;
onNet('event:name', () => {
    const currentTime = GetGameTimer();
    if (currentTime - lastCall > 1000) {
        lastCall = currentTime;
        // Process event
    }
});`
    }
  ],
  csharp: [
    {
      title: "Database Query Optimization",
      code: `public class UserCache
{
    private static List<User> _cache;
    private static long _lastUpdate;

    public static async Task<List<User>> GetUsers()
    {
        var currentTime = GetGameTimer();
        if (_cache == null || (currentTime - _lastUpdate) > 60000)
        {
            _cache = await MySQL.QueryAsync<List<User>>("SELECT * FROM users");
            _lastUpdate = currentTime;
        }
        return _cache;
    }
}`
    },
    {
      title: "Event Handler with Rate Limiting",
      code: `public class EventHandler
{
    private static long _lastCall;

    [EventHandler("event:name")]
    public static async Task OnEvent()
    {
        var currentTime = GetGameTimer();
        if (currentTime - _lastCall > 1000)
        {
            _lastCall = currentTime;
            // Process event
        }
    }
}`
    }
  ]
};

const tabs = [
  { id: "lua", label: "Lua" },
  { id: "javascript", label: "JavaScript" },
  { id: "csharp", label: "C#" }
] as const;

export function EditorClient() {
  const [activeTab, setActiveTab] = useState<Tab>("lua");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-10"
    >
      <div className="text-fd-foreground border-fd-border/50 relative flex h-auto max-w-[375px] flex-col overflow-hidden rounded-2xl border bg-neutral-100 shadow-[0_0px_100px_rgba(38,99,235,0.2)] sm:max-w-full dark:bg-neutral-950">
        <div className="flex select-none border-neutral-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`border-fd-border inline-flex w-full items-center justify-center border-b px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-fd-foreground bg-fd-background border-b-blue-600 dark:bg-neutral-900/70"
                  : "text-fd-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <Wrench className="size-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex w-full flex-1 flex-col md:flex-row">
          <div className="min-h-[300px] max-w-[600px] flex-1 overflow-auto p-4 outline-none ring-0">
            <CodeEditor language={activeTab} className="text-sm md:text-base lg:text-lg">
              <div className="space-y-4">
                {examples[activeTab].map((example, index) => (
                  <div key={index}>
                    <h4 className="text-fd-foreground mb-2 font-medium">{example.title}</h4>
                    <pre className="text-fd-muted-foreground">{example.code}</pre>
                  </div>
                ))}
              </div>
            </CodeEditor>
          </div>

          <div className="border-fd-border max-w-full select-none border-t p-4 md:border-l md:border-t-0 lg:w-[300px]">
            <div className="space-y-2">
              {examples[activeTab].map((example, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex flex-row gap-x-4">
                    <span className="text-fd-foreground text-base font-medium">
                      {activeTab.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-row">
                    <span className="mr-2 text-sm text-blue-500">○</span>
                    <span className="text-fd-foreground flex-1 text-sm">{example.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <BorderBeam
          className="absolute inset-0 z-10 rounded-2xl"
          colorFrom="#2563eb"
          colorTo="#3b82f6"
          duration={4}
        />
      </div>
    </motion.div>
  );
} 