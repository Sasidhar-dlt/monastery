/* 
 * (C) 2020 TekMonks. All rights reserved.
 */
const path = require("path");
const fspromises = require("fs").promises;
const cms = require(`${API_CONSTANTS.LIB_DIR}/cms.js`);
const quotas = require(`${API_CONSTANTS.LIB_DIR}/quotas.js`);

exports.doService = async (jsonReq, _servObject, headers, _url) => {
	if (!validateRequest(jsonReq)) {LOG.error("Validation failure."); return CONSTANTS.FALSE_RESULT;}
	
	LOG.debug("Got uploadfile request for path: " + jsonReq.path);

	const fullpath = path.resolve(`${await cms.getCMSRoot(headers)}/${jsonReq.path}`);
	if (!await cms.isSecure(headers, fullpath)) {LOG.error(`Path security validation failure: ${jsonReq.path}`); return CONSTANTS.FALSE_RESULT;}

	try {
        const matches = jsonReq.data.match(/^data:.*;base64,(.*)$/); 
        if (!matches) throw `Bad data encoding: ${jsonReq.data}`;
		const bufferToWrite = Buffer.from(matches[1], "base64");
		if (!(await quotas.checkQuota(headers, bufferToWrite.length)).result) throw ("Quota is full write failed.");
        await fspromises.appendFile(fullpath, bufferToWrite); 
        return CONSTANTS.TRUE_RESULT;
	} catch (err) {
		LOG.error(`Error writing to path: ${fullpath}, error is: ${err}`); 
		try {await fspromises.unlink(fullpath)} catch(err) {};
		return CONSTANTS.FALSE_RESULT;
	}
}

const validateRequest = jsonReq => (jsonReq && jsonReq.path && jsonReq.data);