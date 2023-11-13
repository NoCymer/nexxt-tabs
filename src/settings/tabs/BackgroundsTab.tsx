import { Feature, FeatureOption, FeatureOptionCheckbox } from '@Components/advanced/Feature';
import { PanelTab, PanelTabLargePane, PanelTabSmallPane } from '@Components/advanced/Panel'
import { Popup } from '@Components/advanced/Popup';
import { Button, ButtonContainer } from '@Components/basic/Button';
import DropDownList from '@Components/basic/DropDownList';
import NumberField from '@Components/basic/NumberField';
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import appManager from '../../AppManager';
import { Backgrounds } from "../../backgrounds/Background";
import backgroundsDB from "../../backgrounds/BackgroundsDatabase";
import BackgroundsManager from '../../backgrounds/BackgroundsManager';
import { usePopup } from '@Hooks/usePopup';
import $ from "jquery";
import { resolve } from 'path';
import { useTheme } from '@Hooks/useTheme';

const bgSelectedIdsSetting = appManager
    .getSetting("background-id-selected-array");
const bgIDsArraySetting = appManager
    .getSetting("background-ids-array");

const allowedFileTypes = [
    "image/jpeg",
    "image/gif",
    "image/png",
    "image/jpg",
    "image/svg",
    "image/webp",
    "video/mp4"
]



/**
 * Allows to add new backgrounds in the database
 * @param setBackgroundPopupVisibility Popup visibility 
 */
const StoreBackground = ({setBackgroundPopupVisibility}) => {
    const { t } = useTranslation();
    const [selectedFiles, setSelectedFiles] = useState<any[]>();

    const onFileDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.items) {
            let files = [];
            [...event.dataTransfer.items].forEach((item, i) => {
                if (
                    item.kind === "file" && 
                    allowedFileTypes.includes(item.type)
                ) {
                    files.push(item.getAsFile());
                }
            });
            if(selectedFiles)
                setSelectedFiles(selectedFiles.concat(files));
            else 
                setSelectedFiles(files);
        }
    }

    const onFileChange = (event: React.FormEvent) => {
        let fileList = (event.target as HTMLInputElement).files;
        let files = [];
        for(let i = 0; i < fileList.length; i++) {
            files.push(fileList.item(i));
        }
        setSelectedFiles(files);
    };

    const registerBackground = async (file, id: string) => {
        return new Promise<boolean>((resolve, reject) => {
            
            const fr = new FileReader();

            fr.readAsArrayBuffer(file);

            fr.onload = async () => {
                // Creating blob
                const blob = new Blob([fr.result], {type:file.type})

                backgroundsDB.storeBackground(
                    id,
                    blob
                );

                let temp = bgSelectedIdsSetting.value;
                temp.push(id);
                bgSelectedIdsSetting.value = temp;

                resolve(true)
            }
            
        })
    }

    const onFileUpload = async (e: React.MouseEvent) => {
        e.preventDefault();

        // Create an object of formData
        const formData = new FormData();
        
        // Update the formData object
        for(let i = 0; i < selectedFiles.length; i++) {
            if(allowedFileTypes.includes(selectedFiles[i].type)) {
                formData.append(
                    selectedFiles[i].name,
                    selectedFiles[i],
                    selectedFiles[i].name
                );
            }
            else {
                console.error(
                    "[ ERROR ] : This type of file is not supported !"
                );
                return;
            }
        }

        let ids = await backgroundsDB.fetchIds();
        let firstFreeId = ids.length > 0 ? 
            Number.parseInt(`${ids[ids.length-1]}`) + 1 : 0;
        let newIDs = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            let id = firstFreeId + i;
            await registerBackground(selectedFiles[i], `${id}`);
            newIDs.push(`${id}`);
        }
        
        bgIDsArraySetting.value = 
        [
            ...bgIDsArraySetting.value,
            ...newIDs
        ]
        setBackgroundPopupVisibility()(false);
    };

    const onDragHover = (event) => {
        event.preventDefault();
        if (event.dataTransfer.items) {
            let validFiles = true;
            [...event.dataTransfer.items].forEach((item, i) => {
                if(!(item.kind === "file")){
                    validFiles = false;
                    return;
                }
                if(!allowedFileTypes.includes(item.type)) {
                    validFiles = false;
                    return;
                }
            })
            validFiles && $(event.target).addClass("hover");
        }
    }

    const onDragLeave = (event) => {
        event.preventDefault();
        $(event.target).removeClass("hover")
    }

    const handleDelete = (e, image) => {      
        e.stopPropagation();
        setSelectedFiles(selectedFiles.filter(img => img.name != image.name));
    }

    const BackgroundPreview = ({file}) => {
        const [content, setContent] = useState(file);
        if(content.type.includes("video")) {
            return(
                <div className="img-placeholder image ">
                    <span className="img-veil"/>
                    <video autoPlay={true} loop={true}><source src={URL.createObjectURL(content)} type={content.type} /></video>
                    <span className="delete" onClick={(e) => handleDelete(e, content)}/>
                </div>
            )
        } else {
            return(
                <div className="img-placeholder image ">
                    <span className="img-veil"/>
                    <img src={URL.createObjectURL(content)}></img>
                    <span className="delete" onClick={(e) => handleDelete(e, content)}/>
                </div>
            )
        }
    }

    return (
        <>
        <div className="drop-zone-wrapper">
            {
                selectedFiles && selectedFiles.length > 0 ? 
                selectedFiles.map((file, i) => {
                    return <BackgroundPreview file={file} key={i}/>
                }) : null
            }
            {
                selectedFiles && selectedFiles.length > 0 ? 
                <div className="separator thin"></div> : null
            }
            {
                <div 
                    className="img-placeholder drop-zone full-size"
                    onDrop={onFileDrop}
                    onDragOver={onDragHover}
                    onDragLeave={onDragLeave}
                    onDropCapture={onDragLeave}
                >
                    <h1>{t("drop-zone")}</h1>
                </div>
            }
        </div>
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
                        image/webp,
                        video/mp4
                    "
                    type="file"
                    onChange={onFileChange}
                    multiple={true}
                />
            </div>
            <ButtonContainer direction="inline" fitMode="fit">
            
            { selectedFiles && selectedFiles.length > 0 && 
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
    const [theme, setTheme] = useTheme();
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
        tabIconURL={`app-ressources/${theme}/background-symbol.svg`}
        LargePane={(largePaneOpened) => 
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
                <Backgrounds shouldDisplaySetting={largePaneOpened}/>
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
                    img={`app-ressources/${theme}/cycle-symbol.svg`}
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
