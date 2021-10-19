import { usePureCalculationTask, initiateTask, Task } from 'figurl';
import { useEffect, useRef, useState } from "react";
import sortingviewTaskFunctionIds from '../../sortingviewTaskFunctionIds';
import { Recording, RecordingInfo } from "../pluginInterface";

export const useRecordingInfo = (recordingUri: string): RecordingInfo | undefined => {
    const {returnValue: recordingInfo} = usePureCalculationTask<RecordingInfo>(recordingUri ? sortingviewTaskFunctionIds.recordingInfo : undefined, {recording_uri: recordingUri}, {})
    return recordingInfo
}

export const useRecordingInfos = (recordings: Recording[]): {[key: string]: RecordingInfo | null} => {
    const tasks = useRef<{[key: string]: Task<RecordingInfo> | null}>({})
    const [, setCount] = useState(0) // just for triggering update
    useEffect(() => {
        setCount(c => (c + 1))
    }, [recordings])
    const ret: {[key: string]: RecordingInfo | null} = {}
    recordings.forEach(r => {
        const rid = r.recordingId
        const t = tasks.current[rid]
        if (t === undefined) {
            const onStatusChanged = () => {
                const task = tasks.current[rid]
                if ((task) && (task.status === 'finished')) {
                    setCount(c => (c + 1))
                }
            }
            initiateTask<RecordingInfo>({functionId: sortingviewTaskFunctionIds.recordingInfo, kwargs: {recording_uri: r.recordingPath}, functionType: 'pure-calculation', onStatusChanged}).then(t => {
                tasks.current[rid] = t || null
            })
        }
        else if (t !== null) {
            if (t.status === 'finished') {
                if (t.result) {
                    ret[rid] = t.result
                }
            }
        }
    })
    return ret
}