import React, { useState } from 'react'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  if (!tabs || tabs.length === 0) return null

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    if (onChange) {
      onChange(tabId)
    }
  }

  const activeContent = tabs.find((t) => t.id === activeTab)?.content

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-6 border-b border-graphite-200 overflow-x-auto no-scrollbar mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`pb-3 text-sm font-semibold transition-colors duration-150 border-b-2 bg-transparent cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-signal-600 border-signal-600'
                : 'text-graphite-600 border-transparent hover:text-graphite-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{activeContent}</div>
    </div>
  )
}
