import { IconButton } from '@material-ui/core'
import { Help } from '@material-ui/icons'
import useVisible from 'commonComponents/useVisible'
import MarkdownDialog from 'commonComponents/Markdown/MarkdownDialog'
import Splitter from 'commonComponents/Splitter/Splitter'
import { useRecordingInfo } from 'plugins/sortingview/gui/pluginInterface/useRecordingInfo'
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaRegTimesCircle } from 'react-icons/fa'
import SortingUnitPlotGrid from '../../../commonComponents/SortingUnitPlotGrid/SortingUnitPlotGrid'
import info from '../../../helpPages/AverageWaveforms.md.gen'
import { SortingViewProps } from '../../../pluginInterface'
import { ActionItem, CheckboxItem, DividerItem, TextItem } from '../../common/Toolbars'
import ViewToolbar from '../../common/ViewToolbar'
import AverageWaveformView from './AverageWaveformView'


export type AverageWaveformAction = ActionItem  | CheckboxItem | DividerItem | TextItem

const TOOLBAR_INITIAL_WIDTH = 36 // hard-coded for now

const AverageWaveformsView: FunctionComponent<SortingViewProps> = (props) => {
    const {recording, sorting, curation, selection, selectionDispatch, width=600, height=650, snippetLen, sortingSelector} = props
    const recordingInfo = useRecordingInfo(recording.recordingPath)
    const boxHeight = 250
    const boxWidth = 180
    const noiseLevel = (recordingInfo || {}).noise_level || 1  // fix this
    const [scalingActions, setScalingActions] = useState<AverageWaveformAction[] | null>(null)

    const visibleElectrodeIds = useMemo(() => (selection.visibleElectrodeIds), [selection.visibleElectrodeIds])
    const selectedElectrodeIds = useMemo(() => (selection.selectedElectrodeIds || []), [selection.selectedElectrodeIds])
    const ampScaleFactor = useMemo(() => (selection.ampScaleFactor || 1), [selection.ampScaleFactor])
    const applyMerges = useMemo(() => (selection.applyMerges || false), [selection.applyMerges])
    const waveformsMode = useMemo(() => (selection.waveformsMode || 'geom'), [selection.waveformsMode])

    const unitComponent = useMemo(() => (unitId: number) => (
            <AverageWaveformView
                {...{sorting, curation, recording, unitId, selectionDispatch}}
                selectionDispatch={selectionDispatch}
                width={boxWidth}
                height={boxHeight}
                noiseLevel={noiseLevel}
                customActions={scalingActions || []}
                snippetLen={snippetLen}
                visibleElectrodeIds={visibleElectrodeIds}
                selectedElectrodeIds={selectedElectrodeIds}
                ampScaleFactor={ampScaleFactor}
                applyMerges={applyMerges}
                waveformsMode={waveformsMode}
            />
    ), [sorting, recording, selectionDispatch, noiseLevel, scalingActions, curation, snippetLen, visibleElectrodeIds, selectedElectrodeIds, ampScaleFactor, applyMerges, waveformsMode])

    const _handleWaveformToggle = useCallback(() => {
        selectionDispatch({type: 'ToggleWaveformsMode', waveformsMode: waveformsMode})
    }, [selectionDispatch, waveformsMode])

    const _handleScaleAmplitudeUp = useCallback(() => {
        selectionDispatch({type: 'ScaleAmpScaleFactor', direction: 'up'})
    }, [selectionDispatch])
    const _handleScaleAmplitudeDown = useCallback(() => {
        selectionDispatch({type: 'ScaleAmpScaleFactor', direction: 'down'})
    }, [selectionDispatch])
    const _handleResetAmplitude = useCallback(() => {
        selectionDispatch({type: 'SetAmpScaleFactor', ampScaleFactor: 1})
    }, [selectionDispatch])

    useEffect(() => {
        const actions: AverageWaveformAction[] = [
            {
                type: 'button',
                callback: _handleScaleAmplitudeUp,
                title: 'Scale amplitude up [up arrow]',
                icon: <FaArrowUp />,
                keyCode: 38
            },
            {
                type: 'button',
                callback: _handleResetAmplitude,
                title: 'Reset scale amplitude',
                icon: <FaRegTimesCircle />
            },
            {
                type: 'button',
                callback: _handleScaleAmplitudeDown,
                title: 'Scale amplitude down [down arrow]',
                icon: <FaArrowDown />,
                keyCode: 40
            },
            {
                type: 'text',
                title: 'Zoom level',
                content: ampScaleFactor,
                contentSigFigs: 2
            },
            {
                type: 'divider'
            },
            {
                type: 'checkbox',
                callback: _handleWaveformToggle,
                title: waveformsMode === 'geom' ? 'Hide electrode geometry' : 'Show electrode geometry',
                selected: waveformsMode === 'geom'
            }
        ]
        setScalingActions(actions)
    }, [_handleScaleAmplitudeUp, ampScaleFactor, _handleScaleAmplitudeDown, _handleResetAmplitude, _handleWaveformToggle, waveformsMode])

    const infoVisible = useVisible()

    return width ? (
        <div>
            <Splitter
                width={width}
                height={height}
                initialPosition={TOOLBAR_INITIAL_WIDTH}
                adjustable={false}
            >
                {
                    <ViewToolbar
                        width={TOOLBAR_INITIAL_WIDTH}
                        height={height}
                        customActions={scalingActions}
                    />
                }
                {
                    <div>
                        <div>
                            <IconButton onClick={infoVisible.show}><Help /></IconButton>
                        </div>
                        <SortingUnitPlotGrid
                            sorting={sorting}
                            selection={selection}
                            curation={curation}
                            selectionDispatch={selectionDispatch}
                            unitComponent={unitComponent}
                            sortingSelector={sortingSelector}
                        />
                        <MarkdownDialog
                            visible={infoVisible.visible}
                            onClose={infoVisible.hide}
                            source={info}
                        />
                    </div>
                }
            </Splitter>
        </div>
    )
    : (<div>No width</div>);
}

export default AverageWaveformsView