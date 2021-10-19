// import { createCalculationPool } from 'labbox';
import { usePureCalculationTask, TaskStatusView } from 'figurl';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import sortingviewTaskFunctionIds from '../../../../sortingviewTaskFunctionIds';
import { applyMergesToUnit, Recording, Sorting, SortingCuration, SortingSelection, SortingSelectionDispatch } from "../../../pluginInterface";
import IndividualClusterWidget from './IndividualClusterWidget';

type Props = {
    recording: Recording
    sorting: Sorting
    curation?: SortingCuration
    selection: SortingSelection
    selectionDispatch: SortingSelectionDispatch
    unitId: number
    width: number
    height: number
    snippetLen?: [number, number]
}

// const calculationPool = createCalculationPool({maxSimultaneous: 6})

type Result = {
    timepoints: number[]
    x: number[]
    y: number[]
}

const IndividualClusterView: FunctionComponent<Props> = ({ recording, sorting, curation, selection, selectionDispatch, unitId, width, height, snippetLen }) => {
    const {returnValue: features, task} = usePureCalculationTask<Result>(
        sortingviewTaskFunctionIds.individualClusterFeatures,
        {
            recording_object: recording.recordingObject,
            sorting_object: sorting.sortingObject,
            unit_id: applyMergesToUnit(unitId, curation, selection.applyMerges),
            snippet_len: snippetLen
        },
        {
        }
    )
    const selectedIndex: number | undefined = useMemo(() => {
        const t = selection.currentTimepoint
        if (t === undefined) return undefined
        if (features === undefined) return undefined
        for (let i = 0; i < features.timepoints.length; i++) {
            if (Math.abs(features.timepoints[i] - t) < 20) {
                return i
            }
        }
    }, [features, selection])
    const handleSelectedIndexChanged = useCallback((i: number | undefined) => {
        if (i === undefined) return
        if (features === undefined) return
        const t = features.timepoints[i]
        if (t === undefined) return
        selectionDispatch({type: 'SetCurrentTimepoint', currentTimepoint: t, ensureInRange: true})
    }, [features, selectionDispatch])
    if (!features) {
        return <TaskStatusView
            {...{task, label: 'cluster features'}}
        />
    }
    return (
        <IndividualClusterWidget
            x={features.x}
            y={features.y}
            {...{width, height, selectedIndex}}
            onSelectedIndexChanged={handleSelectedIndexChanged}
        />
    )
}

export default IndividualClusterView