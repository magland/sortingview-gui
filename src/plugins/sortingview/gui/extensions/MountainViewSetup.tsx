import { createExtensionContext } from 'labbox-react/extensionSystem/ExtensionContext';
import ExtensionsSetup from 'labbox-react/extensionSystem/ExtensionsSetup';
import React, { FunctionComponent } from 'react';
import { LabboxPlugin } from '../pluginInterface';
import registerExtensions from './registerExtensions';

const extensionContext = createExtensionContext<LabboxPlugin>()
registerExtensions(extensionContext)
const MountainViewSetup: FunctionComponent = ({children}) => {
    return (
        <ExtensionsSetup extensionContext={extensionContext}>
            {children}
        </ExtensionsSetup>
    )
}

export default MountainViewSetup