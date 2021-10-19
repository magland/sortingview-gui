import { isTaskFunctionId, isTaskFunctionType, isTaskId, isTaskStatus, TaskFunctionId, TaskFunctionType, TaskId, TaskStatus } from "commonInterface/kacheryTypes"
import validateObject, { isBoolean, isEqualTo, isOneOf } from "./validateObject"

// getFigureData

export type GetFigureDataRequest = {
    type: 'getFigureData'
}

export const isGetFigureDataRequest = (x: any): x is GetFigureDataRequest => {
    return validateObject(x, {
        type: isEqualTo('getFigureData')
    })
}

export type GetFigureDataResponse = {
    type: 'getFigureData'
    figureData: any
}

export const isGetFigureDataResponse = (x: any): x is GetFigureDataResponse => {
    return validateObject(x, {
        type: isEqualTo('getFigureData'),
        figureData: () => (true)
    })
}

// initiateTask

export type InitiateTaskRequest = {
    type: 'initiateTask'
    functionId: TaskFunctionId
    kwargs: {[key: string]: any}
    functionType: TaskFunctionType
    queryUseCache: boolean
    queryFallbackToCache: boolean
}

export const isInitiateTaskRequest = (x: any): x is InitiateTaskRequest => {
    return validateObject(x, {
        type: isEqualTo('initiateTask'),
        functionId: isTaskFunctionId,
        kwargs: () => (true),
        functionType: isTaskFunctionType,
        queryUseCache: isBoolean,
        queryFallbackToCache: isBoolean
    })
}

export type InitiateTaskResponse = {
    type: 'initiateTask'
    taskId: TaskId
    taskStatus: TaskStatus
}

export const isInitiateTaskResponse = (x: any): x is InitiateTaskResponse => {
    return validateObject(x, {
        type: isEqualTo('initiateTask'),
        taskId: isTaskId,
        taskStatus: isTaskStatus
    })
}

//////////////////////////////////////////////////////////////

export type FigurlRequest =
    GetFigureDataRequest |
    InitiateTaskRequest

export const isFigurlRequest = (x: any): x is FigurlRequest => {
    return isOneOf([
        isGetFigureDataRequest,
        isInitiateTaskRequest
    ])(x)
}

export type FigurlResponse =
    GetFigureDataResponse |
    InitiateTaskResponse

export const isFigurlResponse = (x: any): x is FigurlResponse => {
    return isOneOf([
        isGetFigureDataResponse,
        isInitiateTaskResponse
    ])(x)
}