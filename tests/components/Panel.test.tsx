import {render, fireEvent, screen, getByLabelText, getAllByLabelText} from "@testing-library/react"
import "@testing-library/jest-dom"
import React from "react";
import { Panel, PanelTab, PanelTabSmallPane, PanelTabLargePane } from "Components/advanced/Panel";
import { Setting, SettingsPanel } from "Settings/";

let panel: HTMLElement;
let panel1: HTMLElement;
let largePanelOpenedSetting: Setting<boolean>;

describe("Testing Panel class", () => {
    beforeEach(() => {
        render(
            <Panel 
                buttonIconURL="dummyImgURL"
                buttonPosition="tl"
                idPanel="dummy-Panel"
                panelPosition="left"
                buttonType="zone-button"
            >
                
                <PanelTab 
                    tabID="dummy-tab" 
                    tabIconURL="dummyImgURL" 
                    SmallPane={() => 
                        <PanelTabSmallPane><div/></PanelTabSmallPane>
                    }
                />

                <PanelTab 
                    tabID="dummy-tab1" 
                    tabIconURL="dummyImgURL1" 
                    SmallPane={() => 
                        <PanelTabSmallPane><div/></PanelTabSmallPane>
                    }
                    LargePane={() => 
                        <PanelTabLargePane><div/></PanelTabLargePane>
                    }
                />
            </Panel>
        );
        render(
            <Panel 
                buttonIconURL="dummyImgURL2"
                buttonPosition="tl"
                idPanel="dummy-Panel2"
                panelPosition="left"
            >   
                <PanelTab 
                    tabID="dummy-tab2" 
                    tabIconURL="dummyImgURL2" 
                />
                <PanelTab 
                    tabID="dummy-tab3" 
                    tabIconURL="dummyImgURL2" 
                />
            </Panel>
        );

        render(
            <PanelTab 
                    tabID="dummy-tab4" 
                    tabIconURL="dummyImgURL3" 
            />
        );
        render(
            <Panel 
                buttonIconURL="dummyImgURL4"
                buttonPosition="tl"
                idPanel="dummy-Panel4"
                panelPosition="left"
            >   
                <PanelTab 
                    tabID="dummy-tab5" 
                    tabIconURL="dummyImgURL4" 
                    SmallPane={(largePaneOpened) => 
                        <PanelTabSmallPane>
                            <div/>
                        </PanelTabSmallPane>
                        
                    }
                    LargePane={() => 
                        <PanelTabLargePane><div/></PanelTabLargePane>
                    }
                />
            </Panel>
        );
        render(
            <Panel 
                buttonIconURL="dummyImgURL5"
                buttonPosition="tl"
                idPanel="dummy-Panel5"
                panelPosition="left"
            >   
                <PanelTab 
                    tabID="dummy-tab6" 
                    tabIconURL="dummyImgURL5" 
                />
            </Panel>
        );

        panel = screen.getAllByLabelText("side-panel")[0];
        panel1 = screen.getAllByLabelText("side-panel")[1];

    })

    test("Number of childs", () => {
        expect(panel.children.length).toBe(2);
    });

    test("Opening panel", () => {
        fireEvent.click(screen.getAllByLabelText("side-panel-button")[0]);
        expect(panel.className).toMatch(/visible/);
    });

    test("Closing panel", () => {
        fireEvent.click(screen.getAllByLabelText("side-panel-button")[0]);
        expect(panel.className).toMatch(/visible/);

        fireEvent.click(document.body);
        expect(panel.className).not.toMatch(/visible/);
    });

    test("Switching tab", () => {
        fireEvent.click(screen.getAllByLabelText("side-panel-button")[0]);
        expect(panel.className).toMatch(/visible/);

        fireEvent.click(getAllByLabelText(panel, "navbar-button")[1]);
        expect(
            getAllByLabelText(panel, "side-panel-tab-small-pane")[1].className
        ).toMatch(/active/);
    });
})

describe("Testing SettingsPanel class", () => {
    test("Switching tab", () => {
        render(<SettingsPanel></SettingsPanel>)
    });
})