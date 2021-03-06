import { Button, Checkbox, Grid, Paper } from '@material-ui/core';
import React, { FunctionComponent, useCallback, useMemo } from 'react';
import sizeMe, { SizeMeProps } from 'react-sizeme';
import { SortingCuration, SortingSelection, SortingSelectionDispatch } from '../../../pluginInterface';
import { SortingCurationAction } from '../../../pluginInterface/SortingCuration';

type Props = {
    sortingId: string
    curation?: SortingCuration
    curationDispatch: (a: SortingCurationAction) => void
    selection: SortingSelection
    selectionDispatch: SortingSelectionDispatch
}

// const buttonStyle = {
//     paddingTop: 3, paddingBottom: 3, border: 1, borderStyle: 'solid', borderColor: 'gray'
// }

const buttonStyle = {}

const CurationControl: FunctionComponent<Props & SizeMeProps> = ({ selection, selectionDispatch, curation, curationDispatch, size }) => {
    const width = size.width || 300
    const selectedUnitIds = useMemo(() => (selection.selectedUnitIds || []), [selection.selectedUnitIds])
    const _handleApplyLabel = useCallback(
        (label: string) => {
            curationDispatch({
                type: 'ADD_UNIT_LABEL',
                unitId: selectedUnitIds,
                label
            })
        },
        [curationDispatch, selectedUnitIds],
    )

    const _handleRemoveLabel = useCallback(
        (label: string) => {
            curationDispatch({
                type: 'REMOVE_UNIT_LABEL',
                unitId: selectedUnitIds,
                label
            })
        },
        [curationDispatch, selectedUnitIds]
    )

    const handleMergeSelected = useCallback(() => {
        curationDispatch({
            type: 'MERGE_UNITS',
            unitIds: selectedUnitIds
        })
        selectionDispatch({
            type: 'SetSelectedUnitIds', selectedUnitIds: []
        })
    }, [curationDispatch, selectedUnitIds, selectionDispatch])

    const handleUnmergeSelected = useCallback(() => {
        curationDispatch({
            type: 'UNMERGE_UNITS',
            unitIds: selectedUnitIds
        })
        selectionDispatch({
            type: 'SetSelectedUnitIds', selectedUnitIds: []
        })
    }, [curationDispatch, selectedUnitIds, selectionDispatch])

    const handleToggleCurationClosed = useCallback(() => {
        const type = curation?.isClosed ? 'REOPEN_CURATION' : 'CLOSE_CURATION'
        curationDispatch({
            type: type
        })
    }, [curation?.isClosed, curationDispatch])

    const handleToggleApplyMerges = useCallback(() => {
        selectionDispatch({type: 'ToggleApplyMerges', curation})
    }, [selectionDispatch, curation])

    type LabelRecord = {
        label: string,
        partial: boolean
    }

    const labelCounts: {[key: string]: number} = {}
    for (const uid of selectedUnitIds) {
        const labels = (curation?.labelsByUnit || {})[uid + ''] || []
        for (const label of labels) {
            let c = labelCounts[label] || 0
            c ++
            labelCounts[label] = c
        }
    }
    const labels = Object.keys(labelCounts).sort()
    const labelRecords: LabelRecord[] = labels.map(label => ({
        label,
        partial: labelCounts[label] < selectedUnitIds.length ? true : false
    }))
    const paperStyle: React.CSSProperties = {
        marginTop: 25,
        marginBottom: 25,
        backgroundColor: '#f9f9ff'
    }
    const unitsAreInMergeGroups = (unitIds: number[]) => {
        const mg = curation?.mergeGroups || []
        const all = mg.reduce((prev, g) => [...prev, ...g], []) // all units in merge groups
        for (let unitId of unitIds) {
            if (!all.includes(unitId)) return false
        }
        return true
    }
    const enableApply = selectedUnitIds.length > 0
    const standardChoices = ['accept', 'reject', 'noise', 'artifact', 'mua']
    const labelChoices = [...standardChoices, ...(curation?.labelChoices || []).filter(l => (!standardChoices.includes(l)))]
    return (
        <div style={{width, position: 'relative'}}>
            <Paper style={paperStyle} key="selected">
                Selected units: {selectedUnitIds.join(', ')}
            </Paper>
            <Paper style={paperStyle} key="labels">
                Labels:
                <Grid container style={{flexFlow: 'wrap'}} spacing={0}>
                    {
                        labelRecords.map(r => (
                            <Grid item key={r.label}>
                                <Label
                                    label={r.label}
                                    partial={r.partial}
                                    onClick={() => {r.partial ? _handleApplyLabel(r.label) : _handleRemoveLabel(r.label)}}
                                    disabled={curation?.isClosed}
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            </Paper>
            <Paper style={paperStyle} key="apply">
                Apply labels:
                <Grid container style={{flexFlow: 'wrap'}} spacing={0}>
                    {
                        labelChoices.map(labelChoice => (
                            <Grid item key={labelChoice}>
                                {
                                    (((labelCounts[labelChoice] || 0) < selectedUnitIds.length) || (!enableApply)) ? (
                                        <button
                                            style={buttonStyle}
                                            disabled={!enableApply || (curation?.isClosed)}
                                            onClick={() => {_handleApplyLabel(labelChoice)}}
                                        >
                                            {labelChoice}
                                        </button>
                                    ): <span />
                                }
                            </Grid>
                        ))
                    }
                </Grid>
            </Paper>
            <Paper style={paperStyle} key="merge">                
                Merge:
                {
                    (selectedUnitIds.length >= 2 && !unitsAreInMergeGroups(selectedUnitIds)) &&
                        <button key="merge" onClick={handleMergeSelected} disabled={curation?.isClosed}>
                            Merge selected units: {selectedUnitIds.join(', ')}
                        </button>
                }
                {
                    (selectedUnitIds.length > 0 && unitsAreInMergeGroups(selectedUnitIds)) &&
                        <button key="unmerge" onClick={handleUnmergeSelected} disabled={curation?.isClosed}>
                            Unmerge units: {selectedUnitIds.join(', ')}
                        </button>
                }
                <span style={{whiteSpace: 'nowrap'}}>
                    <Checkbox checked={selection.applyMerges || false} onClick={handleToggleApplyMerges}/> Apply merges
                </span>
            </Paper>
            <Button
                color={ curation?.isClosed ? "primary" : "secondary" }
                variant={"contained"}
                onClick={() => {handleToggleCurationClosed()}}>
                { curation?.isClosed ? 'Re-open curation' : 'Curation complete' }
            </Button>
        </div>
    )
}

const Label: FunctionComponent<{label: string, partial: boolean, onClick: () => void, disabled?: boolean}> = ({label, partial, onClick, disabled}) => {
    const color = (disabled) ? '' : (partial) ? 'gray': 'black'
    return (
        <button style={{...buttonStyle, color}} disabled={disabled} onClick={onClick}>{label}</button>
    )
}

export default sizeMe()(CurationControl)