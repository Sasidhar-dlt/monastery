const fs = require("fs");
const userid = require(`${APP_CONSTANTS.LIB_DIR}/userid.js`);

 
exports.doService = async jsonReq => {
   
    const userslist = await userid.getUserMatchingOnOrg(jsonReq.org);
    if(userslist.result&&userslist.users.length>0){
    const result = userslist.users.some(user=>user.user_id == jsonReq.id && user.role=="admin");
    if(!fs.existsSync(`${APP_CONSTANTS.CONF_DIR}/settings.json`)) fs.writeFileSync(`${APP_CONSTANTS.CONF_DIR}/settings.json`,JSON.stringify({}));
    const jsonData = fs.readFileSync(`${APP_CONSTANTS.CONF_DIR}/settings.json`, 'utf8');
    const data = JSON.parse(jsonData);
    if (data.hasOwnProperty(jsonReq.org) ) {
        const apiKey = data[jsonReq.org]["apikey"];
        const publicApikey = data[jsonReq.org]["publicapikey"];
      

        if(jsonReq.isPublic) data[jsonReq.org] = {server:jsonReq.server,port:jsonReq.port,package:"",publicapikey:jsonReq.apikey,apikey:apiKey,adminid:"",adminpassword:""};
        else data[jsonReq.org] = {server:jsonReq.server,port:jsonReq.port,package:jsonReq.package,apikey:jsonReq.apikey,publicapikey:publicApikey,adminid: jsonReq.adminid,adminpassword:jsonReq.adminpassword};
        fs.writeFileSync(`${APP_CONSTANTS.CONF_DIR}/settings.json`,JSON.stringify(data, null, 4))
        return { result:result };
    }
    else  return { result:false };
    }
 
}
