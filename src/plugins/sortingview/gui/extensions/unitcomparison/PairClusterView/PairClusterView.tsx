import { usePureCalculationTask, TaskStatusView } from 'figurl';
import { applyMergesToUnit, Recording, Sorting, SortingCuration, SortingSelection, SortingSelectionDispatch } from 'plugins/sortingview/gui/pluginInterface';
import sortingviewTaskFunctionIds from '../../../../sortingviewTaskFunctionIds';
import React, { FunctionComponent } from 'react';
import { useMemo } from 'react';
import PairClusterWidget from './PairClusterWidget';

type Props = {
    recording: Recording
    sorting: Sorting
    selection: SortingSelection
    curation?: SortingCuration
    selectionDispatch: SortingSelectionDispatch
    unitIds: number[]
    snippetLen?: [number, number]
    width: number
    height: number
    sortingSelector?: string
}

type Result = {
    timepoints: number[]
    labels: number[]
    x: number[]
    y: number[]
}

// The X-axis is the discriminating direction (direction of line connecting the centroids of the two clusters)
// and the Y-axis is the first PCA component after collapsing the discriminating component.

const PairClusterView: FunctionComponent<Props> = ({recording, sorting, unitIds, selection, curation, snippetLen, width, height, sortingSelector}) => {
    const unitIdsX = useMemo(() => (unitIds.map(unitId => (applyMergesToUnit(unitId, curation, selection.applyMerges)))), [unitIds, curation, selection])
    const unitId1 = unitIdsX[0]
    const unitId2 = unitIdsX[1]
    const W = Math.min(width, height)
    const H = W
    const {returnValue: features, task} = usePureCalculationTask<Result>(
        sortingviewTaskFunctionIds.pairClusterFeatures,
        {
            recording_object: recording.recordingObject,
            sorting_object: sorting.sortingObject,
            unit_id1: unitId1,
            unit_id2: unitId2,
            snippet_len: snippetLen
        },
        {
        }
    )
    if (!features) {
        return <TaskStatusView
            {...{task, label: 'cluster features'}}
        />
    }
    return (
        <PairClusterWidget
            x={features.x}
            y={features.y}
            labels={features.labels}
            width={W}
            height={H}
        />
    )
}

export default PairClusterView