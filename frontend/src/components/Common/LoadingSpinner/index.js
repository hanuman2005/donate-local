import React from 'react';
import {
  SpinnerContainer,
  Spinner,
  SpinnerText,
  FullPageSpinner
} from './styledComponents';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullPage = false,
  color = '#4facfe' 
}) => {
  if (fullPage) {
    return (
      <FullPageSpinner>
        <Spinner size={size} color={color} />
        <SpinnerText>{text}</SpinnerText>
      </FullPageSpinner>
    );
  }

  return (
    <SpinnerContainer>
      <Spinner size={size} color={color} />
      {text && <SpinnerText>{text}</SpinnerText>}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;