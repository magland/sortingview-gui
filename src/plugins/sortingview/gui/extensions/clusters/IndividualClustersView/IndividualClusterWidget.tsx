import React, { FunctionComponent, useMemo } from 'react';
import CanvasWidget from 'commonComponents/CanvasWidget';
import { useLayer, useLayers } from 'commonComponents/CanvasWidget/CanvasWidgetLayer';
import { RectangularRegion } from 'commonComponents/CanvasWidget/Geometry';
import { getArrayMax, getArrayMin } from '../../common/utility';
import createClusterLayer, { ClusterLayerProps } from './clusterLayer';

type Props = {
    x: number[]
    y: number[]
    width: number
    height: number
    selectedIndex?: number
    onSelectedIndexChanged?: (i: number | undefined) => void
}

const IndividualClusterWidget: FunctionComponent<Props> = ({ x, y, width, height, selectedIndex, onSelectedIndexChanged }) => {
    const layerProps = useMemo((): ClusterLayerProps => {
        const xmin = getArrayMin(x)
        const xmax = getArrayMax(x)
        const ymin = getArrayMin(y)
        const ymax = getArrayMax(y)
        const rect: RectangularRegion = {xmin, xmax, ymin, ymax}
        return {
            x,
            y,
            rect,
            width,
            height,
            selectedIndex,
            onSelectedIndexChanged
        }
    }, [x, y, width, height, onSelectedIndexChanged, selectedIndex])
    const clusterLayer = useLayer(createClusterLayer, layerProps)
    const layers = useLayers([clusterLayer])
    return (
        <CanvasWidget
            layers={layers}
            {...{width, height}}
        />
    )
}

export default IndividualClusterWidget