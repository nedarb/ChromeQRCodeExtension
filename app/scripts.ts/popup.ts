/// <reference path="management.ts" />
/// <reference path="../../typings/qrcode.d.ts" />
'use strict';

async function startup() {
    var currenTab = await Tabs.getCurrent();
    var dest = document.getElementById("qrcode");
    var size = 200;
    dest.style.width = dest.style.height = size + 'px';

    if (currenTab) {
        new QRCode(dest, { text: currenTab.url, width: size, height: size });
    } else {
        dest.innerText = "N/A";
    }
}

startup();