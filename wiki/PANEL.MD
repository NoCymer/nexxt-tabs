This page explains how panels works and how to create a custom one

## Structure
A panel holds one or up to 6 tabs, the sixth one will be displayed at the bottom of the panel's navbar whilst the rest will be displayed from the top of the navbar.

## Creating a Panel
To create a panel, we first need to import the Panel and PanelTab component
```ts
import { Panel, PanelTab } from "./Panel";
```

Next to create the panel we need to assign a unique ID ending with "-panel", an icon for its opening button as well as the position of the said button we can also specify if the button is a clickable zone, finally we need to specify from which side the panel will slide from.
```tsx
<Panel 
    buttonIconURL="icon-url"
    buttonPosition="tl" // Possible values {tl, t, tr, l, r, bl, b, br}
    buttonType="zone-button" // Optional, possible-value {zone-button}
    idPanel="name-panel"
    panelPosition="left"
/>
```
## Props of the Panel
> **buttonIconURL** : URL of the button'sicon that opens the Panel

> **buttonPosition** : Position of the button that opens the Panel 

> **buttonType** : Optional display type of the button if set to "zone-button" the button will be a clickable area with the icon at its center

> **idPanel** : Unique id of the Panel

> **panelPosition** : Position of the Panel, either left or right which determines if the Panel opens from the left-hand side of the page or from the right-hand side of the page.


## Creating a PanelTab
To make a working panel we need to add at least one PanelTab inside of it.

A PanelTab is composed of a unique ID ending with "-tab", the URL of its icon and an optional className
```tsx
    <Panel 
        idPanel="dummy-panel"
        buttonIconURL="../@Public/app-ressources/xyz.svg"
        panelPosition="right"
        buttonPosition="tr">

        // Creating a first tab
        <PanelTab
            tabID="dummy-tab" 
            tabIconURL="app-ressources/dummy-symbol.svg"
            LargePane={() => 
                <PanelTabLargePane>
                    {/** Content of the large pane goes there */}
                </PanelTabLargePane>
            }
            SmallPane={(largePaneOpened) => 
                <PanelTabSmallPane>
                    {/** Content of the small pane goes there */}
                </PanelTabSmallPane>
            } 
        />

        // Creating a second tab
        <PanelTab
            tabID="dummy1-tab" 
            tabIconURL="app-ressources/dummy1-symbol.svg"
            LargePane={() => 
                <PanelTabLargePane>
                    {/** Content of the large pane goes there */}
                </PanelTabLargePane>
            }
            SmallPane={(largePaneOpened) => 
                <PanelTabSmallPane>
                    {/** Content of the small pane goes there */}
                </PanelTabSmallPane>
            } 
        />
    </Panel>
```
## Props of the PanelTab
> **tabID** : Unique id of the tab that must end with -tab

> **tabIconURL** : URL of the icon of the tab that will be displayed in the navbar of the parent Panel

> **SmallPane** : Main Pane displayed when the PanelTab is opened, the parameter **largePaneOpened** is a setting that can be updated to open or close the LargePane linked to the PanelTab<br> *example : largePaneOpened.value = true* will open the LargePane

> **LargePane** : LargePane linked to the PanelTab, gets opened/closed by the SmallPane and also get cloosed when the active PanelTab changes


