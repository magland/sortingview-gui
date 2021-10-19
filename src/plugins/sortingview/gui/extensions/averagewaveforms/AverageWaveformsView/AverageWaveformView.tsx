// import { createCalculationPool } from 'labbox';
import { TaskStatusView, usePureCalculationTask } from 'figurl'
import sortingviewTaskFunctionIds from 'plugins/sortingview/sortingviewTaskFunctionIds'
import React, { FunctionComponent, useMemo } from 'react'
import { applyMergesToUnit, Recording, Sorting, SortingCuration, SortingSelectionDispatch } from '../../../pluginInterface'
import { ElectrodeOpts } from '../../common/sharedCanvasLayers/electrodesLayer'
import { AverageWaveformAction } from './AverageWaveformsView'
import WaveformWidget, { defaultWaveformOpts } from './WaveformWidget'


export type PlotData = {
    average_waveform: number[][]
    channel_ids: number[]
    channel_locations: number[][]
    sampling_frequency: number
}

type Props = {
    sorting: Sorting
    recording: Recording
    unitId: number
    selectionDispatch: SortingSelectionDispatch
    curation?: SortingCuration
    width: number
    height: number
    noiseLevel: number
    customActions?: AverageWaveformAction[]
    snippetLen?: [number, number]
    visibleElectrodeIds?: number[]
    selectedElectrodeIds?: number[]
    ampScaleFactor?: number
    applyMerges?: boolean
    waveformsMode?: 'geom' | 'vertical'
}

// const calculationPool = createCalculationPool({maxSimultaneous: 6})

const AverageWaveformView: FunctionComponent<Props> = ({ sorting, curation, recording, unitId, selectionDispatch, width, height, noiseLevel, customActions, snippetLen, visibleElectrodeIds, selectedElectrodeIds, ampScaleFactor, applyMerges, waveformsMode }) => {

    const electrodeOpts: ElectrodeOpts = useMemo(() => ({
        showLabels: true,
        offsetLabels: true
    }), [])

    const {returnValue: plotData, task} = usePureCalculationTask<PlotData>(
        sortingviewTaskFunctionIds.fetchAverageWaveform,
        {
            sorting_object: sorting.sortingObject,
            recording_object: recording.recordingObject,
            unit_id: applyMergesToUnit(unitId, curation, applyMerges),
            snippet_len: snippetLen
        },
        {
        }
    )

    const definedPlotData = plotData || { channel_ids: [], channel_locations: [], average_waveform: [], sampling_frequency: 1 }

    const electrodeIds = useMemo(() => {
        return visibleElectrodeIds && visibleElectrodeIds.length > 0
            ? definedPlotData.channel_ids.filter(id => (visibleElectrodeIds.includes(id)))
            : definedPlotData.channel_ids
    }, [visibleElectrodeIds, definedPlotData.channel_ids])
    const electrodeLocations = useMemo(() => {
        return visibleElectrodeIds && visibleElectrodeIds.length > 0
            ? definedPlotData.channel_locations.filter((loc, ii) => (visibleElectrodeIds.includes(definedPlotData.channel_ids[ii])))
            : definedPlotData.channel_locations
    }, [visibleElectrodeIds, definedPlotData.channel_ids, definedPlotData.channel_locations])

    return plotData
        ? <WaveformWidget
            waveform={definedPlotData.average_waveform}
            layoutMode={waveformsMode || 'geom'}
            noiseLevel={noiseLevel}
            electrodeIds={electrodeIds}
            electrodeLocations={electrodeLocations}
            samplingFrequency={definedPlotData.sampling_frequency}
            width={width}
            height={height}
            selectedElectrodeIds={selectedElectrodeIds || []}
            ampScaleFactor={ampScaleFactor || 1}
            customActions={customActions}
            selectionDispatch={selectionDispatch}
            electrodeOpts={electrodeOpts}
            waveformOpts={defaultWaveformOpts}
        />
        : <TaskStatusView task={task} label="fetch avg waveform" />
}

export default AverageWaveformView