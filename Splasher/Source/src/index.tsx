/* Created by Hauntii under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
import manifest from '../manifest.json';

import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { bulk, filters } from 'enmity/metro';
import { Dialog, Toasts, Users } from 'enmity/metro/common';
import { getIDByName } from 'enmity/api/assets';
import { create } from 'enmity/patcher';

const Patcher = create('Splasher');

const [
   ProfileBanner,
   EditUserProfileBanner,
   UserProfileStore,
   UserSettingsAccountStore,
   Clipboard,
   ChangeBannerActionSheet
] = bulk(
   filters.byName('ProfileBanner', false),
   filters.byName('EditUserProfileBanner', false),
   filters.byProps('getUserProfile'),
   filters.byProps('saveProfileChanges'),
   filters.byProps('setString'),
   filters.byName('ChangeBannerActionSheet', false)
);

// BNR<IMGURID>
const bannerRegex = /\u{e0042}\u{e004E}\u{e0052}\u{e003C}([\u{e0061}-\u{e007A}\u{e0041}-\u{e005a}\u{e0030}-\u{e0039}]+?)\u{e003E}/u;

const encode = (text) => {
   const codePoints = [...text].map((c) => c.codePointAt(0));

   const output: any[] = [];
   for (const char of codePoints) {
      output.push(
         String.fromCodePoint(
            char + (0x00 < char && char < 0x7f ? 0xe0000 : 0)
         ).toString()
      );
   }

   return output.join("");
};

const Splasher: Plugin = {
   ...manifest,

   onStart() {
      let pendingID: string | null;

      // Inital profile patch
      Patcher.after(UserProfileStore, 'getUserProfile', (self, args, res) => {
         if (res === undefined) { return res; }

         const bannerString = res?.bio.match(bannerRegex);

         if (bannerString) {
            res.banner = bannerString[0];
            res.bio = res.bio.replace(bannerRegex, '')
         }

         return res;
      });

      // Actual banner patch
      Patcher.before(ProfileBanner, 'default', (_self, args, _orig) => {
         if (!args[0].bannerSource) { return }
         const bannerURI = args[0].bannerSource['uri']

         if (!bannerURI) { return }

         const id = bannerURI.match(bannerRegex);

         if (id) {
            const parsedID = [...id[0]]
               .map(x => String.fromCodePoint(x.codePointAt(0)! - 0xe0000))
               .join('');

            args[0].bannerSource['uri'] = `https://i.imgur.com/${parsedID.slice(4, -1)}.png`;
         }
      });

      // Jump in-between [Save] and upload our banner to imgur
      Patcher.instead(UserSettingsAccountStore, 'saveProfileChanges', (self, args, res) => {
         const currentProfile = UserProfileStore.getUserProfile(Users.getCurrentUser().id)
         const currentBio = args[0].bio !== undefined ? args[0].bio : currentProfile['bio']
         console.log(args)

         // Removve banner if null by setting the bio to the current one, which is always stripped of the splash.
         if (args[0].banner === null) { args[0].bio = currentBio; return res.apply(self, args); }
         if (!(args[0].banner || currentProfile.banner.match(bannerRegex))) { return res.apply(self, args); }

         // If uploading hasn't completed, block the save from occuring.
         if (args[0].banner && pendingID === null) {
            Toasts.open({
               content: `Slow down and try again!`,
               source: getIDByName("ic_clock_timeout_16px"),
            });

            return;
         }

         const encodedInfo = pendingID ? encode(`BNR<${pendingID}>`) : currentProfile.banner;
         const insertedBio = currentBio + encodedInfo

         // 190 is the maximum length, can't go over that one!
         if (insertedBio.length > 190) {
            Clipboard.setString(encodedInfo)
            Dialog.show({
               title: 'Woah there!',
               body: `There's not enough space in your bio to insert your banner. You need to clear ${encodedInfo.length} characters before you can continue. Your banner has been copied to the clipboard.`,
            });
         }

         args[0].bio = insertedBio;
         pendingID = null;

         return res.apply(self, args);
      });

      // The banner must be uploaded before the save button, otherwise a race condition is forced.
      Patcher.before(UserSettingsAccountStore, 'setPendingBanner', (self, args, res) => {
         if (args[0] === null) { return; }

         const formData = new FormData();
         formData.append('image', args[0].split(',')[1])

         fetch('https://api.imgur.com/3/image', {
            method: "POST",
            body: formData,
            headers: {
               "Authorization": "Client-ID 8218830746fcf7d",
            }
         }).then(response => {
            response.json().then(output => {
               Toasts.open({
                  content: `Banner uploaded!`,
                  source: getIDByName("ic_add_tier_40px"),
               });

               pendingID = output.data.id;
            })
         });
      });

      // Nitro Spoofing

      // This is jank. It enables the "Preview profile" button without nitro, but because I can't just change that prop without it replicating, I have to quickly do the old switcheroo.
      Patcher.instead(EditUserProfileBanner, 'default', (self, args, res) => {
         const premiumType = args[0].user['premiumType'];
         args[0].user['premiumType'] = 2;

         let result = res.apply(self, args);

         args[0].user['premiumType'] = premiumType;
         return result;
      });

      // Switch the banner changing menu from the limited one to the nitro one.
      Patcher.before(ChangeBannerActionSheet, 'default', (_self, args, _orig) => {
         args[0].isTryItOut = true;
      });
   },

   onStop() {
      Patcher.unpatchAll();
   },
};

registerPlugin(Splasher);