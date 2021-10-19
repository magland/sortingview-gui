import { FeedId, messageCount, sha1OfString, SubfeedHash, SubfeedMessage, subfeedPosition, unscaledDurationMsec } from "commonInterface/kacheryTypes";
import { sleepMsec } from "commonInterface/util";
import { useEffect, useState } from "react";

export const parseSubfeedUri = (subfeedUri: string) => {
    const a = subfeedUri.split('/')
    const feedId = a[2] as any as FeedId
    let subfeedHash: SubfeedHash
    if (a[3].startsWith('~')) {
        subfeedHash = a[3].slice(1) as any as SubfeedHash
    }
    else {
        subfeedHash = sha1OfString(a[3]) as any as SubfeedHash
    }
    return {feedId, subfeedHash}
}

class Subfeed {

}

const useSubfeed = (args: {feedId?: FeedId, subfeedHash?: SubfeedHash, subfeedUri?: string}): {messages: SubfeedMessage[] | undefined, subfeed: Subfeed | undefined} => {
    let {feedId, subfeedHash, subfeedUri} = args
    if (subfeedUri) {
        if ((feedId) || (subfeedHash)) {
            throw Error('useSubfeed: Cannot specify both subfeedUri and feedId/subfeedHash')
        }
        const {feedId: fid, subfeedHash: sfh} = parseSubfeedUri(subfeedUri)
        feedId = fid
        subfeedHash = sfh
    }
    const [messages, setMessages] = useState<SubfeedMessage[] | undefined>(undefined)
    const [subfeed, setSubfeed] = useState<Subfeed | undefined>(undefined)

    // todo

    return {messages, subfeed}
}

export default useSubfeed