import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@fluentui/react/lib/Icon';

import addTabAndActivate from '../../helpers/addTabAndActivate';

const StyledTab = styled.div`
  flex: 0 0 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7rem 1rem;
  background-color: ${({ theme, activeTab }) =>
    activeTab ? theme.bg.activeTabBg : theme.bg.tabBg};
  user-select: none;
  animation: ${({ theme, pulse }) =>
    pulse ? 'pulse 1s ease-out infinite' : 'none'};
  transition: all 0.3s ease-in-out;
  &:hover {
    background-color: ${({ theme }) => theme.bg.selectedBg};
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0px ${({ theme }) => theme.bg.accentBg};
    }
    100% {
      box-shadow: 0 0 0 50px rgba(0, 0, 0, 0);
    }
  }
`;

const StyledTabIcon = styled(Icon)`
  font-size: 70%;
`;

const PlusTab = () => {
  const tabs = useSelector((state) => state.tabs);
  const dispatch = useDispatch();

  return (
    <StyledTab
      onClick={() => addTabAndActivate(dispatch)}
      pulse={tabs.length === 0}
    >
      <StyledTabIcon iconName="Add" />
    </StyledTab>
  );
};

export default PlusTab;
