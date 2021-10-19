import Splitter from 'commonComponents/Splitter/Splitter';
import { ParcelSorting } from 'plugins/sortingview/ParcelExplorerPlugin/ParcelExplorerPlugin';
import React, { FunctionComponent } from 'react';
import { ParcelSortingSelection, ParcelSortingSelectionDispatch } from '../../ViewPlugin';
import MergeCandidatesTable from './MergeCandidatesTable';
import MergeCandidateView from './MergeCandidateView';

type Props = {
    parcelSorting: ParcelSorting
    parcelSortingSelection: ParcelSortingSelection,
    parcelSortingSelectionDispatch: ParcelSortingSelectionDispatch,
    featureRanges: {range: [number, number]}[]
    maxAmplitude: number
    width: number
    height: number
}

const MergeCandidatesView: FunctionComponent<Props> = ({parcelSorting, parcelSortingSelection, parcelSortingSelectionDispatch, featureRanges, maxAmplitude, width, height}) => {
    return (
        <div>
            <Splitter
                width={width}
                height={height}
                initialPosition={300}
            >
                <MergeCandidatesTable
                    parcelSorting={parcelSorting}
                    parcelSortingSelection={parcelSortingSelection}
                    parcelSortingSelectionDispatch={parcelSortingSelectionDispatch}
                    width={0} // filled in by splitter
                    height={0} // filled in by splitter
                />
                <MergeCandidateView
                    parcelSorting={parcelSorting}
                    parcelSortingSelection={parcelSortingSelection}
                    parcelSortingSelectionDispatch={parcelSortingSelectionDispatch}
                    featureRanges={featureRanges}
                    maxAmplitude={maxAmplitude}
                    width={0} // filled in by splitter
                    height={0} // filled in by splitter
                />
            </Splitter>
        </div>
    )
}

export default MergeCandidatesView