/* Created by Nik0dev under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import manifest from '../manifest.json';
import { roryCommands } from './commands';

const GetThatRory: Plugin = {
   ...manifest,

   onStart() {
      this.commands = roryCommands
   },

   onStop() {
      this.commands = []
   }
};

registerPlugin(GetThatRory);
