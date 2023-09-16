import { PanelTab, PanelTabSmallPane } from '@Components/advanced/Panel'
import { ModulesSettingsTabContent } from '@Modules/base/ModulesManager'
import React from 'react'
import { useTheme } from '@Hooks/useTheme'

/**
 * Tab that contains all settings related to the modules
 */
export const ModulesTab = () => {
    const [theme, setTheme] = useTheme();
    return (
        <PanelTab
            tabID="modules-tab" 
            tabIconURL={`app-ressources/${theme}/features-symbol.svg`}
            SmallPane={() => 
                <PanelTabSmallPane>
                    <ModulesSettingsTabContent/>
                </PanelTabSmallPane>
            }
        />
    )
}