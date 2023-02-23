/* 
 * (C) 2015 TekMonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
const FRONTEND = "http://localhost:8080";
const BACKEND = "http://localhost:9090";
const APP_NAME = "monastery";
const APP_PATH = `${FRONTEND}/apps/${APP_NAME}`;
const API_PATH = `${BACKEND}/apps/${APP_NAME}`;
const COMPONENTS_PATH = `${FRONTEND}/apps/${APP_NAME}/components`;

export const APP_CONSTANTS = {
    FRONTEND, BACKEND, APP_PATH, APP_NAME,
    COMPONENTS_PATH: `${APP_PATH}/components`,
    MAIN_HTML: `${APP_PATH}/main.html`,
    HOME_HTML: `${APP_PATH}/home.html`,
    EXIT_HTML: `${APP_PATH}/exit.html`,
    LOGIN_HTML: `${APP_PATH}/login.html`,
    REGISTER_HTML: APP_PATH+"/register.html",
    LOGIN_ROOM_HTML: APP_PATH+"/loginroom.html",
    CHOOSER_HTML: `${APP_PATH}/chooser.html`,
    INDEX_HTML: `${APP_PATH}/index.html`,
    ERROR_HTML: APP_PATH+"/error.html",
    MANAGE_HTML: APP_PATH+"/manage.html",
    DEVELOPER_HTML: APP_PATH+"/developer.html",
    NOTAPPROVED_HTML: APP_PATH+"/notapproved.html",
    CONF_PATH: `${APP_PATH}/views/apiboss-designer/conf`,
    XFORGE_PATH: `${APP_PATH}/views/xforge-designer`,

    IMG_SRC: `${APP_PATH}/img`,


    DIALOGS_PATH: APP_PATH+"/dialogs",

    SESSION_NOTE_ID: "com_monkshu_ts",
    API_LIST_USER_APIS:`${BACKEND}/apps/apiboss/admin/listuserapis`,
    MSG_OBJECT_DRAGGED: "OBJECT_BEING_DRAGGED", 
    MSG_OBJECT_DROPPED: "OBJECT_DROPPED",
  // Login constants
    MIN_PASS_LENGTH: 8,
    API_LOGIN: API_PATH+"/login",
    API_RESET: API_PATH+"/resetuser",
    API_REGISTER: API_PATH+"/register",
    API_UPDATE: API_PATH+"/updateuser",
    API_STATUS: API_PATH+"/setstatus",
    API_CHANGEPW: API_PATH+"/changepassword",
    API_VALIDATE_TOTP: API_PATH+"/validatetotp",
    API_GETTOTPSEC: API_PATH+"/gettotpsec",
    API_GETPROFILE: API_PATH+"/getprofile",
    API_GETAPPCONFIG: API_PATH+"/getappconfig",
    API_GETMETADATA: API_PATH+"/getmetadata",
    API_RUNSCRIPT: API_PATH+"/runscript",

    API_CREATEORUPDATEMETA: API_PATH+"/createorupdatemeta",


    USERID: "userid",
    PWPH: "pwph",
    TIMEOUT: 600000,
    USERNAME: "username",
    API_PUBLISH:API_PATH+"/apis/api400publish",
    API_MODEL_OBJECT:API_PATH+"/apis/api400modelobject",
    USERORG: "userorg",
    BCRYPT_SALT: "$2a$10$VFyiln/PpFyZc.ABoi4ppf",
    PWPH: "pwph",
    USER_ROLE: "user",
    GUEST_ROLE: "guest",
    ADMIN_ROLE: "admin",
    PERMISSIONS_MAP: {
        user:[window.location.origin,APP_PATH+"/index.html", APP_PATH+"/login.html", APP_PATH+"/chooser.html", APP_PATH+"/main.html",APP_PATH+"/manage.html",APP_PATH+"/home.html", APP_PATH+"/exit.html",APP_PATH+"/register.html",APP_PATH+"/verify.html",APP_PATH+"/notapproved.html", APP_PATH+"/developer.html", APP_PATH+"/reset.html", APP_PATH+"/error.html",$$.MONKSHU_CONSTANTS.ERROR_HTML,"apiboss-designer"], 
        admin:[window.location.origin,APP_PATH+"/index.html", APP_PATH+"/login.html", APP_PATH+"/chooser.html", APP_PATH+"/main.html",APP_PATH+"/manage.html",APP_PATH+"/home.html", APP_PATH+"/exit.html",APP_PATH+"/register.html",APP_PATH+"/verify.html",APP_PATH+"/notapproved.html", APP_PATH+"/developer.html", APP_PATH+"/reset.html", APP_PATH+"/error.html",$$.MONKSHU_CONSTANTS.ERROR_HTML,"apiboss-designer"], 
        guest:[window.location.origin,APP_PATH+"/index.html", APP_PATH+"/login.html", APP_PATH+"/exit.html",APP_PATH+"/register.html",APP_PATH+"/notapproved.html",  APP_PATH+"/chooser.html",APP_PATH+"/home.html",APP_PATH+"/verify.html",APP_PATH+"/notapproved.html", $$.MONKSHU_CONSTANTS.ERROR_HTML],
        tekmonks:["*"],
        nus:["monkruls-designer",APP_PATH+"/register.html",APP_PATH+"/login.html", APP_PATH+"/chooser.html"]
    },

    API_KEYS: {"*":"fheiwu98237hjief8923ydewjidw834284hwqdnejwr79389"},
    KEY_HEADER: "X-API-Key"
}
