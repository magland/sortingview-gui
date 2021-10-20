import { LabboxViewPlugin } from ".";
import { CalculationPool } from "../commonComponents/ClientSidePlot/createCalculationPool";
import { Recording, RecordingInfo } from "./Recording";
import { RecordingSelection, RecordingSelectionDispatch } from "./RecordingSelection";

export interface RecordingViewProps {
    recording: Recording
    recordingInfo: RecordingInfo
    selection: RecordingSelection
    selectionDispatch: RecordingSelectionDispatch
    calculationPool?: CalculationPool
    width?: number
    height?: number
}

export interface RecordingViewPlugin extends LabboxViewPlugin {
    type: 'RecordingView'
    name: string
    label: string
    component: React.ComponentType<RecordingViewProps>
    icon?: any
    notebookCellHeight?: number
}
