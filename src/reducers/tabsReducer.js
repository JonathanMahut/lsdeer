import {
  SET_TABS,
  CLOSE_ALL_TABS,
  ADD_TAB,
  CLOSE_TAB,
  OPEN_DIR,
  TEST_ACTION,
} from '../actions/types';

const tabsReducer = function (state = [], action) {
  switch (action.type) {
    case SET_TABS:
      return action.payload;
    case ADD_TAB:
      return [...state, action.payload];
    case CLOSE_TAB:
      return state.filter((item) => item.id !== action.payload);
    case CLOSE_ALL_TABS:
      return [];
    case OPEN_DIR: {
      const { id, newPath, newContent } = action.payload;
      return state.map((tab) => {
        if (tab.id === id) {
          tab.name = newPath.split('/').pop();
          tab.path = newPath;
          tab.content = newContent;
          delete tab.createNew;
        }
        return tab;
      });
    }
    case TEST_ACTION:
      return state;
    default:
      return state;
  }
};

export default tabsReducer;
