var p="Splasher",b="1.0.0",f="Lets you use imgur pictures as profile banners!",g="#FFFEB1",h=[{name:"Niko",id:"341377368075796483"}],S={name:p,version:b,description:f,color:g,authors:h};function P(e){window.enmity.plugins.registerPlugin(e)}const a={byProps:(...e)=>window.enmity.modules.filters.byProps(...e),byName:(e,i)=>window.enmity.modules.filters.byName(e,i),byTypeName:(e,i)=>window.enmity.modules.filters.byTypeName(e,i),byDisplayName:(e,i)=>window.enmity.modules.filters.byDisplayName(e,i)};function v(...e){return window.enmity.modules.bulk(...e)}window.enmity.modules.common,window.enmity.modules.common.Constants,window.enmity.modules.common.Clipboard,window.enmity.modules.common.Assets,window.enmity.modules.common.Messages,window.enmity.modules.common.Clyde,window.enmity.modules.common.Avatars,window.enmity.modules.common.Native,window.enmity.modules.common.React,window.enmity.modules.common.Dispatcher,window.enmity.modules.common.Storage;const l=window.enmity.modules.common.Toasts,N=window.enmity.modules.common.Dialog;window.enmity.modules.common.Token,window.enmity.modules.common.REST,window.enmity.modules.common.Settings;const C=window.enmity.modules.common.Users;window.enmity.modules.common.Navigation,window.enmity.modules.common.NavigationNative,window.enmity.modules.common.NavigationStack,window.enmity.modules.common.Theme,window.enmity.modules.common.Linking,window.enmity.modules.common.StyleSheet,window.enmity.modules.common.ColorMap,window.enmity.modules.common.Components,window.enmity.modules.common.Locale,window.enmity.modules.common.Profiles,window.enmity.modules.common.Lodash,window.enmity.modules.common.Logger,window.enmity.modules.common.Flux,window.enmity.modules.common.SVG,window.enmity.modules.common.Scenes,window.enmity.modules.common.Moment;function c(e){return window.enmity.assets.getIDByName(e)}function T(e){return window.enmity.patcher.create(e)}const s=T("Splasher"),[B,A,w,y,D,U]=v(a.byName("ProfileBanner",!1),a.byName("EditUserProfileBanner",!1),a.byProps("getUserProfile"),a.byProps("saveProfileChanges"),a.byProps("setString"),a.byName("ChangeBannerActionSheet",!1)),u=/\u{e0042}\u{e004E}\u{e0052}\u{e003C}([\u{e0061}-\u{e007A}\u{e0041}-\u{e005a}\u{e0030}-\u{e0039}]+?)\u{e003E}/u,k=e=>{const i=[...e].map(n=>n.codePointAt(0)),o=[];for(const n of i)o.push(String.fromCodePoint(n+(0<n&&n<127?917504:0)).toString());return o.join("")},_={...S,onStart(){let e;s.after(w,"getUserProfile",(i,o,n)=>{if(n===void 0)return n;const t=n==null?void 0:n.bio.match(u);return t&&(n.banner=t[0],n.bio=n.bio.replace(u,"")),n}),s.before(B,"default",(i,o,n)=>{if(!o[0].bannerSource)return;const t=o[0].bannerSource.uri;if(!t)return;const m=t.match(u);if(m){const r=[...m[0]].map(d=>String.fromCodePoint(d.codePointAt(0)-917504)).join("");o[0].bannerSource.uri=`https://i.imgur.com/${r.slice(4,-1)}.png`}}),s.instead(y,"saveProfileChanges",(i,o,n)=>{const t=w.getUserProfile(C.getCurrentUser().id),m=o[0].bio!==void 0?o[0].bio:t.bio;if(console.log(o),o[0].banner===null)return o[0].bio=m,n.apply(i,o);if(!(o[0].banner||t.banner.match(u)))return n.apply(i,o);if(o[0].banner&&!e){l.open({content:"Slow down and try again!",source:c("ic_clock_timeout_16px")});return}const r=e?k(`BNR<${e}>`):t.banner,d=m+r;return d.length>190&&(D.setString(r),N.show({title:"Woah there!",body:`There's not enough space in your bio to insert your banner. You need to clear ${r.length} characters before you can continue. Your banner has been copied to the clipboard.`})),o[0].bio=d,e=null,n.apply(i,o)}),s.before(y,"setPendingBanner",(i,o,n)=>{if(o[0]===null)return;const t=new FormData;t.append("image",o[0].split(",")[1]),fetch("https://api.imgur.com/3/image",{method:"POST",body:t,headers:{Authorization:"Client-ID 8218830746fcf7d"}}).then(m=>{m.json().then(r=>{l.open({content:"Banner uploaded!",source:c("ic_add_tier_40px")}),e=r.data.id})})}),s.instead(A,"default",(i,o,n)=>{const t=o[0].user.premiumType;o[0].user.premiumType=2;let m=n.apply(i,o);return o[0].user.premiumType=t,m}),s.before(U,"default",(i,o,n)=>{o[0].isTryItOut=!0})},onStop(){s.unpatchAll()}};P(_);
