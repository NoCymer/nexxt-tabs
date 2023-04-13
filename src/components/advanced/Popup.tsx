import React, {
    ReactNode,
    useEffect,
    useRef,
    useState
} from "react";
import { useFocus, usePopupFocus } from "Hooks";

export interface IPopup {
    popupOpenerRef: React.RefObject<any>
    handleClose: () => void
    children: ReactNode
    className?: string
    visible?: boolean
}

export interface IPositionedPopup extends IPopup {
    posX: number
    posY: number
} 

/** Popup taking the whole screen
 * @param popupOpenerRef Reference to the element that opens the popup
 * @param handleClose Function that is called when the popup closes
 * @param visible Visibility of the popup,
 * false -> Hidden
 * true -> displayed
 * @param className Extra class name for styling the popup
 * @param children Content of the popup
 */
export const Popup = (
        {
            popupOpenerRef,
            handleClose,
            children,
            className,
            visible = false
        }:IPopup
    ) => {
    const [isPopupVisible, setIsPopupVisible] = useState(visible);
    const popup = useRef(null);

    useEffect(()=> {
        if(!visible) handleClose();
        setIsPopupVisible(visible)
    }, [visible])

    usePopupFocus([popup, popupOpenerRef], () => {
        handleClose();
        setIsPopupVisible(false);
    });

    return (
        <div className="popup-container">
            <div
                className={`popup fullscreen ${className ? className : ""}`}
                ref={popup}
            >
                <span onClick={handleClose} aria-label="close-popup"/>
                <div className="popup-content">
                    {children}
                </div>
            </div>
        </div>
    )
}

/** Popup placed at a fixed x, y position
 * @param popupOpenerRef Reference to the element that opens the popup
 * @param handleClose Function that is called when the popup closes
 * @param posX Position of the popup on the X axis
 * @param posY Position of the popup on the Y axis
 * @param className Extra class name for styling the popup
 * @param children Content of the popup
 */
export const PositionedPopup = ({
    popupOpenerRef,
    handleClose,
    posX,
    posY,
    className,
    children}:IPositionedPopup) => {

    const popup = useRef(null);

    useFocus([popup, popupOpenerRef], () => {
        handleClose();
    });

    const stylePosition:React.CSSProperties = {
        left: posX + "px",
        top: posY + "px"
    }

    return(
        <div
            className={`popup relative ${className ? className : ""}`}
            style={stylePosition}
            ref={popup}
        >
            <div className="popup-content">
                {children}
            </div>
        </div>
    )
}
