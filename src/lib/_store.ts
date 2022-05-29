import { writable } from "svelte/store";
import type { Writable } from "svelte/store"


export const hashs: Writable<string[]> = writable(window.location.hash.slice(1).split("#"));
let hashsSub: Array<string> = [];
const hashsUnsubscriber = hashs.subscribe(hashs => {
    hashsSub = hashs;
})

function hashRouter(this: HTMLAnchorElement) {
    let tempHashsSub = hashsSub;
    const href = this.hash.slice(1);
    if (hashsSub.includes(href)) {
        tempHashsSub.splice(tempHashsSub.indexOf(href), 1);
    } else {
        if (tempHashsSub.length === 0 && tempHashsSub[0] === "#") {
            tempHashsSub = [href];
        } else {
            tempHashsSub.push(href);
        }
    }
    hashs.set(tempHashsSub);
}