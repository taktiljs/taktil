import ApiProxy from './ApiProxy';
import * as api from '../../typings/api';

import BrowsingSession from './BrowsingSession';
import BrowserFilterColumn from './BrowserFilterColumn';


class PresetBrowsingSession extends BrowsingSession {
    constructor (principal: api.PresetBrowsingSession) {
        super(principal);
        this._extendMethodClassMap({
            'getCategoryFilter': BrowserFilterColumn,
            'getPresetTypeFilter': BrowserFilterColumn,
            'getFileTypeFilter': BrowserFilterColumn,
        });
    }
}


export default PresetBrowsingSession;