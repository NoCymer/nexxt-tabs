import { Feature, FeatureOption, FeatureOptionCheckbox } from 'Components/advanced/Feature';
import { PanelTab, PanelTabLargePane, PanelTabSmallPane } from 'Components/advanced/Panel'
import { Popup } from 'Components/advanced/Popup';
import { Button, ButtonContainer } from 'Components/basic/Button';
import DropDownList from 'Components/basic/DropDownList';
import NumberField from 'Components/basic/NumberField';
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import appManager from '../../AppManager';
import { Backgrounds } from "../../Background";
import backgroundsDB from "../../BackgroundsDatabase";
import BackgroundsManager from '../../BackgroundsManager';
import { usePopup } from '../../hooks';

const bgSelectedIdsSetting = appManager
    .getSetting("background-id-selected-array");
const bgIDsArraySetting = appManager
    .getSetting("background-ids-array");

/**
 * Allows to add new backgrounds in the database
 * @param setBackgroundPopupVisibility Popup visibility 
 */
const StoreBackground = ({setBackgroundPopupVisibility}) => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);

    const onFileChange = (event: React.FormEvent) => {
        setSelectedFile((event.target as HTMLInputElement).files[0]);
    };

    const onFileUpload = async (e: React.MouseEvent) => {
        e.preventDefault();
        const allowedFileTypes = [
            "image/jpeg",
            "image/gif",
            "image/png",
            "image/jpg",
            "image/svg",
            "image/webp"
        ]

        // Create an object of formData
        const formData = new FormData();
        
        // Update the formData object
        formData.append(
            "myFile",
            selectedFile,
            selectedFile.name
        );
        
        if(!allowedFileTypes.includes(selectedFile.type)) {
            console.error("[ ERROR ] : This type of file is not supported !");
            return;
        }

        const fr = new FileReader();
        fr.readAsArrayBuffer(selectedFile);

        fr.onload = async() => {
            // Creating blob
            const blob = new Blob([fr.result])

            const ids = await backgroundsDB.fetchIds();
            const id = ids.length > 0 ? 
            `${Number.parseInt(`${ids[ids.length-1]}`) + 1}` : "0";
            backgroundsDB.storeBackground(
                id,
                blob
            );
            let temp = bgSelectedIdsSetting.value;
            temp.push(`${id}`);
            bgSelectedIdsSetting.value = temp;

            temp = bgIDsArraySetting.value;
            temp.push(`${id}`);
            bgIDsArraySetting.value = temp;
        }
        setBackgroundPopupVisibility()(false);
    };

    return (
        <>
        {
            selectedFile ?
            <img src={URL.createObjectURL(selectedFile)}/> :
            <div className="img-placeholder"></div>
        }
        <form action="">
            <div className="input-button">
                <h1>{t("browse")}</h1>
                <input
                    id="files"
                    accept="
                        image/jpeg,
                        image/gif,
                        image/png,
                        image/jpg,
                        image/svg,
                        image/webp
                    "
                    type="file"
                    onChange={onFileChange}
                />
            </div>
            <ButtonContainer direction="inline" fitMode="fit">
            
            { selectedFile && 
                <Button 
                    callback={onFileUpload}
                    options={{color:"success", fillMode:"filled"}}
                    formAction="submit"
                >
                    
                    {t("save")}
                </Button>
            }
                <Button 
                    callback={() => setBackgroundPopupVisibility()(false)}
                    options={{color:"danger", fillMode:"outlined"}}
                    type="button"
                >
                    
                    {t("discard")}
                </Button>
            </ButtonContainer>
        </form>
        </>
    )
}

/**
 * Tab that displays backgrounds options
 */
export const BackgroundsTab = () => {
    const { t } = useTranslation();
    const [backgroundPopupVisibility, setBackgroundPopupVisibility] = usePopup(
        <Popup 
            popupOpenerRef={null}
            handleClose={() => {setBackgroundPopupVisibility(false)}}
            className="add-background-popup"
        >
            <h1>{t("add-background")}</h1>
            <StoreBackground setBackgroundPopupVisibility={
                () => setBackgroundPopupVisibility
            }/>
        </Popup>
    );
    return (
    <PanelTab
        tabID="backgrounds-tab" 
        tabIconURL="./app-ressources/background-symbol.svg"
        LargePane={() => 
            <PanelTabLargePane>
                <ButtonContainer direction="stacked" fitMode="fit">
                <Button 
                    callback={() => {
                        setBackgroundPopupVisibility(true);
                    }}
                    options={{color:"primary", fillMode:"filled"}}>
                    
                    {t("add-background")}
                </Button>
                </ButtonContainer>
                <span className="separator thin"/>
                <ButtonContainer direction="inline" fitMode="fit">
                <Button 
                    callback={() => {
                        bgSelectedIdsSetting.value = bgIDsArraySetting.value;
                    }}
                    options={{color:"primary", fillMode:"outlined"}}>
                    
                    {t("select-all")}
                </Button>
                <Button 
                    callback={() => {
                        bgSelectedIdsSetting.value = [
                            "" + bgIDsArraySetting.value[0]
                        ];
                        BackgroundsManager.instance.changeBackgroundToID(
                            BackgroundsManager.instance.getNextID()
                        );
                    }}
                    options={{color:"danger", fillMode:"outlined"}}>
                    
                    {t("deselect-all")}
                </Button>
                </ButtonContainer>
                <Backgrounds/>
            </PanelTabLargePane>
        }
        SmallPane={(largePaneOpened) => 
            <PanelTabSmallPane>
            <h1>{t("background-tab-title")}</h1>
            <span className="separator thick"/>
            <section>
                <h2>{t("background-title")}</h2>
                <h3>{t("background-subtitle")}</h3>
                <Feature
                    title={t("cycle-backgrounds")}
                    desc={t("cycle-backgrounds-desc")}
                    img={"app-ressources/cycle-symbol.svg"}
                    setting={appManager.getSetting(
                        "background-cycle-boolean"
                    )}
                >
                    <FeatureOption
                        description={t("cycle-backgrounds-interval")}
                    >
                        <NumberField 
                            defaultValue={appManager.getSetting(
                                "background-cycle-interval-integer").value
                            }
                            onInput={(val) => {appManager.getSetting(
                                "background-cycle-interval-integer").value = val
                            }}
                        />
                        <DropDownList 
                            options={
                                [
                                    {content:t("hours"  ), value:"hr"  },
                                    {content:t("minutes"), value:"min" },
                                    {content:t("seconds"), value:"sec" },
                                ]
                            } 
                            selectedValue={appManager.getSetting(
                                "background-cycle-interval-unit-string").value
                            }
                            onChange={(value) => 
                                appManager.getSetting(
                                    "background-cycle-interval-unit-string"
                                ).value = value
                            }
                        />
                    </FeatureOption>
                    <FeatureOptionCheckbox
                        setting={appManager.getSetting(
                            "background-shuffle-boolean"
                        )}
                        description={t("cycle-backgrounds-shuffle")}
                    />
                    
                </Feature>

                <span className="separator thin no-margin-top"/>
                {!largePaneOpened.value ?
                <ButtonContainer direction="stacked">
                <Button 
                    callback={() => {largePaneOpened.value=true}}
                    options={{color:"primary", fillMode:"filled"}}>
                    
                    {t("Edit Backgrounds")}
                </Button>
                </ButtonContainer> :
                <ButtonContainer direction="stacked">
                <Button 
                    callback={() => {largePaneOpened.value=false}}
                    options={{color:"success", fillMode:"filled"}}>
                    
                    {t("save")}
                </Button>
                </ButtonContainer>
                }
            </section>
            </PanelTabSmallPane>
        } 
    />
    )
}
