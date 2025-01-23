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



config.subscribe(value => {
    DB.set('config', value);
})

activeTab.subscribe(value => {
    DB.set('activeTab', value);
})