import sortingviewTaskFunctionIds from 'plugins/sortingview/sortingviewTaskFunctionIds';
import React from 'react';
import { SortingUnitMetricPlugin } from "../../../../pluginInterface";

const EventCount = (record: any) => {
    return (
        <span>{record !== undefined ? record.count: ''}</span>
    );
}

const plugin: SortingUnitMetricPlugin = {
    type: 'SortingUnitMetric',
    name: 'EventCount',
    label: 'Num. events',
    columnLabel: 'Num. events',
    tooltip: 'Number of firing events',
    hitherFnName: sortingviewTaskFunctionIds.getFiringData,
    metricFnParams: {},
    hitherOpts: {
        useClientCache: true
    },
    component: EventCount,
    isNumeric: true,
    getValue: (record: any) => record.count
}

export default plugin