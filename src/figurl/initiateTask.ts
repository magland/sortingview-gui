import { errorMessage, ErrorMessage, TaskFunctionId, TaskFunctionType, TaskId, TaskKwargs, TaskStatus } from "commonInterface/kacheryTypes";
import { InitiateTaskRequest, isInitiateTaskResponse } from "./viewInterface/FigurlRequestTypes";
import sendRequestToParent from "./viewInterface/sendRequestToParent";

const allTasks: {[key: string]: Task<any>} = {}

export class Task<ReturnType> {
    #onStatusChangedCallbacks: (() => void)[] = []
    #taskId: TaskId
    #status: TaskStatus
    #errorMessage: ErrorMessage = errorMessage('')
    #result: ReturnType | undefined = undefined
    constructor(a: {taskId: TaskId, taskStatus: TaskStatus}) {
        this.#taskId = a.taskId
        this.#status = a.taskStatus
    }
    onStatusChanged(cb: () => void) {
        this.#onStatusChangedCallbacks.push(cb)
    }
    public get status() {
        return this.#status
    }
    public get errorMessage() {
        return this.#errorMessage
    }
    public get result() {
        return this.#result
    }
}

const initiateTask = async <ReturnType>(args: {functionId: TaskFunctionId | string | undefined, kwargs: TaskKwargs | {[key: string]: any}, functionType: TaskFunctionType, onStatusChanged: () => void, queryUseCache?: boolean, queryFallbackToCache?: boolean}) => {
    const { functionId, kwargs, functionType, onStatusChanged, queryUseCache, queryFallbackToCache } = args
    if (!functionId) return undefined

    const req: InitiateTaskRequest = {
        type: 'initiateTask',
        functionId: functionId as TaskFunctionId,
        kwargs,
        functionType,
        queryUseCache: queryUseCache || false,
        queryFallbackToCache: queryFallbackToCache || false
    }
    const resp = await sendRequestToParent(req)
    if (!isInitiateTaskResponse(resp)) throw Error('Unexpected response to initiateTask')

    const {taskId, taskStatus} = resp

    let t: Task<ReturnType>
    if (taskId.toString() in allTasks) {
        t = allTasks[taskId.toString()]
    }
    else {
        t = new Task<ReturnType>({taskId, taskStatus})
        allTasks[taskId.toString()] = t
    }
    t.onStatusChanged(onStatusChanged)
    return t
}

export default initiateTask