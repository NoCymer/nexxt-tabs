import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { Setting } from "Settings/";
import Slider from "Components/basic/switches/Slider";
import Checkbox from "Components/basic/switches/Checkbox";
import { useSetting } from "Hooks";
import { INumberField } from "Components/basic/NumberField";
import { IInlineChoiceContainer } from "Components/basic/InlineChoice";
import { ITextField } from "Components/basic/TextField";
import { IDropDownList } from "Components/basic/DropDownList";
import { IDateTimeField } from "Components/basic/DateTimeField";

interface IFeature{
    setting: Setting<boolean>
    title: string
    desc: string
    img: string
    children?: ReactNode
}
/**
 * Feature template with slider to turn it on or off. 
 * Value is linked to a setting object.
 * @param title Header of the feature
 * @param desc Description of the feature
 * @param img Image of the feature
 * @param setting Setting binded to the feature
 */
export const Feature = ({title, desc, img, setting, children}: IFeature) => {

    const [active, setActive] = useSetting(setting);

    return(
        <div aria-label="feature" className={
            active ? "feature-wrapper active" : "feature-wrapper"
        }>
            <div className="feature">
                <img src={img}/>
                <div className="info">
                    <h1 className="title">{title}</h1>
                    <p className="desc">{desc}</p>
                </div>
                <Slider
                    isActive={active}
                    onChange={(isActive) => {setActive(isActive)}}
                />
            </div>
            {children && <div className="feature-options">{children}</div>}
        </div>
    )
}

interface IFeatureField{
    title: string
    desc: string
    img: string
    field: (
        React.ReactElement<INumberField> | 
        React.ReactElement<IInlineChoiceContainer> |
        React.ReactElement<ITextField> |
        React.ReactElement<IDropDownList> |
        React.ReactElement<IDateTimeField>
    )
    children?: ReactNode
}
/**
 * Feature template with a field. 
 * Value of the field is linked to a setting object.
 * @param title Header of the feature
 * @param desc Description of the feature
 * @param img Image of the feature
 * @param setting Setting binded to the feature
 * @param field Field contained in the feature
 */
export const FeatureField = (
        {title, desc, img, field, children}: IFeatureField
    ) => {

    return(
        <div 
            aria-label="feature"
            className="feature-wrapper active feature-field"
        >
            <div className="feature">
                <img src={img}/>
                <div className="info">
                    <h1 className="title">{title}</h1>
                    <p className="desc">{desc}</p>
                </div>
                {field}
                {children && <div className="feature-options">{children}</div>}
            </div>
        </div>
    )
}

interface IFeatureOptionCheckbox {
    description: string
    setting: Setting<boolean>,
    img?: ("new-tab")
}
/**
 * Sub option for a feature parent, value linked to a setting object
 * @param description Description of the sub-option
 * @param setting Linked setting object
 * @param img Value is either null or equal to "new-tab" 
 * which will adapt the visual to a new tab sub-option
 */
export const FeatureOptionCheckbox = ({
        description,
        setting,
        img
    }: IFeatureOptionCheckbox) => {

    const [active, setActive] = useSetting(setting);

    const getImg = () => {
        if(img)
            return <img src="app-ressources/new-tab-symbol.svg"/>
        return null;
    }

    return (
        <div aria-label="feature-option" className="feature-option">
            {getImg()}
            <div 
                className={
                    img?"info-feature-option" : "info-feature-option mrg"
                }
            >
                <p className="desc">{description}</p>
            </div>
            <Checkbox
                isActive={active}
                onChange={(isActive) => {setActive(isActive)}}
            />
        </div>
    )
}

interface IFeatureOption {
    description?: string
    children: ReactNode,
    img?: string
}
/**
 * Sub option for a feature parent
 * @param children Children of the feature
 * @param img Value is either null or equal to an image URL
 */
export const FeatureOption = ({
        children,
        description,
        img
    }: IFeatureOption) => {

    const getImg = () => {
        if(img)
            return <img src="app-ressources/new-tab-symbol.svg"/>
        return null;
    }

    return (
        <div aria-label="feature-option" className="feature-option">
            {getImg()}
            {description && 
                <div className={img?"info-feature-option" : "info-feature-option mrg"}>
                    <p className="desc">{description}</p>
                </div>
            }
            {children}
        </div>
    )
}