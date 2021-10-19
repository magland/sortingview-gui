import ClientSidePlot from 'figurl/kachery-react/components/ClientSidePlot/ClientSidePlot'
import { CalculationPool } from 'figurl/kachery-react/createCalculationPool'
import sortingviewTaskFunctionIds from 'plugins/sortingview/sortingviewTaskFunctionIds'
import React, { FunctionComponent } from 'react'
import { Sorting } from "../../pluginInterface"
import Correlogram_rv from './Correlogram_ReactVis'


const AutocorrelogramSortingUnitView: FunctionComponent<{sorting: Sorting, unitId: number, calculationPool: CalculationPool}> = ({ sorting, unitId, calculationPool }) => {
    return (
        <ClientSidePlot
            dataFunctionName={sortingviewTaskFunctionIds.fetchCorrelogramPlotData}
            dataFunctionArgs={{
                sorting_object: sorting.sortingObject,
                unit_x: unitId,
                subsample: true
            }}
            boxSize={{
                width: 300,
                height: 300
            }}
            title="Autocorrelogram"
            PlotComponent={Correlogram_rv}
            plotComponentArgs={{ id: unitId }}
            calculationPool={calculationPool}
        />
    )
}

export default AutocorrelogramSortingUnitView