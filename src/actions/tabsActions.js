import {
  SET_TABS,
  CLOSE_ALL_TABS,
  ADD_TAB,
  CLOSE_TAB,
  OPEN_DIRECTORY,
  TEST_ACTION,
  SET_PROPERTY,
} from './types';

const { ipcRenderer } = window.require('electron');

export const lsDir = (path) => {
  ipcRenderer.send('ls-directory', path);
};

export const setTabs = (tabs) => {
  return {
    type: SET_TABS,
    payload: tabs,
  };
};

export const addTab = (tab) => {
  return {
    type: ADD_TAB,
    payload: tab,
  };
};

export const closeTab = (id) => {
  return {
    type: CLOSE_TAB,
    payload: id,
  };
};

// Sets tab property (for example isLocked etc)
export const setTabProperty = (id, propname, propval) => {
  return {
    type: SET_PROPERTY,
    payload: {
      id,
      propname,
      propval,
    },
  };
};

export const lockTab = (id) => {
  return setTabProperty(id, 'isLocked', true);
};

export const unlockTab = (id) => {
  return setTabProperty(id, 'isLocked', false);
};

export const setScroll = (id, scroll) => {
  return setTabProperty(id, 'scroll', scroll);
};

export const closeAllTabs = () => {
  return {
    type: CLOSE_ALL_TABS,
  };
};

export const openDirectory = (tabId, newPath, newContent) => {
  return {
    type: OPEN_DIRECTORY,
    payload: {
      id: tabId,
      newPath,
      newContent,
    },
  };
};

export const testAction = () => (dispatch) => {
  ipcRenderer.on('test-response', (event, data) => {
    dispatch({
      type: TEST_ACTION,
      payload: 'test',
    });
  });

  ipcRenderer.send('test');
};
