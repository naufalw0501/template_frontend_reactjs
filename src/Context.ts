import React from 'react';
import { ConfirmationAlertEntity, MiniAlertConfirmationEntity, MiniAlertEntity } from './views/layout/alert/AlertEntity';
import { UserAuthInterface } from './data/interface/UserInterface';
const AppContext = React.createContext<{
    contextAccessToken: string,
    contextUserEntity: UserAuthInterface | null,
    setContextUserEntity: (val: UserAuthInterface | null) => void,
    setContextLoading: (val: boolean) => void,
    contextShowMiniAlertFunc: (val: MiniAlertEntity) => void,
    contextShowMiniAlertConfirmationFunc: (val: MiniAlertConfirmationEntity) => void,
    contextShowConfirmationAlertFunc: (val: ConfirmationAlertEntity) => void,
}>({
    contextAccessToken: '', 
    contextUserEntity: null,
    setContextUserEntity: (val: UserAuthInterface | null) => void {},
    setContextLoading: (boolean) => void {},
    contextShowMiniAlertFunc: (val: MiniAlertEntity) => void {},
    contextShowMiniAlertConfirmationFunc: (val: MiniAlertConfirmationEntity) => void {},
    contextShowConfirmationAlertFunc: (val: ConfirmationAlertEntity) => void {},
});
export default AppContext;