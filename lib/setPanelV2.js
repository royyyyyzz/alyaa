require('../settings')
const fetch = require('node-fetch')
const fs = require('fs')
const axios = require("axios");
const got = require("got");
const FormData = require("form-data");
const cheerio = require("cheerio");
const Jimp = require("jimp");
const { fromBuffer } = require('file-type')
const {
  sizeFormatter
} = require('human-readable')
const moment = require('moment-timezone')
const date = moment.tz('Asia/Jakarta').format(`DD MMM yyyy`)
  async function createUser2(email, username, password) {
    		const response = await axios.post(global.domain2 + '/api/application/users', {
    			email,
    			username,
    			first_name: username,
    			last_name: username,
    			language: "en",
    			password
    		}, {
    			headers: {
    				"Accept": "application/json",
    				"Content-Type": "application/json",
    				"Authorization": `Bearer ${global.apiuser2}`
    			}
    		});
    		return response.data;
    	}

    	async function createServer2(name, userId, startup_cmd, memo, cpu, disk) {
    		const response = await axios.post(global.domain2 + `/api/application/servers`, {
    			name,
    			description: "Created On " + date,
    			user: userId,
    			egg: parseInt(global.eggs2),
    			docker_image: "ghcr.io/parkervcp/yolks:nodejs_20",
    			startup: startup_cmd,
    			environment: {
    				INST: "npm",
    				USER_UPLOAD: "0",
    				AUTO_UPDATE: "0",
    				CMD_RUN: "npm start"
    			},
    			limits: {
    				memory: memo,
    				swap: 0,
    				disk,
    				io: 500,
    				cpu
    			},
    			feature_limits: {
    				databases: 5,
    				backups: 5,
    				allocations: 5
    			},
    			deploy: {
    				locations: [parseInt(global.location2)],
    				dedicated_ip: false,
    				port_range: []
    			}
    		}, {
    			headers: {
    				"Accept": "application/json",
    				"Content-Type": "application/json",
    				"Authorization": `Bearer ${global.apiuser2}`
    			}
    		});
    		return response.data;
    	}

    	async function getEggStartupCommand2() {
    		const response = await axios.get(global.domain2 + `/api/application/nests/${global.nets2}/eggs/${global.eggs2}`, {
    			headers: {
    				"Accept": "application/json",
    				"Content-Type": "application/json",
    				"Authorization": `Bearer ${global.apiuser2}`
    			}
    		});
    		return response.data;
    	}
    	
    	async function manageServer2(action, srv) {
        if (!srv) throw new Error('Input *ID* from server');
    
        try {
            const response = await axios.post(global.domain2 + `/api/client/servers/${srv}/power`, {
                signal: action
            }, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${global.apiuser2}`,
                }
            });

            return `Sukses ${action.toUpperCase()} Server`;
        } catch (error) {
            if (error.response && error.response.data.errors) {
                throw new Error(JSON.stringify(error.response.data.errors[0], null, 2));
            }
            throw new Error('Terjadi kesalahan: ' + util.format(error));
        }
    }
    async function deleteServer2(srv) {
    try {
        let response = await fetch(global.domain2 + "/api/application/servers/" + srv, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global.apiuser2,
            }
        });
        return response.ok ? { success: true } : await response.json();
    } catch (error) {
        throw new Error(error);
    }
}

async function deleteUser2(usr) {
    try {
        let response = await fetch(global.domain2 + "/api/application/users/" + usr, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + global.apiuser2,
            }
        });
        return response.ok ? { success: true } : await response.json();
    } catch (error) {
        throw new Error(error);
    }
}
module.exports = {   
    createUser2,
    createServer2,
    getEggStartupCommand2,
    manageServer2,
    deleteServer2,
    deleteUser2
};