import { writable } from 'svelte/store';
import { DB } from '../db/db';
import { ExtensionManager } from "../extension";
import { defaulConfig } from '../config';

/**
 * @typedef {import('../config').Config}
 *
 */
export let details = writable({ package: '', url: '' });
export let searchQuery = writable(''); 

export let activeTab = writable(DB.get('activeTab') || 'code');

/**
 * @type {import('svelte/store').Writable<import('../config').Config>}
 */
export let config = writable(DB.get('config') || defaulConfig);


let oldCode = DB.get('code') || '';

export let code = writable(oldCode);

export let jsonStore = writable('');


export const manager = writable(new ExtensionManager());


export const alert = writable({ type: '', content: '', show: false });

export const eventStore = writable({ type: '', data: null });


/**
 * A writable store that holds an array of console log entries.
 * Each entry is an object with { message, level, timestamp }.
 * @type {import('svelte/store').Writable<{ args: any[], level: 'log' | 'info' | 'warn' | 'error', timestamp: Date }[]>}
 */
export const consoleLogStore = writable([]);



config.subscribe(value => {
    DB.set('config', value);
})

activeTab.subscribe(value => {
    DB.set('activeTab', value);
})