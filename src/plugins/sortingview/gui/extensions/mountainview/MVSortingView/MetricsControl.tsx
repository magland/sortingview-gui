import useVisible from 'commonComponents/useVisible';
import Hyperlink from 'commonComponents/Hyperlink/Hyperlink';
import MarkdownDialog from 'commonComponents/Markdown/MarkdownDialog';
import React, { FunctionComponent } from 'react';
import setExternalMetricsMd from './setExternalMetrics.md.gen';

type Props = {
    workspaceUri?: string
    sortingId?: string
}

const MetricsControl: FunctionComponent<Props> = ({workspaceUri, sortingId}) => {
    const setExternalMetricsVisibility = useVisible()
    return (
        <div>
            <Hyperlink onClick={setExternalMetricsVisibility.show}>Set external unit metrics for this sorting</Hyperlink>
            <MarkdownDialog
                source={setExternalMetricsMd}
                visible={setExternalMetricsVisibility.visible}
                onClose={setExternalMetricsVisibility.hide}
                substitute={{
                    'WORKSPACE_URI': workspaceUri,
                    'SORTING_ID': sortingId
                }}
            />
        </div>
    )
}

export default MetricsControl