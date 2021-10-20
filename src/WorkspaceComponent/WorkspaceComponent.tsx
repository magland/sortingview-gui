import MountainViewSetup from "plugins/sortingview/gui/extensions/MountainViewSetup"
import WorkspaceView from "plugins/sortingview/gui/extensions/workspaceview/WorkspaceView"
import { WorkspaceRouteAction, workspaceRouteReducer, WorkspaceRoute } from "plugins/sortingview/gui/pluginInterface/WorkspaceRoute"
import { useSortingViewWorkspace } from "plugins/sortingview/gui/WorkspacePage/WorkspacePage"
import { FunctionComponent, useCallback, useMemo, useState } from "react"

type Props = {
    workspaceUri: string
    width: number
    height: number
}

const workspaceNavigationHeight = 10
const horizontalPadding = 20
const paddingTop = 5
const divStyle: React.CSSProperties = {
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    paddingTop: paddingTop
}

const useWorkspaceRoute2 = (workspaceUri: string) => {
    // const location = useLocation()
    // const history = useHistory()
    const [workspaceRoute, setWorkspaceRoute] = useState<WorkspaceRoute>({page: 'workspace'})
    // const query = useMemo(() => (QueryString.parse(location.search.slice(1))), [location])
    // const workspaceRouteString = (query['workspaceRoute'] || '') as string
    // useEffect(() => {
    //     let r: WorkspaceRoute
    //     if (workspaceRouteString) {
    //         try {
    //             r = JSON.parse(decodeURIComponent(workspaceRouteString))
    //         }
    //         catch(err) {
    //             console.warn('Error parsing workspace route', workspaceRouteString)
    //             r = {page: 'workspace'}
    //         }
    //     }
    //     else {
    //         r = {page: 'workspace'}
    //     }
    //     setWorkspaceRoute(r)
    // }, [workspaceRouteString])
    const workspaceRouteDispatch = useCallback((action: WorkspaceRouteAction) => {
        const newWorkspaceRoute = workspaceRouteReducer(workspaceRoute, action)
        // const a = encodeURIComponent(JSON.stringify(newState))
        // const query2 = {...query}
        // query2['workspaceRoute'] = a
        // const search2 = queryString(query2)
        // history.push({...location, search: search2})
        setWorkspaceRoute(newWorkspaceRoute)
    }, [workspaceRoute])
    // }, [workspaceRoute, history, location, query])
    
    return useMemo(() => ({workspaceRoute, workspaceRouteDispatch}), [workspaceRoute, workspaceRouteDispatch])
}

const WorkspaceComponent: FunctionComponent<Props> = ({workspaceUri, width, height}) => {
    const {workspace, workspaceDispatch} = useSortingViewWorkspace(workspaceUri)
    const {workspaceRoute, workspaceRouteDispatch} = useWorkspaceRoute2(workspaceUri)

    return (
        <MountainViewSetup>
            <div className="WorkspacePage" style={divStyle}>
                <WorkspaceView
                    workspace={workspace}
                    workspaceDispatch={workspaceDispatch}
                    workspaceRoute={workspaceRoute}
                    workspaceRouteDispatch={workspaceRouteDispatch}
                    width={width - horizontalPadding * 2}
                    height={height - workspaceNavigationHeight - paddingTop}
                    workspaceUri={workspaceUri}
                />
            </div>
        </MountainViewSetup>
    )
}

export default WorkspaceComponent