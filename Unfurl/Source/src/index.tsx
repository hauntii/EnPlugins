/* Created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { furlCommands } from './commands';

const Unfurl: Plugin = {
   ...manifest,

   onStart() {
      this.commands = furlCommands
   },

   onStop() {
      this.commands = []
   }
};

registerPlugin(Unfurl);
