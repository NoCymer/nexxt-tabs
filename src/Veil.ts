import $ from "jquery";

/**
 * Veil that hides the totality of the page, can be used to
 * hide view from user when loading elements 
 */
export default class Veil {
    /**
     * Displays the veil
     */
    static displayVeil = () => {
        $("#veil").removeClass("hidden");
    } 
    
    /**
     * Hides the veil
     */
    static hideVeil = () => {
        $("#veil").addClass("hidden");
    }
}