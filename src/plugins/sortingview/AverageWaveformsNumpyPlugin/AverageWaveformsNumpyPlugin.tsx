// import { FigurlPlugin } from "figurl/types";
import { isArrayOf, isNumber, _validateObject } from "commonInterface/kacheryTypes";
import { SortingSelection, sortingSelectionReducer } from "plugins/sortingview/gui/pluginInterface";
import React, { FunctionComponent, useReducer } from 'react';
import AverageWaveformsNumpyView from "./AverageWaveformsNumpyView";

export type Waveform = {
    unitId: number
    channelIds: number[]
    waveform: number[][]
}
const isWaveform = (x: any): x is Waveform => {
    return _validateObject(x, {
        unitId: isNumber,
        channelIds: isArrayOf(isNumber),
        waveform: () => (true)
    })
}

export type ElectrodeChannel = {
    channelId: number
    location: [number, number]
}
const isElectrodeChannel = (x: any): x is ElectrodeChannel => {
    return _validateObject(x, {
        channelId: isNumber,
        location: isArrayOf(isNumber)
    })
}

type AverageWaveformsNumpyData = {
    electrodeChannels: ElectrodeChannel[]
    waveforms: Waveform[]
}
const isAverageWaveformsNumpyData = (x: any): x is AverageWaveformsNumpyData => {
    return _validateObject(x, {
        electrodeChannels: isArrayOf(isElectrodeChannel),
        waveforms: isArrayOf(isWaveform)
    })
}

type Props = {
    data: AverageWaveformsNumpyData
    width: number
    height: number
}

const AverageWaveformsNumpyComponent: FunctionComponent<Props> = ({ data, width, height }) => {
    const { electrodeChannels, waveforms } = data

    const initialSortingSelection: SortingSelection = {}
    const [selection, selectionDispatch] = useReducer(sortingSelectionReducer, initialSortingSelection)

    return (
        <AverageWaveformsNumpyView
            electrodeChannels={electrodeChannels}
            waveforms={waveforms}
            noiseLevel={1} // fix
            selection={selection}
            selectionDispatch={selectionDispatch}
            width={width}
            height={height}
        />
    )
}

// const AverageWaveformsPlugin: FigurlPlugin = {
//     type: 'sortingview.average-waveforms-numpy.1',
//     validateData: isAverageWaveformsNumpyData,
//     component: AverageWaveformsNumpyComponent
// }

// export default AverageWaveformsPlugin