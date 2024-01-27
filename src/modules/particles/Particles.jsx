import { ModulesManager } from "@Modules/base/ModulesManager.tsx";
import { Module } from "@Modules/base/Module.ts";
import moduleJSON from "./module.json";
import $ from "jquery";
import "particles.js";

/**
 * Manages the Particles module 
 */
const ParticlesModule = new Module(
  moduleJSON,
  (module) => {
    const particlesContainer = $("#particles");
    let particlesState = module.enabledSetting;

    //Checks if the particles must be displayed or not
    particlesState.value
    ? particlesContainer.css("opacity", 1)
    : particlesContainer.css("opacity", 0);

    // Callback if the paticle setting changes
    particlesState.subscribe((val) => {
      val
      ? particlesContainer.css("opacity", 1)
      : particlesContainer.css("opacity", 0);
    })
    
    //Loads particles.js 
    particlesJS.load(
      "particles",
      "modules/particles/assets/particles.json",
      function() {}
    );
  }
);

ModulesManager.instance.register(ParticlesModule);

export {ParticlesModule}

