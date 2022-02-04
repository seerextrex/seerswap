import { useState } from 'react'
import { Database, LifeBuoy } from 'react-feather'
import { Tab, TabIcon, Tabs, TabSpacer } from './styled'

const tabs = [
    {
        title: 'My rewards',
        icon: <LifeBuoy />
    },
    {
        title: 'My farms',
        icon: <Database />
    }
]

export function StakerTabs({ changeTabHandler }: { changeTabHandler: (i: number) => void }) {
    const [activeTab, setActiveTab] = useState(0)

    const selectTab = function(i: number) {
        setActiveTab(i)
        changeTabHandler(i)
    }
    return (
        <Tabs>
            {tabs.map((el, i) => (
                <>
                    <Tab onClick={() => selectTab(i)} active={i === activeTab} key={i}>
                        <TabIcon>{el.icon}</TabIcon>
                        <span>{el.title}</span>
                    </Tab>
                    <TabSpacer />
                </>
            ))}
        </Tabs>
    )
}
