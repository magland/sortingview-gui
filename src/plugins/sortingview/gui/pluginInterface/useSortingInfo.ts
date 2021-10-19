import { initiateTask, Task } from "figurl";
import {usePureCalculationTask} from "figurl";
import { useEffect, useRef, useState } from "react";
import sortingviewTaskFunctionIds from "../../sortingviewTaskFunctionIds";
import { Sorting, SortingInfo } from "./Sorting";

export const useSortingInfo = (sortingUri: string | undefined): SortingInfo | undefined => {
    const {returnValue: sortingInfo} = usePureCalculationTask<SortingInfo>(sortingUri ? sortingviewTaskFunctionIds.sortingInfo : undefined, {sorting_uri: sortingUri}, {})
    return sortingInfo
}

export const useSortingInfos = (sortings: Sorting[]): {[key: string]: SortingInfo | null} => {
    const tasks = useRef<{[key: string]: Task<SortingInfo> | null}>({})
    const [, setCount] = useState(0) // just for triggering update
    useEffect(() => {
        setCount(c => (c + 1))
    }, [sortings])
    const ret: {[key: string]: SortingInfo | null} = {}
    sortings.forEach(s => {
        const sid = s.sortingId
        const t = tasks.current[sid]
        if (t === undefined) {
            const onStatusChanged = () => {
                const task = tasks.current[sid]
                if ((task) && (task.status === 'finished')) {
                    setCount(c => (c + 1))
                }
            }
            initiateTask<SortingInfo>({functionId: sortingviewTaskFunctionIds.sortingInfo, kwargs: {sorting_uri: s.sortingPath}, functionType: 'pure-calculation', onStatusChanged}).then(t => {
                tasks.current[sid] = t || null
            })
        }
        else if (t !== null) {
            if (t.status === 'finished') {
                if (t.result) {
                    ret[sid] = t.result
                }
            }
        }
    })
    return ret
}