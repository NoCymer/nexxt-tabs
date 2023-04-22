import { PanelTab, PanelTabSmallPane } from '@Components/advanced/Panel'
import { ModulesSettingsTabContent } from '@Modules/base/ModulesManager'
import React from 'react'

/**
 * Tab that contains all settings related to the modules
 */
export const ModulesTab = () => {
    return (
        <PanelTab
            tabID="modules-tab" 
            tabIconURL="app-ressources/features-symbol.svg" 
            SmallPane={() => 
                <PanelTabSmallPane>
                    <ModulesSettingsTabContent/>
                </PanelTabSmallPane>
            }
        />
    )
}