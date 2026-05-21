// module.esports.js

const updateSaham = async () => {
    let bot = global.db.data.bots;
    let persen = [0.005, 0.01, 0.015, 0.02, 0.025, 0.03];
    let saham = Object.entries(bot.saham.item);
    for (let [name, value] of saham) {
        let volNaik = value.rise.filter((v) => v === "naik").length;
        let volTurun = value.rise.filter((v) => v === "turun").length;

        if (value.volumeBuy - value.volumeSell > 10000 && volNaik === 1) {
            value.rise.push("naik");
        } else if (value.volumeSell - value.volumeBuy > 10000 && volTurun === 1) {
            value.rise.push("turun");
        } else if (value.volumeBuy - value.volumeSell < 10000 && volNaik === 2) {
            let indexNaik = value.rise.indexOf("naik");
            if (indexNaik !== -1) value.rise.splice(indexNaik, 1);
        } else if (value.volumeSell - value.volumeBuy < 10000 && volTurun === 2) {
            let indexTurun = value.rise.indexOf("turun");
            if (indexTurun !== -1) value.rise.splice(indexTurun, 1);
        }

        let isPersen = persen[Math.floor(Math.random() * persen.length)];
        let fluktuasi = parseInt((value.harga * isPersen).toFixed(0));
        let isRise = value.rise[Math.floor(Math.random() * value.rise.length)];

        if (isRise === "naik") {
            value.harga += fluktuasi;
        } else if (isRise === "turun") {
            value.harga -= fluktuasi;
        }

        if (value.harga < 1) value.harga = 1;
    }
};

const updateCrypto = async () => {
    let bot = global.db.data.bots;
    let persen = [0.005, 0.01, 0.015, 0.02, 0.03];
    let invest = Object.entries(bot.invest.item);
    for (let [name, value] of invest) {
        let volNaik = value.rise.filter((v) => v === "naik").length;
        let volTurun = value.rise.filter((v) => v === "turun").length;

        if (value.volumeBuy - value.volumeSell > 10000 && volNaik === 1) {
            value.rise.push("naik");
        } else if (value.volumeSell - value.volumeBuy > 10000 && volTurun === 1) {
            value.rise.push("turun");
        } else if (value.volumeBuy - value.volumeSell < 10000 && volNaik === 2) {
            let indexNaik = value.rise.indexOf("naik");
            if (indexNaik !== -1) value.rise.splice(indexNaik, 1);
        } else if (value.volumeSell - value.volumeBuy < 10000 && volTurun === 2) {
            let indexTurun = value.rise.indexOf("turun");
            if (indexTurun !== -1) value.rise.splice(indexTurun, 1);
        }

        let isPersen = persen[Math.floor(Math.random() * persen.length)];
        let fluktuasi = parseInt((value.harga * isPersen).toFixed(0));
        let isRise = value.rise[Math.floor(Math.random() * value.rise.length)];

        if (isRise === "naik") {
            value.harga += fluktuasi;
        } else if (isRise === "turun") {
            value.harga -= fluktuasi;
        }

        if (value.harga < 1) value.harga = 1;
    }
};

const resetCryptoPrice = async () => {
    let invest = global.db.data.bots.invest.item;
    let data = Object.keys(invest);
    for (let name of data) {
        invest[name].hargaBefore = invest[name].harga;
    }
};

const resetSahamPrice = async () => {
    let saham = global.db.data.bots.saham.item;
    let data = Object.keys(saham);
    for (let name of data) {
        saham[name].hargaBefore = saham[name].harga;
    }
};

const resetVolumeSaham = async () => {
    let bot = global.db.data.bots;
    let data = Object.keys(bot.saham.item);
    for (let v of data) {
        bot.saham.item[v].volumeBuy = 0;
        bot.saham.item[v].volumeSell = 0;
    }
};

const resetVolumeCrypto = async () => {
    let bot = global.db.data.bots;
    let data = Object.keys(bot.invest.item);
    for (let v of data) {
        bot.invest.item[v].volumeBuy = 0;
        bot.invest.item[v].volumeSell = 0;
    }
};

module.exports = {
    updateSaham,
    updateCrypto,
    resetCryptoPrice,
    resetSahamPrice,
    resetVolumeSaham,
    resetVolumeCrypto
};