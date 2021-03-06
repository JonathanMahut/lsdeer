import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import TabContent from './TabContent';
import PlusTab from './PlusTab';
import LoadingScreen from '../LoadingScreen';

const StyledConentContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  position: relative;
`;

const StyledNoTab = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.bg.appBg};
  position: relative;
  overflow: hidden;
`;

const StyledHint = styled.div`
  margin-top: 2rem;
  font-size: 1.5rem;
  color: gray;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const TabContentContainer = () => {
  const tabs = useSelector((state) => state.tabs);
  const activeTab = useSelector((state) => state.activeTab);
  const loading = useSelector((state) => state.loading);

  const currentTabObject = tabs.find((item) => item.id === activeTab);

  const renderCurrentTab = () => {
    return <TabContent key={currentTabObject.id} {...currentTabObject} />;
  };

  const renderContent = () => {
    switch (loading) {
      case true:
        return <LoadingScreen />;
      case false: {
        if (tabs.length > 0 && currentTabObject && currentTabObject.id) {
          return renderCurrentTab();
        } else {
          return (
            <StyledNoTab>
              <PlusTab />
              <StyledHint>Click button or press ctrl+t</StyledHint>
            </StyledNoTab>
          );
        }
      }
      default:
        return <LoadingScreen />;
    }
  };

  return <StyledConentContainer>{renderContent()}</StyledConentContainer>;
};

export default TabContentContainer;
