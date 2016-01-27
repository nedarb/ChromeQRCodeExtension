/// <reference path="../../typings/tsd.d.ts" />
'use strict';

class Management {
    static getSelf(): Promise<chrome.management.ExtensionInfo> {
        return new Promise<chrome.management.ExtensionInfo>(function(resolve) {
            chrome.management.getSelf(function(self) {
                resolve(self);
            });
        });
    }

    static getAll(): Promise<chrome.management.ExtensionInfo[]> {
        return new Promise<chrome.management.ExtensionInfo[]>(resolve => {
            chrome.management.getAll(function(all) {
                console.log('Got extensions/apps:', arguments);
                resolve(all);
            });
        });
    }
}

class Tabs {
    static getCurrent() : Promise<chrome.tabs.Tab> {
        return new Promise<chrome.tabs.Tab>(r=> {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs=>{
                r(tabs && tabs.length ? tabs[0] : null);
            });
        });
    }
}